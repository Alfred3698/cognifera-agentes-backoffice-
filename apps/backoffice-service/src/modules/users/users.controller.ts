import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto, UserResponseDto } from './users.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guard/roles.guard';
import { Request } from 'express';
@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return await this.usersService.createUser(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios (sin contraseñas)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente.',
    type: [UserResponseDto], // Especificar que es un array de UserResponseDto
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getAllUsers(): Promise<Omit<UserResponseDto, 'password'>[]> {
    return await this.usersService.getAllUsers();
  }
  @Get('validate')
  @ApiOperation({ summary: 'Validar el token JWT' })
  @ApiResponse({
    status: 200,
    description: 'Token JWT válido.',
  })
  @ApiResponse({ status: 401, description: 'Token JWT inválido.' })
  @UseGuards(JwtAuthGuard)
  async validateToken(
    @Req() request: Request,
  ): Promise<{ valid: boolean; userName }> {
    const { userId } = (<any>request).user;
    const user = await this.usersService.validateUser(userId);
    return { valid: true, userName: user.userName };
  }
}
