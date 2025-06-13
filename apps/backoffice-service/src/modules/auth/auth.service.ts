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

  verify(token: string, options?: any): Promise<any> {
    try {
      return this.jwtService.verify(token, options);
    } catch (error) {
      throw new InvalidCredentialsException();
    }
  }
  sign(payload: any, options?: any): string {
    return this.jwtService.sign(payload, options);
  }

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
  async validateUserV2(
    correo: string,
    password: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userDbService.findUserV2ByUserNameAndPass(
      correo,
      password,
    );

    if (user) {
      const { roles } = user;

      // Extraer los nombres de los roles y permisos
      const roleNames = roles.map((role) => role.name);
      const permissions = roles
        .map((role) => role.permissions.map((permission) => permission.name))
        .reduce((acc, curr) => acc.concat(curr), []);

      const payload = {
        username: user.nombre,
        sub: user.id,
        roles: roleNames,
        permissions,
        scope: 'read:messages',
      };

      // Generar access token
      const accessToken = this.jwtService.sign(payload, {
        secret: process.env.SECRET_TOKEN,
        expiresIn: '5m', // Expiración del access token
      });

      // Generar refresh token
      const refreshToken = this.jwtService.sign(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: '1d', // Expiración del refresh token
      });

      return { access_token: accessToken, refresh_token: refreshToken };
    }

    throw new InvalidCredentialsException();
  }

  async login(user: UsersDto, isV2 = false): Promise<{ access_token: string }> {
    let payload;
    if (isV2) {
      return await this.validateUserV2(user.userName, user.password);
    } else {
      payload = await this.validateUser(user.userName, user.password);
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
