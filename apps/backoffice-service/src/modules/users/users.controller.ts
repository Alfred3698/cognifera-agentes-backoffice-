import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { ChangePasswordDto, CreateUserDto, UserResponseDto } from './users.dto';
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

  @Delete(':id')
  @ApiOperation({ summary: 'Borrado lógico de un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Usuario borrado lógicamente.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async softDeleteUser(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return await this.usersService.softDeleteUser(id);
  }

  @Get('agente')
  @ApiOperation({ summary: 'Validar el token JWT' })
  @ApiResponse({
    status: 200,
    description: 'Token JWT válido.',
  })
  @ApiResponse({ status: 401, description: 'Token JWT inválido.' })
  @UseGuards(JwtAuthGuard)
  async getAgenteByUserId(@Req() request: Request): Promise<any> {
    const { userId } = (<any>request).user;
    return await this.usersService.getAgenteByUserId(userId);
  }

  @Post('change-password')
  @ApiOperation({ summary: 'Cambiar la contraseña de un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Contraseña cambiada exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Contraseña actual incorrecta.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @UseGuards(JwtAuthGuard)
  async changePassword(
    @Req() request: Request,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { userId } = (<any>request).user;
    await this.usersService.changePassword(userId, changePasswordDto);
    return { message: 'Contraseña cambiada exitosamente.' };
  }
}
