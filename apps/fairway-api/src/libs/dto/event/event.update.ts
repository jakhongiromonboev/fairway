import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { EventStatus } from '../../enums/event.enum';
import type { ObjectId } from 'mongoose';

@InputType()
class EventPeriodUpdate {
	@IsOptional()
	@Field(() => Date, { nullable: true })
	startDate?: Date;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	endDate?: Date;
}

@InputType()
export class EventUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => EventStatus, { nullable: true })
	eventStatus?: EventStatus;

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	eventTitle?: string;

	@IsOptional()
	@Length(3, 500)
	@Field(() => String, { nullable: true })
	eventDesc?: string;

	@IsOptional()
	@Field(() => [String], { nullable: true })
	eventImages?: string[];

	@IsOptional()
	@Field(() => EventPeriodUpdate, { nullable: true })
	eventPeriod?: EventPeriodUpdate;

	@IsOptional()
	@Min(1)
	@Field(() => Int, { nullable: true })
	dailyCapacity?: number;

	@IsOptional()
	@Field(() => String, { nullable: true })
	dailyStartTime?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	dailyEndTime?: string;
}
