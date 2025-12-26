import { NestFactory } from '@nestjs/core';
import { FairwayBatchModule } from './fairway-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(FairwayBatchModule);
  await app.listen(process.env.PORT_BATCH ?? 3000);
}
bootstrap();
