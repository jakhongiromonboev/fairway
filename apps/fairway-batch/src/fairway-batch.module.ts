import { Module } from '@nestjs/common';
import { FairwayBatchController } from './fairway-batch.controller';
import { FairwayBatchService } from './fairway-batch.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from 'apps/fairway-api/src/schemas/Member.model';
import ProductSchema from 'apps/fairway-api/src/schemas/Product.model';
import EventSchema from 'apps/fairway-api/src/schemas/Event.model';

@Module({
	imports: [
		ConfigModule.forRoot(),
		DatabaseModule,
		ScheduleModule.forRoot(),
		MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
		MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
		MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),
	],
	controllers: [FairwayBatchController],
	providers: [FairwayBatchService],
})
export class FairwayBatchModule {}
