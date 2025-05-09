import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto, UserResponseDto } from './users.dto';
import { UsersDBService } from '../db-module/users.service';
import { DbErrorCodes } from '../../constants/common';
import * as crypto from 'crypto';
@Injectable()
export class UsersService {
  constructor(private readonly usersDBService: UsersDBService) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const apiKey = crypto.randomBytes(16).toString('hex'); // Genera una clave de 32 caracteres hexadecimales

      const newUser = await this.usersDBService.save({
        id: undefined,
        userName: createUserDto.userName,
        password: createUserDto.password,
        apiKeys: [{ id: undefined, key: apiKey, user: undefined }],
        roles: undefined,
      });
      return newUser;
    } catch (error) {
      if (error.code === DbErrorCodes.UNIQUE_VIOLATION) {
        throw new ConflictException('Usuario duplicado');
      }
      throw error;
    }
  }

  async getAllUsers(): Promise<Omit<UserResponseDto, 'password'>[]> {
    const users = await this.usersDBService.findAll();
    return users.map(({ password, ...user }) => user);
  }
}
