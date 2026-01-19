import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { EventType, EventStatus, EventLocation } from '../../enums/event.enum';
import { Member, TotalCounter } from '../member/member';
import { MeLiked } from '../like/like';

@ObjectType()
class EventAvailableDate {
	@Field(() => Date)
	date: Date;

	@Field(() => String)
	startTime: string;

	@Field(() => String)
	endTime: string;

	@Field(() => Int)
	capacity: number;

	@Field(() => Int)
	booked: number;
}

@ObjectType()
class EventPeriod {
	@Field(() => Date)
	startDate: Date;

	@Field(() => Date)
	endDate: Date;
}

@ObjectType()
export class Event {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => EventType)
	eventType: EventType;

	@Field(() => EventStatus)
	eventStatus: EventStatus;

	@Field(() => String)
	eventTitle: string;

	@Field(() => EventLocation)
	eventLocation: EventLocation;

	@Field(() => String)
	eventAddress: string;

	@Field(() => String, { nullable: true })
	eventDesc?: string;

	@Field(() => [String])
	eventImages: string[];

	@Field(() => EventPeriod)
	eventPeriod: EventPeriod;

	@Field(() => [EventAvailableDate])
	eventAvailableDates: EventAvailableDate[];

	@Field(() => Int)
	eventViews: number;

	@Field(() => Int)
	eventLikes: number;

	@Field(() => Int)
	eventComments: number;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation **/
	@Field(() => Member, { nullable: true })
	memberData?: Member;

	@Field(() => [MeLiked], { nullable: true })
	meLiked?: MeLiked[];
}

@ObjectType()
export class Events {
	@Field(() => [Event])
	list: Event[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
