import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, type ObjectId } from 'mongoose';
import { Event } from '../../libs/dto/event/event';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { LikeService } from '../like/like.service';
import { EventInput } from '../../libs/dto/event/event.input';
import { Message } from '../../libs/enums/common.enum';
import { Member } from '../../libs/dto/member/member';
import { T } from '../../libs/types/common';

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
}
