import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, type ObjectId } from 'mongoose';
import { Event, Events } from '../../libs/dto/event/event';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { LikeService } from '../like/like.service';
import { AllEventsInquiry, EventInput, EventsInquiry } from '../../libs/dto/event/event.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { Member } from '../../libs/dto/member/member';
import { StatisticModifier, T } from '../../libs/types/common';
import { EventStatus } from '../../libs/enums/event.enum';
import { ViewInput } from '../../libs/dto/view/view.input';
import { ViewGroup } from '../../libs/enums/view.enum';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeGroup } from '../../libs/enums/like.enum';
import { lookupAuthMemberLiked, lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { EventUpdate } from '../../libs/dto/event/event.update';

@Injectable()
export class EventService {
	constructor(
		@InjectModel('Event') private readonly eventModel: Model<Event>,
		private readonly memberService: MemberService,
		private readonly viewService: ViewService,
		private readonly likeService: LikeService,
	) {}

	public async createEvent(memberId: ObjectId, input: EventInput): Promise<Event> {
		try {
			input.memberId = memberId;

			const member: Member = await this.memberService.getMember(null, memberId);
			if (!member) throw new BadRequestException(Message.NO_DATA_FOUND);

			if (new Date(input.eventPeriod.startDate) > new Date(input.eventPeriod.endDate)) {
				throw new BadRequestException(Message.INVALID_DATE_RANGE);
			}

			const { eventPeriod, dailyCapacity, dailyEndTime, dailyStartTime } = input;
			const eventAvailableDates = [];
			let currentDate = new Date(eventPeriod.startDate);
			const endDate = new Date(eventPeriod.endDate);

			while (currentDate <= endDate) {
				eventAvailableDates.push({
					date: new Date(currentDate),
					startTime: dailyStartTime,
					endTime: dailyEndTime,
					capacity: dailyCapacity,
					booked: 0,
				});
				currentDate.setDate(currentDate.getDate() + 1);
			}

			const eventData: T = {
				...input,
				eventAvailableDates,
			};
			delete eventData.dailyCapacity;
			delete eventData.dailyStartTime;
			delete eventData.dailyEndTime;

			const result = await this.eventModel.create(eventData);

			await this.memberService.memberStatsEditor({
				_id: memberId,
				targetKey: 'memberEvents',
				modifier: 1,
			});

			return result;
		} catch (err) {
			console.log('Error,EventService.createEvent', err);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getEvent(memberId: ObjectId, eventId: ObjectId): Promise<Event> {
		const search: T = {
			_id: eventId,
			eventStatus: { $ne: EventStatus.DELETE },
		};

		const targetEvent: Event = await this.eventModel.findOne(search).lean().exec();
		if (!targetEvent) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput: ViewInput = { memberId: memberId, viewRefId: eventId, viewGroup: ViewGroup.EVENT };
			const newView = await this.viewService.recordView(viewInput);
			if (newView) {
				await this.eventStatsEditor({
					_id: eventId,
					targetKey: 'eventViews',
					modifier: 1,
				});
				targetEvent.eventViews++;
			}

			const likeInput: LikeInput = {
				memberId: memberId,
				likeRefId: eventId,
				likeGroup: LikeGroup.EVENT,
			};
			targetEvent.meLiked = await this.likeService.checkLikeExistence(likeInput);
		}

		targetEvent.memberData = await this.memberService.getMember(null, targetEvent.memberId);
		return targetEvent;
	}

	public async getEvents(memberId: ObjectId, input: EventsInquiry): Promise<Events> {
		const { eventType, eventLocation, text } = input.search;
		const match: T = {
			eventStatus: { $ne: EventStatus.DELETE },
		};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (eventType) match.eventType = eventType;
		if (eventLocation) match.eventLocation = eventLocation;
		if (text) match.eventTitle = { $regex: new RegExp(text, 'i') };
		if (input?.search?.memberId) {
			match.memberId = shapeIntoMongoObjectId(input.search.memberId);
		}

		console.log('match:', match);

		const result = await this.eventModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupAuthMemberLiked(memberId),
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async updateEvent(memberId: ObjectId, input: EventUpdate): Promise<Event> {
		const { _id, eventStatus, eventPeriod, dailyStartTime, dailyEndTime, dailyCapacity } = input;
		const search: T = {
			_id: _id,
			memberId: memberId,
			eventStatus: { $ne: EventStatus.DELETE },
		};
		const shouldRegenerate = !!eventPeriod || !!dailyCapacity || !!dailyStartTime || !!dailyEndTime;
		const updateData: T = { ...input };

		if (shouldRegenerate) {
			const currentEvent = await this.eventModel.findOne(search).exec();
			if (!currentEvent) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

			//BLOCK IF BOOKING EXISTS
			const hasBookings = currentEvent.eventAvailableDates.some((d) => d.booked > 0);
			if (hasBookings) {
				throw new BadRequestException(Message.EVENT_HAS_ACTIVE_BOOKINGS);
			}

			const baseDate = currentEvent.eventAvailableDates[0];
			const period = eventPeriod ?? currentEvent.eventPeriod;

			if (new Date(period.startDate) > new Date(period.endDate)) {
				throw new BadRequestException(Message.INVALID_DATE_RANGE);
			}

			const capacity = dailyCapacity ?? baseDate.capacity;
			const startTime = dailyStartTime ?? baseDate.startTime;
			const endTime = dailyEndTime ?? baseDate.endTime;

			const eventAvailableDates = [];
			let currentDate = new Date(period.startDate);
			const endDate = new Date(period.endDate);

			while (currentDate <= endDate) {
				eventAvailableDates.push({
					date: new Date(currentDate),
					startTime,
					endTime,
					capacity,
					booked: 0,
				});
				currentDate.setDate(currentDate.getDate() + 1);
			}

			updateData.eventAvailableDates = eventAvailableDates;
		}

		delete updateData.dailyCapacity;
		delete updateData.dailyStartTime;
		delete updateData.dailyEndTime;

		const result: Event = await this.eventModel.findOneAndUpdate(search, updateData, { new: true });
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (eventStatus === EventStatus.DELETE) {
			await this.memberService.memberStatsEditor({
				_id: memberId,
				targetKey: 'memberEvents',
				modifier: -1,
			});
		}

		return result;
	}

	/** STATS EDITOR **/
	public async eventStatsEditor(input: StatisticModifier): Promise<Event> {
		const { _id, targetKey, modifier } = input;
		return await this.eventModel
			.findByIdAndUpdate(
				_id,
				{ $inc: { [targetKey]: modifier } },
				{
					new: true,
				},
			)
			.exec();
	}

	public async getAgentEvents(memberId: ObjectId, input: EventsInquiry): Promise<Events> {
		const { eventType } = input.search;
		const match: T = {
			memberId: memberId,
			eventStatus: { $ne: EventStatus.DELETE },
		};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (eventType) match.eventType = eventType;

		const result = await this.eventModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async likeTargetEvent(memberId: ObjectId, likeRefId: ObjectId): Promise<Event> {
		const target: Event = await this.eventModel.findOne({
			_id: likeRefId,
			eventStatus: { $ne: EventStatus.DELETE },
		});
		if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const input: LikeInput = {
			memberId: memberId,
			likeRefId: likeRefId,
			likeGroup: LikeGroup.EVENT,
		};

		const modifier: number = await this.likeService.toggleLike(input);
		const result = await this.eventStatsEditor({
			_id: likeRefId,
			targetKey: 'eventLikes',
			modifier: modifier,
		});

		if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);

		return result;
	}

	/** ADMIN **/

	public async getAllEventsByAdmin(input: AllEventsInquiry): Promise<Events> {
		const { eventStatus, eventType } = input.search;
		const match: T = {};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (eventStatus) match.eventStatus = eventStatus;
		if (eventType) match.eventType = eventType;

		const result = await this.eventModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async updateEventByAdmin(input: EventUpdate): Promise<Event> {
		const { _id, eventStatus } = input;

		const search: T = {
			_id: _id,
			eventStatus: { $ne: EventStatus.DELETE },
		};

		const result = await this.eventModel.findOneAndUpdate(search, input, { new: true }).exec();
		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (eventStatus === EventStatus.DELETE) {
			await this.memberService.memberStatsEditor({
				_id: result.memberId,
				targetKey: 'memberEvents',
				modifier: -1,
			});
		}

		return result;
	}

	public async removeEventByAdmin(eventId: ObjectId): Promise<Event> {
		const search: T = {
			_id: eventId,
			eventStatus: EventStatus.DELETE,
		};

		const result = await this.eventModel.findOneAndDelete(search).exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

		return result;
	}
}
