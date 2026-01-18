import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { ReservationStatus } from '../../enums/event.enum';
import type { ObjectId } from 'mongoose';

@InputType()
export class EventReservationUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => ReservationStatus, { nullable: true })
	reservationStatus?: ReservationStatus;
}
