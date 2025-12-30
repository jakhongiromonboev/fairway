import { registerEnumType } from '@nestjs/graphql';

export enum NotificationType {
	LIKE = 'LIKE',
	COMMENT = 'COMMENT',
	FOLLOW = 'FOLLOW',
	EVENT_JOINED = 'EVENT_JOINED',
	EVENT_REMINDER = 'EVENT_REMINDER',
	EVENT_UPDATED = 'EVENT_UPDATED',
	EVENT_CANCELLED = 'EVENT_CANCELLED',
}

registerEnumType(NotificationType, {
	name: 'NotificationType',
});

export enum NotificationGroup {
	MEMBER = 'MEMBER', //follow
	EVENT = 'EVENT', // event related
}

registerEnumType(NotificationGroup, {
	name: 'NotificationGroup',
});

export enum NotificationStatus {
	WAIT = 'WAIT', // unread
	READ = 'READ', // read
}

registerEnumType(NotificationStatus, {
	name: 'NotificationStatus',
});
