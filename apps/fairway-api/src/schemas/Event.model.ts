import { Schema } from 'mongoose';
import { EventLocation, EventStatus, EventType } from '../libs/enums/event.enum';

const EventAvailableDateSchema = {
	startDate: {
		type: Date,
	},
	endDate: {
		type: Date,
	},
};

const EventSchema = new Schema(
	{
		eventType: {
			type: String,
			enum: EventType,
			required: true,
		},

		eventStatus: {
			type: String,
			enum: EventStatus,
			default: EventStatus.UPCOMING,
		},

		eventTitle: {
			type: String,
			required: true,
		},

		eventLocation: {
			type: String,
			enum: EventLocation,
			required: true,
		},

		eventDesc: {
			type: String,
		},

		eventImages: {
			type: [String],
			default: [],
		},

		eventAvailableDates: {
			type: [EventAvailableDateSchema],
			default: [],
		},

		eventViews: {
			type: Number,
			default: 0,
		},

		eventLikes: {
			type: Number,
			default: 0,
		},

		eventParticipants: {
			type: Number,
			default: 0,
		},

		eventComments: {
			type: Number,
			default: 0,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		deletedAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
		collection: 'events',
	},
);

EventSchema.index({ eventStatus: 1, eventType: 1 });
EventSchema.index({ eventViews: -1 });
EventSchema.index({ memberId: 1, eventTitle: 1 }, { unique: true });

export default EventSchema;
