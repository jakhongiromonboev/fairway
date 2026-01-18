import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { ReservationStatus } from '../../enums/event.enum';
import { Member, TotalCounter } from '../member/member';
import { Event } from '../event/event';

@ObjectType()
export class EventReservation {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => String)
	eventId: ObjectId;

	@Field(() => Date)
	participationDate: Date;

	@Field(() => Int)
	numberOfPeople: number;

	@Field(() => ReservationStatus)
	reservationStatus: ReservationStatus;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation **/
	@Field(() => Member, { nullable: true })
	memberData?: Member;

	@Field(() => Event, { nullable: true })
	eventData?: Event;
}

@ObjectType()
export class EventReservations {
	@Field(() => [EventReservation])
	list: EventReservation[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
