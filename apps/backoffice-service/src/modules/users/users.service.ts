import {
  Injectable,
  ConflictException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateUserDto, UserResponseDto } from './users.dto';
import { UsersDBService } from '../db-module/users.service';
import { DbErrorCodes } from '../../constants/common';
import * as crypto from 'crypto';
import { UdgConfigParamService } from '../elasticsearch/udgConfigParamService';
import { MailService } from '../mail/mail.service';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class UsersService {
  constructor(
    private readonly usersDBService: UsersDBService,
    private readonly udgConfigParamService: UdgConfigParamService,
    private readonly mailService: MailService,
  ) {}
  // async onModuleInit() {
  //   const templatePath = path.join(
  //     process.cwd(),
  //     'apps/backoffice-service/src/template/registro_usuario.html',
  //   );
  //   const templateContent = fs.readFileSync(templatePath, 'utf-8');
  //   await this.mailService.enviarCorreo(
  //     'alfred3698@gmail.com',
  //     'prueba',
  //     '',
  //     templateContent,
  //   );
  // }

  async validateUser(userId: string): Promise<UserResponseDto> {
    const user = await this.usersDBService.findUserById(userId);
    if (user) {
      return user;
    }
    return null;
  }

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
      await this.udgConfigParamService.saveConfigParams(newUser.id);
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

  async softDeleteUser(userId: string): Promise<{ deleted: boolean }> {
    const user = await this.usersDBService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    await this.usersDBService.deleteUserById(userId);
    return { deleted: true };
  }

  async getAgenteByUserId(userId: string): Promise<any> {
    const user = await this.usersDBService.findUserV2ById(userId, false);
    if (!user.agente) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user.agente;
  }
}
