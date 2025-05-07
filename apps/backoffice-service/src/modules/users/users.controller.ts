import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto, UserResponseDto } from './users.dto';

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
  async getAllUsers(): Promise<Omit<UserResponseDto, 'password'>[]> {
    return await this.usersService.getAllUsers();
  }
}
