import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { EventService } from './event.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UseGuards } from '@nestjs/common';
import { Event } from '../../libs/dto/event/event';
import { EventInput } from '../../libs/dto/event/event.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';

@Resolver()
export class EventResolver {
	constructor(private readonly eventService: EventService) {}

	@Roles(MemberType.AGENT)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Event)
	public async createEvent(@Args('input') input: EventInput, @AuthMember('_id') memberId: ObjectId): Promise<Event> {
		console.log('Mutation: createEvent');
		input.memberId = memberId;
		return await this.eventService.createEvent(memberId, input);
	}
}
