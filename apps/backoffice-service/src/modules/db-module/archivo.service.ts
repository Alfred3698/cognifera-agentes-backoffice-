import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Archivo } from '../../database/entities/userV2/archivo.entity';

@Injectable()
export class ArchivoDBService {
  repositoriesLoaded: boolean;
  constructor(
    @InjectRepository(Archivo)
    private readonly archivoRepository: Repository<Archivo>,
  ) {}

  async save(file: Archivo) {
    await this.archivoRepository.save(file);
  }
}
