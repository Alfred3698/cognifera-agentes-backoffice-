import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Users } from '../../database/entities/users.entity';
import { UserV2 } from '../../database/entities/userV2/user.entity';
import { Archivo } from '../../database/entities/userV2/archivo.entity';

@Injectable()
export class UsersDBService {
  repositoriesLoaded: boolean;
  constructor(
    @InjectRepository(Users)
    private readonly users: Repository<Users>,
    @InjectRepository(UserV2)
    private readonly userV2: Repository<UserV2>,

    @InjectRepository(Archivo)
    private readonly archivoRepository: Repository<Archivo>,
  ) {}

  async findTestMeId(id: number): Promise<Users> {
    return await this.users.findOne({
      where: { id: id },
    });
  }
  async findUserById(id: string): Promise<Users> {
    return await this.users.findOne({
      where: { id: id },
    });
  }

  async findArchivoById(archivoId: number): Promise<Archivo> {
    const archivo = await this.archivoRepository.findOne({
      where: {
        id: archivoId,
      },
      relations: ['user'],
    });

    return archivo;
  }

  async findUserV2ById(id: string, includeArchivo: boolean): Promise<UserV2> {
    const relations = ['agente'];

    if (includeArchivo) {
      relations.push('archivo');
    }

    return await this.userV2.findOne({
      where: { id: id },
      relations,
    });
  }

  async deleteUserById(id: string) {
    await this.users.softDelete(id);
  }

  async findAll(): Promise<Users[]> {
    return await this.users.find({ relations: ['apiKeys'] });
  }
  async save(user: Users): Promise<Users> {
    return await this.users.save(user);
  }
  async findUserByUserNameAndPass(
    userName: string,
    password: string,
  ): Promise<Users> {
    return await this.users.findOne({
      where: { userName, password },
    });
  }

  async findUserV2ByUserNameAndPass(
    correo: string,
    password: string,
  ): Promise<UserV2> {
    return await this.userV2.findOne({
      where: { correo, password },
      relations: ['roles', 'roles.permissions'],
    });
  }

  async findUserByApiKey(apiKey: string): Promise<Users | null> {
    return await this.users
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.apiKeys', 'apiKey') // Realiza un join con la relación apiKeys
      .where('apiKey.key = :apiKey', { apiKey }) // Filtra por la clave API
      .getOne(); // Obtiene un único usuario
  }
}
