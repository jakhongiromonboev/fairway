import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { EventService } from './event.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { Event, Events } from '../../libs/dto/event/event';
import { AllEventsInquiry, EventInput, EventsInquiry } from '../../libs/dto/event/event.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { EventUpdate } from '../../libs/dto/event/event.update';
import { AuthGuard } from '../auth/guards/auth.guard';

@Resolver()
export class EventResolver {
	constructor(private readonly eventService: EventService) {}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Event)
	public async createEvent(
		@Args('input') input: EventInput, //
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Event> {
		console.log('Mutation: createEvent');
		input.memberId = memberId;
		return await this.eventService.createEvent(memberId, input);
	}

	@UseGuards(WithoutGuard)
	@Query((returns) => Event)
	public async getEvent(
		@Args('eventId') input: string, //
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Event> {
		console.log('Query:getEvent');
		const eventId = shapeIntoMongoObjectId(input);
		return await this.eventService.getEvent(memberId, eventId);
	}

	@UseGuards(WithoutGuard)
	@Query(() => Events)
	public async getEvents(
		@Args('input') input: EventsInquiry, //
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Events> {
		console.log('Query: getEvents');
		return await this.eventService.getEvents(memberId, input);
	}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation(() => Event)
	public async updateEvent(
		@Args('input') input: EventUpdate, //
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Event> {
		console.log('Mutation:updateEvent');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.eventService.updateEvent(memberId, input);
	}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Query(() => Events)
	public async getAgentEvents(
		@Args('input') input: EventsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Events> {
		console.log('Query: getAgentEvents');
		return await this.eventService.getAgentEvents(memberId, input);
	}

	/** LIKE **/
	@UseGuards(AuthGuard)
	@Mutation(() => Event)
	public async likeTargetEvent(
		@Args('eventId') input: string, //
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Event> {
		console.log('Mutation: likeTargetEvent');
		const likeRefId = shapeIntoMongoObjectId(input);
		return await this.eventService.likeTargetEvent(memberId, likeRefId);
	}

	/** ADMIN **/

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Events)
	public async getAllEventsByAdmin(
		@Args('input') input: AllEventsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Events> {
		console.log('Query: getAllEventsByAdmin');
		return await this.eventService.getAllEventsByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Event)
	public async updateEventByAdmin(
		@Args('input') input: EventUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Event> {
		console.log('Mutation: updateEventByAdmin');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.eventService.updateEventByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Event)
	public async removeEventByAdmin(@Args('eventId') input: string): Promise<Event> {
		console.log('Mutation: removeEventByAdmin');
		const eventId = shapeIntoMongoObjectId(input);
		return await this.eventService.removeEventByAdmin(eventId);
	}
}
