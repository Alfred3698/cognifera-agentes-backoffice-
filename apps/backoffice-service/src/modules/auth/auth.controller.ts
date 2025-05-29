import { Controller, Post, UseGuards, Body, Get, Req } from '@nestjs/common';
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
}
