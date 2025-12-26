import { Injectable } from '@nestjs/common';

@Injectable()
export class FairwayBatchService {
  getHello(): string {
    return 'Hello World BATCH!';
  }
}
