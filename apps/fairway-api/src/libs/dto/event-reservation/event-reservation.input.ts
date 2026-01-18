import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Min } from 'class-validator';
import type { ObjectId } from 'mongoose';
import { ReservationStatus } from '../../enums/event.enum';
import { Direction } from '../../enums/common.enum';
import { availableReservationSorts } from '../../config';

@InputType()
export class EventReservationInput {
	@IsNotEmpty()
	@Field(() => String)
	eventId: ObjectId;

	@IsNotEmpty()
	@Field(() => Date)
	participationDate: Date;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	numberOfPeople: number;

	memberId?: ObjectId;
}

@InputType()
class ERISearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	eventId?: ObjectId;

	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: ObjectId;

	@IsOptional()
	@Field(() => ReservationStatus, { nullable: true })
	reservationStatus?: ReservationStatus;
}

@InputType()
export class EventReservationsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableReservationSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => ERISearch)
	search: ERISearch;
}
