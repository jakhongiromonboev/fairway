import { Schema } from 'mongoose';

const EventParticipantSchema = new Schema(
	{
		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		eventId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Event',
		},

		isParticipated: {
			type: Boolean,
			default: false,
		},

		joinedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
		collection: 'event_participants',
	},
);

EventParticipantSchema.index({ memberId: 1, eventId: 1 }, { unique: true });
EventParticipantSchema.index({ memberId: 1, isParticipated: 1 });

export default EventParticipantSchema;
