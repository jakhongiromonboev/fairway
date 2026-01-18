import { Schema } from 'mongoose';
import { EventType, EventStatus, EventLocation } from '../libs/enums/event.enum';

const EventAvailableDateSchema = {
	date: {
		type: Date,
		required: true,
	},
	startTime: {
		type: String,
		required: true,
	},
	endTime: {
		type: String,
		required: true,
	},
	capacity: {
		type: Number,
		required: true,
	},
	booked: {
		type: Number,
		default: 0,
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

		eventPeriod: {
			startDate: {
				type: Date,
				required: true,
			},
			endDate: {
				type: Date,
				required: true,
			},
		},

		eventAvailableDates: {
			type: [EventAvailableDateSchema],
			required: true,
		},

		eventViews: {
			type: Number,
			default: 0,
		},

		eventLikes: {
			type: Number,
			default: 0,
		},

		eventComments: {
			type: Number,
			default: 0,
		},

		memberId: {
			//AGENT
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
EventSchema.index({ 'eventPeriod.startDate': 1, 'eventPeriod.endDate': 1 });
EventSchema.index({ eventViews: -1 });
EventSchema.index({ memberId: 1, eventTitle: 1 }, { unique: true });

export default EventSchema;
