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

  async findUserByUserNameAndPass(
    userName: string,
    password: string,
  ): Promise<Users> {
    return await this.users.findOne({
      where: { userName, password },
    });
  }
}
