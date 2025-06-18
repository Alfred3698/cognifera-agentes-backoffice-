import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'juan',
  })
  @IsNotEmpty()
  @IsString()
  userName: string;

  @ApiProperty({
    description:
      'Contraseña del usuario. Debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial.',
    example: 'Password123!',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'La contraseña debe tener al menos una letra mayúscula, un número y un carácter especial.',
  })
  password: string;
}

export class ApiKeyDto {
  @ApiProperty({
    description: 'ID único de la API key',
    example: 'e81457ec-ef95-492e-8b3b-cc1d883f59a2',
  })
  id: string;

  @ApiProperty({
    description: 'Clave API generada para el usuario',
    example: 'c64d85aefb2ff15b2ec7f1ee8e8bbcde',
  })
  key: string;

  @ApiProperty({
    description: 'Fecha de creación de la API key',
    example: '2025-05-07T12:00:07.376Z',
  })
  createdAt?: Date;
}

export class UserResponseDto {
  @ApiProperty({
    description: 'ID único del usuario',
    example: 'f28c92d4-173a-4533-b1d0-5150bc11b18d',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre de usuario',
    example: 'gato',
  })
  userName: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'perro',
  })
  password: string;

  @ApiProperty({
    description: 'Lista de claves API asociadas al usuario',
    type: [ApiKeyDto],
  })
  apiKeys: ApiKeyDto[];

  @ApiProperty({
    description: 'Fecha de creación del usuario',
    example: '2025-05-07T12:00:07.376Z',
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'Fecha de última actualización del usuario',
    example: '2025-05-07T12:00:07.376Z',
  })
  updatedAt?: Date;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Contraseña actual del usuario.',
    example: 'Password123!',
  })
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    description:
      'Nueva contraseña del usuario. Debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial.',
    example: 'NewPassword123!',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'La contraseña debe tener al menos una letra mayúscula, un número y un carácter especial.',
  })
  newPassword: string;
}
