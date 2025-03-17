import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { RentPropertyServiceModule } from '../../src/cebolla-service.module';

describe('rent-properties Service (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RentPropertyServiceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
});
