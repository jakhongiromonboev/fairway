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

export enum EventLocation {
	SEOUL = 'SEOUL',
	BUSAN = 'BUSAN',
	INCHEON = 'INCHEON',
	DAEGU = 'DAEGU',
	GWANGJU = 'GWANGJU',
	DAEJEON = 'DAEJEON',
	JEJU = 'JEJU',
}

registerEnumType(EventLocation, {
	name: 'EventLocation',
});

export enum ReservationStatus {
	CONFIRMED = 'CONFIRMED',
	CANCELLED = 'CANCELLED',
	ATTENDED = 'ATTENDED',
}
registerEnumType(ReservationStatus, {
	name: 'ReservationStatus',
});
