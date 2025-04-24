import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UsersDto {
  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'john_doe',
  })
  @IsString()
  userName: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'password123',
  })
  @IsString()
  password: string;
}
