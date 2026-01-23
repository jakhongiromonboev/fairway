import { Module } from '@nestjs/common';
import { EventReservationResolver } from './event-reservation.resolver';
import { EventReservationService } from './event-reservation.service';
import { MongooseModule } from '@nestjs/mongoose';
import EventReservationSchema from '../../schemas/EventReservation.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { EventModule } from '../event/event.module';
import EventSchema from '../../schemas/Event.model';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'EventReservation', schema: EventReservationSchema },
			{ name: 'Event', schema: EventSchema },
		]),
		AuthModule,
		MemberModule,
		EventModule,
	],
	providers: [EventReservationResolver, EventReservationService],
	exports: [EventReservationService],
})
export class EventReservationModule {}
