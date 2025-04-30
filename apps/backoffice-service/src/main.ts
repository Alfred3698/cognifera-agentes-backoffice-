import 'config/env/env.config';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { registerSwagger } from 'utils/swagger';
import { SERVICE_NAME } from './constants/common';
import { BackofficeServiceModule } from './backoffice-service.module';
import { Logger } from '@b-accel-logger/logger.service';

const logger = new Logger({ context: 'Backoffice Service' });

async function bootstrap() {
  const app = await NestFactory.create(BackofficeServiceModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization, x-api-key',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  registerSwagger(app, SERVICE_NAME);
  await app.startAllMicroservicesAsync();
  await app.listen(process.env.REPORT_SERVICE_PORT);
  logger.log(`Microservice is listening on: ${await app.getUrl()}`);
}
bootstrap();
