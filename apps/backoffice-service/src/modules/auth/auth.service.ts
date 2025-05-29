import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersDto } from './auth.dto';
import { UsersDBService } from '../db-module/users.service';
import { InvalidCredentialsException } from './invalid-credentials.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userDbService: UsersDBService,
  ) {}

  async validateUser(userName: string, pass: string): Promise<any> {
    const user = await this.userDbService.findUserByUserNameAndPass(
      userName,
      pass,
    );
    if (user) {
      const { ...result } = user;
      return {
        username: user.userName,
        sub: result.id,
        roles: result.roles,
        scope: 'read:messages',
      };
    }
    throw new InvalidCredentialsException();
  }
  async validateUserV2(nombre: string, password: string): Promise<any> {
    const user = await this.userDbService.findUserV2ByUserNameAndPass(
      nombre,
      password,
    );
    if (user) {
      const { ...result } = user;
      return {
        username: user.nombre,
        sub: result.id,
        roles: [],
        scope: 'read:messages',
      };
    }
    throw new InvalidCredentialsException();
  }

  async login(user: UsersDto, isV2 = false): Promise<{ access_token: string }> {
    let payload;
    if (isV2) {
      payload = await this.validateUserV2(user.userName, user.password);
    } else {
      payload = await this.validateUser(user.userName, user.password);
    }

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
