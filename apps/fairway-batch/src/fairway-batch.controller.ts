import { Controller, Get, Logger } from '@nestjs/common';
import { FairwayBatchService } from './fairway-batch.service';
import { Cron, Timeout } from '@nestjs/schedule';
import { BATCH_ROLLBACK, BATCH_TOP_AGENTS, BATCH_TOP_EVENTS, BATCH_TOP_PRODUCTS } from './lib/config';

@Controller()
export class FairwayBatchController {
	private logger: Logger = new Logger('FairwayBatchController');

	constructor(private readonly batchService: FairwayBatchService) {}

	@Timeout(1000)
	handleTimeout() {
		this.logger.debug('FAIRWAY BATCH SERVER READY');
	}

	@Cron('00 00 01 * * *', { name: BATCH_ROLLBACK })
	public async batchRollback() {
		try {
			this.logger['context'] = BATCH_ROLLBACK;
			this.logger.debug('EXECUTED');
			await this.batchService.batchRollback();
		} catch (err) {
			this.logger.error(err);
		}
	}

	@Cron('20 00 01 * * *', { name: BATCH_TOP_PRODUCTS })
	public async batchTopProducts() {
		try {
			this.logger['context'] = BATCH_TOP_PRODUCTS;
			this.logger.debug('EXECUTED');
			await this.batchService.batchTopProducts();
		} catch (err) {
			this.logger.error(err);
		}
	}

	@Cron('30 00 01 * * *', { name: BATCH_TOP_EVENTS })
	public async batchTopEvents() {
		try {
			this.logger['context'] = BATCH_TOP_EVENTS;
			this.logger.debug('EXECUTED');
			await this.batchService.batchTopEvents();
		} catch (err) {
			this.logger.error(err);
		}
	}

	@Cron('40 00 01 * * *', { name: BATCH_TOP_AGENTS })
	public async batchTopAgents() {
		try {
			this.logger['context'] = BATCH_TOP_AGENTS;
			this.logger.debug('EXECUTED');
			await this.batchService.batchTopAgents();
		} catch (err) {
			this.logger.error(err);
		}
	}

	@Get()
	getHello(): string {
		return this.batchService.getHello();
	}
}
