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
    // const user = { username, password: await bcrypt.hash(pass, 10) };
    // const isPasswordMatching = await bcrypt.compare(pass, user.password);
    const user = await this.userDbService.findUserByUserNameAndPass(
      userName,
      pass,
    );
    if (user) {
      const { ...result } = user;
      return result;
    }
    throw new InvalidCredentialsException();
  }

  async login(user: UsersDto) {
    const result = await this.validateUser(user.userName, user.password);
    const payload = {
      username: user.userName,
      sub: result.id,
      roles: result.roles,
      scope: 'read:messages',
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
