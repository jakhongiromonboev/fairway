import { Module } from '@nestjs/common';
import { FairwayBatchController } from './fairway-batch.controller';
import { FairwayBatchService } from './fairway-batch.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [FairwayBatchController],
  providers: [FairwayBatchService],
})
export class FairwayBatchModule {}
