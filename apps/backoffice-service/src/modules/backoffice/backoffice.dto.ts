import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  ArrayNotEmpty,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatRequest {
  @ApiProperty({
    description: 'ID de la conversación',
    example: '234234',
  })
  @IsString()
  @IsNotEmpty()
  idConversacion: string;

  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'Gibran Garcia',
  })
  @IsString()
  @IsNotEmpty()
  pushName: string;

  @ApiProperty({
    description: 'Consulta de búsqueda',
    example: 'sabes de matemáticas',
  })
  @IsString()
  @IsNotEmpty()
  q: string;

  @ApiProperty({
    description: 'Campos a buscar',
    example: ['*'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  tosearch: string[];

  @ApiProperty({
    description: 'Número máximo de resultados',
    example: 20,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  max: number;
}
