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
    return await this.archivoRepository.save(file);
  }

  async existsByHashAndAgente(
    hash: string,
    agenteId: string,
  ): Promise<boolean> {
    const archivo = await this.archivoRepository
      .createQueryBuilder('archivo')
      .innerJoin('archivo.user', 'user') // Relación entre Archivo y UserV2
      .innerJoin('user.agente', 'agente') // Relación entre UserV2 y Agente
      .where('archivo.hash = :hash', { hash })
      .andWhere('agente.id = :agenteId', { agenteId })
      .getOne(); // Devuelve un archivo si existe

    return !!archivo; // Devuelve true si el archivo existe, false si no
  }
}
