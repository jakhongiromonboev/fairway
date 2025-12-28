import { registerEnumType } from '@nestjs/graphql';

export enum EventType {
	TOURNAMENT = 'TOURNAMENT',
	TUTORIAL = 'TUTORIAL',
	WORKSHOP = 'WORKSHOP',
	MEETUP = 'MEETUP',
}

registerEnumType(EventType, {
	name: 'EventType',
});

export enum EventStatus {
	UPCOMING = 'UPCOMING',
	ACTIVE = 'ACTIVE',
	ENDED = 'ENDED',
	DELETE = 'DELETE',
}

registerEnumType(EventStatus, {
	name: 'EventStatus',
});
