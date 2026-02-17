import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import type { ObjectId } from 'mongoose';
import { EventType, EventStatus, EventLocation } from '../../enums/event.enum';
import { Direction } from '../../enums/common.enum';
import { availableEventSorts } from '../../config';

@InputType()
class EventPeriodInput {
	@IsNotEmpty()
	@Field(() => Date)
	startDate: Date;

	@IsNotEmpty()
	@Field(() => Date)
	endDate: Date;
}

@InputType()
export class EventInput {
	@IsNotEmpty()
	@Field(() => EventType)
	eventType: EventType;

	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	eventTitle: string;

	@IsNotEmpty()
	@Field(() => EventLocation)
	eventLocation: EventLocation;

	@IsNotEmpty()
	@Length(5, 200)
	@Field(() => String)
	eventAddress: string;

	@IsOptional()
	@Length(3, 500)
	@Field(() => String, { nullable: true })
	eventDesc?: string;

	@IsOptional()
	@Field(() => [String], { nullable: true })
	eventImages?: string[];

	@IsNotEmpty()
	@Field(() => EventPeriodInput)
	eventPeriod: EventPeriodInput;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	dailyCapacity: number;

	@IsNotEmpty()
	@Field(() => String)
	dailyStartTime: string;

	@IsNotEmpty()
	@Field(() => String)
	dailyEndTime: string;

	memberId?: ObjectId;
}

@InputType()
class EISearch {
	@IsOptional()
	@Field(() => EventStatus, { nullable: true })
	eventStatus?: EventStatus;

	@IsOptional()
	@Field(() => EventType, { nullable: true })
	eventType?: EventType;

	@IsOptional()
	@Field(() => EventLocation, { nullable: true })
	eventLocation?: EventLocation;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: ObjectId;
}

@InputType()
export class EventsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableEventSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => EISearch)
	search: EISearch;
}

/** ADMIN **/
@InputType()
class AEISearch {
	@IsOptional()
	@Field(() => EventStatus, { nullable: true })
	eventStatus?: EventStatus;

	@IsOptional()
	@Field(() => EventType, { nullable: true })
	eventType?: EventType;
}

@InputType()
export class AllEventsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableEventSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => AEISearch)
	search: AEISearch;
}
