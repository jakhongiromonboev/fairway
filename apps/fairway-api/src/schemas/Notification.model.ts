import { Schema } from 'mongoose';
import { NotificationGroup, NotificationStatus, NotificationType } from '../libs/enums/notification.enum';

const NotificationSchema = new Schema(
	{
		notificationType: {
			type: String,
			enum: NotificationType,
			required: true,
		},
		notificationStatus: {
			type: String,
			enum: NotificationStatus,
			default: NotificationStatus.WAIT,
		},
		notificationGroup: {
			type: String,
			enum: NotificationGroup,
			required: true,
		},
		notificationTitle: {
			type: String,
			required: true,
		},
		notificationDesc: {
			type: String,
		},
		authorId: {
			type: Schema.Types.ObjectId, //who did action
			required: true,
			ref: 'Member',
		},
		receiverId: {
			type: Schema.Types.ObjectId, //who is being informed
			required: true,
			ref: 'Member',
		},

		eventId: {
			type: Schema.Types.ObjectId,
			ref: 'Event',
		},
	},
	{ timestamps: true, collection: 'notifications' },
);

export default NotificationSchema;
