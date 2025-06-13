import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Req,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersDto } from './auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() user: UsersDto) {
    return this.authService.login(user);
  }

  @Post('v2/login')
  async loginV2(@Body() user: UsersDto) {
    return this.authService.login(user, true);
  }
  @Get('userinfo')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Req() request: any) {
    const user = request.user;
    return { valid: true, user };
  }

  @Post('refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    try {
      // Validar el refresh token
      const payload = await this.authService.verify(refreshToken, {
        secret: process.env.REFRESH_TOKEN_SECRET,
      });

      // Generar un nuevo access token
      const newAccessToken = await this.authService.sign(
        { sub: payload.sub, username: payload.username },
        { secret: process.env.SECRET_TOKEN, expiresIn: '5m' },
      );

      return { access_token: newAccessToken };
    } catch (err) {
      throw new HttpException('Invalid refresh token', HttpStatus.UNAUTHORIZED);
    }
  }
}
