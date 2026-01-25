import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from 'apps/fairway-api/src/libs/dto/member/member';
import { Product } from 'apps/fairway-api/src/libs/dto/product/product';
import { Event } from 'apps/fairway-api/src/libs/dto/event/event';
import { MemberStatus, MemberType } from 'apps/fairway-api/src/libs/enums/member.enum';
import { ProductStatus } from 'apps/fairway-api/src/libs/enums/product.enum';
import { EventStatus } from 'apps/fairway-api/src/libs/enums/event.enum';

@Injectable()
export class FairwayBatchService {
	constructor(
		@InjectModel('Member') private readonly memberModel: Model<Member>,
		@InjectModel('Product') private readonly productModel: Model<Product>,
		@InjectModel('Event') private readonly eventModel: Model<Event>,
	) {}

	public async batchRollback(): Promise<void> {
		await this.productModel
			.updateMany(
				{
					productStatus: ProductStatus.ACTIVE,
				},
				{ productRank: 0 },
			)
			.exec();

		await this.eventModel
			.updateMany(
				{
					eventStatus: EventStatus.UPCOMING,
				},
				{ eventRank: 0 },
			)
			.exec();

		await this.memberModel
			.updateMany(
				{
					memberStatus: MemberStatus.ACTIVE,
					memberType: MemberType.AGENT,
				},
				{ memberRank: 0 },
			)
			.exec();

		console.log('Batch Rollback completed');
	}

	public async batchTopProducts(): Promise<void> {
		const products: Product[] = await this.productModel
			.find({
				productStatus: ProductStatus.ACTIVE,
				productRank: 0,
			})
			.exec();

		const promisedList = products.map(async (product: Product) => {
			const { _id, productLikes, productViews, productStatus } = product;

			const soldBonus = productStatus === ProductStatus.SOLD ? 10 : 0;
			const rank = productLikes * 2 + productViews * 1 + soldBonus;

			return await this.productModel.findByIdAndUpdate(_id, { productRank: rank });
		});

		await Promise.all(promisedList);
		console.log(`Batch Top Products completed: ${products.length} products ranked`);
	}

	public async batchTopEvents(): Promise<void> {
		const events: Event[] = await this.eventModel
			.find({
				eventStatus: EventStatus.UPCOMING,
				eventRank: 0,
			})
			.exec();

		const promisedList = events.map(async (event: Event) => {
			const { _id, eventLikes, eventViews, eventAvailableDates } = event;

			// Calculate total reservations from booked slots
			const totalReservations = eventAvailableDates.reduce((sum, date) => sum + (date.booked || 0), 0);

			const rank = eventLikes * 2 + eventViews * 1 + totalReservations * 3;

			return await this.eventModel.findByIdAndUpdate(_id, { eventRank: rank });
		});

		await Promise.all(promisedList);
		console.log(`Batch Top Events completed: ${events.length} events ranked`);
	}

	public async batchTopAgents(): Promise<void> {
		const agents: Member[] = await this.memberModel
			.find({
				memberType: MemberType.AGENT,
				memberStatus: MemberStatus.ACTIVE,
				memberRank: 0,
			})
			.exec();

		const promisedList = agents.map(async (agent: Member) => {
			const { _id, memberProducts, memberEvents, memberLikes, memberViews } = agent;

			const rank =
				(memberProducts || 0) * 5 + (memberEvents || 0) * 4 + (memberLikes || 0) * 2 + (memberViews || 0) * 1;

			return await this.memberModel.findByIdAndUpdate(_id, { memberRank: rank });
		});

		await Promise.all(promisedList);
		console.log(`Batch Top Agents completed: ${agents.length} agents ranked`);
	}

	getHello(): string {
		return 'Welcome to Fairway Batch Server!';
	}
}
