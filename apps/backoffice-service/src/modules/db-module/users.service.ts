import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Users } from '../../database/entities/users.entity';

@Injectable()
export class UsersDBService {
  repositoriesLoaded: boolean;
  constructor(
    @InjectRepository(Users)
    private readonly users: Repository<Users>,
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

  async findUserByApiKey(apiKey: string): Promise<Users | null> {
    return await this.users
      .createQueryBuilder('user')
      .innerJoinAndSelect('user.apiKeys', 'apiKey') // Realiza un join con la relación apiKeys
      .where('apiKey.key = :apiKey', { apiKey }) // Filtra por la clave API
      .getOne(); // Obtiene un único usuario
  }
}
