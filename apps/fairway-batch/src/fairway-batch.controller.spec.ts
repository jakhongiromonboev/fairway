import { Test, TestingModule } from '@nestjs/testing';
import { FairwayBatchController } from './fairway-batch.controller';
import { FairwayBatchService } from './fairway-batch.service';

describe('FairwayBatchController', () => {
  let fairwayBatchController: FairwayBatchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FairwayBatchController],
      providers: [FairwayBatchService],
    }).compile();

    fairwayBatchController = app.get<FairwayBatchController>(FairwayBatchController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(fairwayBatchController.getHello()).toBe('Hello World!');
    });
  });
});
