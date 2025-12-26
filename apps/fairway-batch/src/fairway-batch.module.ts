import { Module } from '@nestjs/common';
import { FairwayBatchController } from './fairway-batch.controller';
import { FairwayBatchService } from './fairway-batch.service';

@Module({
  imports: [],
  controllers: [FairwayBatchController],
  providers: [FairwayBatchService],
})
export class FairwayBatchModule {}
