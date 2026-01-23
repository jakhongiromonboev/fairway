import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EventReservationService } from './event-reservation.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { EventReservation, EventReservations } from '../../libs/dto/event-reservation/event-reservation';
import {
	EventReservationInput,
	EventReservationsInquiry,
} from '../../libs/dto/event-reservation/event-reservation.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { EventReservationUpdate } from '../../libs/dto/event-reservation/event-reservation.update';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberType } from '../../libs/enums/member.enum';
import { Roles } from '../auth/decorators/roles.decorator';

@Resolver()
export class EventReservationResolver {
	constructor(private readonly eventReservationService: EventReservationService) {}

	@UseGuards(AuthGuard)
	@Mutation((returns) => EventReservation)
	public async createReservation(
		@Args('input') input: EventReservationInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<EventReservation> {
		console.log('Mutation: createReservation');
		input.memberId = shapeIntoMongoObjectId(memberId);
		return await this.eventReservationService.createReservation(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation((returns) => EventReservation)
	public async cancelReservation(
		@Args('input') input: String,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<EventReservation> {
		console.log('Mutation: cancelReservation');
		const reservationId = shapeIntoMongoObjectId(input);
		return await this.eventReservationService.cancelReservation(memberId, reservationId);
	}

	//AGENT
	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Query((returns) => EventReservations)
	public async getEventReservations(
		@Args('input') input: EventReservationsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<EventReservations> {
		console.log('Query: getEventReservations');
		return await this.eventReservationService.getEventReservations(memberId, input);
	}

	//USER
	@UseGuards(AuthGuard)
	@Query(() => EventReservations)
	public async getMyReservations(
		@Args('input') input: EventReservationsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<EventReservations> {
		console.log('Query: getMyReservations');
		return await this.eventReservationService.getMyReservations(memberId, input);
	}
}
