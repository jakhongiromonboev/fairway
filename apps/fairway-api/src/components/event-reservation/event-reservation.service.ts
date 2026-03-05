import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, type ObjectId } from 'mongoose';
import { EventReservation, EventReservations } from '../../libs/dto/event-reservation/event-reservation';
import { MemberService } from '../member/member.service';
import { EventService } from '../event/event.service';
import {
	EventReservationInput,
	EventReservationsInquiry,
} from '../../libs/dto/event-reservation/event-reservation.input';
import { Event } from '../../libs/dto/event/event';
import { Direction, Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';
import { ReservationStatus } from '../../libs/enums/event.enum';
import { lookupAuthMemberLiked, lookUpEvent, lookupMember, shapeIntoMongoObjectId } from '../../libs/config';

@Injectable()
export class EventReservationService {
	constructor(
		@InjectModel('EventReservation') private readonly eventReservationModel: Model<EventReservation>,
		@InjectModel('Event') private readonly eventModel: Model<Event>,
		private readonly memberService: MemberService,
		private readonly eventService: EventService,
	) {}

	public async createReservation(memberId: ObjectId, input: EventReservationInput): Promise<EventReservation> {
		const { eventId, participationDate, numberOfPeople } = input;

		const event: Event = await this.eventService.getEvent(null, eventId);
		if (!event) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const normalizedDate: Date = new Date(participationDate);
		normalizedDate.setUTCHours(0, 0, 0, 0);

		const dateSlot = event.eventAvailableDates.find((slot) => {
			const slotDate = new Date(slot.date);
			slotDate.setUTCHours(0, 0, 0, 0);
			return slotDate.getTime() === normalizedDate.getTime();
		});
		if (!dateSlot) {
			throw new BadRequestException(Message.RESERVATION_DATE_NOT_AVAILABLE);
		}

		if (dateSlot.booked + numberOfPeople > dateSlot.capacity) {
			throw new BadRequestException(`Only ${dateSlot.capacity - dateSlot.booked} spots remaining for this date`);
		}

		try {
			const reservationData = {
				...input,
				participationDate: normalizedDate,
			};

			const result = await this.eventReservationModel.create(reservationData);
			await this.updateEventDateBooked(eventId, normalizedDate, numberOfPeople);

			return result;
		} catch (err) {
			console.log('Error, EventReservationService.createReservation', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	/** HELPER METHOD **/
	private async updateEventDateBooked(
		eventId: ObjectId,
		participationDate: Date,
		numberOfPeople: number,
	): Promise<void> {
		const event = await this.eventModel.findById(eventId).exec();
		if (!event) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const dateSlot = event.eventAvailableDates.find(
			(slot) => new Date(slot.date).toDateString() === new Date(participationDate).toDateString(),
		);

		if (!dateSlot) throw new InternalServerErrorException('Date slot not found');

		dateSlot.booked += numberOfPeople;
		await event.save();
	}
	/** HELPER METHOD **/

	public async cancelReservation(memberId: ObjectId, reservationId: ObjectId): Promise<EventReservation> {
		const search: T = { _id: reservationId, memberId: memberId, reservationStatus: ReservationStatus.CONFIRMED };

		const reservation: EventReservation = await this.eventReservationModel
			.findOneAndUpdate(search, { reservationStatus: ReservationStatus.CANCELLED }, { new: true })
			.exec();

		if (!reservation) throw new InternalServerErrorException(Message.RESERVATION_NOT_FOUND);

		await this.updateEventDateBooked(reservation.eventId, reservation.participationDate, -reservation.numberOfPeople);

		return reservation;
	}

	public async getEventReservations(memberId: ObjectId, input: EventReservationsInquiry): Promise<EventReservations> {
		const { eventId, reservationStatus } = input.search;
		if (!eventId) throw new BadRequestException(Message.BAD_REQUEST);

		const match: T = { eventId: shapeIntoMongoObjectId(eventId) };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (reservationStatus) match.reservationStatus = reservationStatus;

		const result = await this.eventReservationModel
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

	public async getMyReservations(memberId: ObjectId, input: EventReservationsInquiry): Promise<EventReservations> {
		const { reservationStatus } = input.search;
		const match: T = { memberId: memberId };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (reservationStatus) match.reservationStatus = reservationStatus;

		const result = await this.eventReservationModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookUpEvent,
							{ $unwind: '$eventData' },
							{
								$lookup: {
									from: 'members',
									localField: 'eventData.memberId',
									foreignField: '_id',
									as: 'eventData.memberData',
								},
							},
							{ $unwind: '$eventData.memberData' },
							lookupAuthMemberLiked(memberId, '$eventData._id'),
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}
}
