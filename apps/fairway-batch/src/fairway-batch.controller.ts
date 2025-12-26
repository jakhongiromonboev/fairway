import { Controller, Get } from '@nestjs/common';
import { FairwayBatchService } from './fairway-batch.service';

@Controller()
export class FairwayBatchController {
  constructor(private readonly fairwayBatchService: FairwayBatchService) {}

  @Get()
  getHello(): string {
    return this.fairwayBatchService.getHello();
  }
}
