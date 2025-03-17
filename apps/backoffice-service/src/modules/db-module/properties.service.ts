import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { TestMe } from '../../database/entities/test-me.entity';

@Injectable()
export class PropertiesDBService {
  repositoriesLoaded: boolean;
  constructor(
    @InjectRepository(TestMe)
    private readonly cardRepository: Repository<TestMe>,
  ) {}

  async findTestMeId(id: number): Promise<TestMe> {
    return await this.cardRepository.findOne({
      where: { id: id },
    });
  }
}
