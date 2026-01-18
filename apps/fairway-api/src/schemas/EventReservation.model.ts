import { Schema } from 'mongoose';
import { ReservationStatus } from '../libs/enums/event.enum';

const EventReservationSchema = new Schema(
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

		participationDate: {
			type: Date,
			required: true,
		},

		numberOfPeople: {
			type: Number,
			required: true,
			default: 1,
			min: 1,
		},

		reservationStatus: {
			type: String,
			enum: ReservationStatus,
			default: ReservationStatus.CONFIRMED,
		},
	},

	{
		timestamps: true,
		collection: 'eventReservations',
	},
);

EventReservationSchema.index({ memberId: 1, eventId: 1, participationDate: 1 }, { unique: true });
EventReservationSchema.index({ eventId: 1, reservationStatus: 1 });
EventReservationSchema.index({ memberId: 1, reservationStatus: 1 });

export default EventReservationSchema;
