import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfigParamDto {
  @ApiProperty({
    description: 'ID del documento',
    example: '1',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Límite máximo de tokens de consulta',
    example: 100,
  })
  @IsNumber()
  limitMaxQueryTokens: number;

  @ApiProperty({
    description: 'Límite máximo de caracteres',
    example: 1000,
  })
  @IsNumber()
  limitMaxCaracters: number;

  @ApiProperty({
    description: 'Límite mínimo de caracteres',
    example: 10,
  })
  @IsNumber()
  limitMinCaracters: number;

  @ApiProperty({
    description: 'Límite de tiempo entre conversaciones',
    example: 60,
  })
  @IsNumber()
  limitTimeBetweenConversations: number;

  @ApiProperty({
    description: 'Límite máximo de preguntas por día',
    example: 60,
  })
  @IsNumber()
  limitMaxQuestionsPerDay: number;

  @ApiProperty({
    description: 'Base de conocimiento',
    example: ['conocimiento1', 'conocimiento2'],
  })
  @IsArray()
  @IsOptional()
  baseConocimiento: string[];

  entrenamiento: EntrenamientoDto;
}

export interface EntrenamientoDto {
  contextoGlobal: string[];
  restricciones: RestriccionesDto;
  preguntasYRespuestas: string[];
}

export interface RestriccionesDto {
  permitido: any[];
  denegado: any[];
}

export class ConversacionDTO {
  @ApiProperty({
    description: 'Texto de la conversación',
    example: '¿Cuál es la capital de Francia?',
  })
  text: string;

  @ApiProperty({
    description: 'Tipo de conversación',
    example: 'question',
  })
  type: string;

  @ApiProperty({
    description: 'Referencias de la conversación',
    example: ['ref1', 'ref2'],
  })
  referencias: string[];

  @ApiProperty({
    description: 'Marca de tiempo de la conversación',
    example: '2023-03-20T12:34:56Z',
  })
  timestamp: Date | number;
}

export class ConversacionPrincipalDTO {
  @ApiProperty({
    description: 'ID  del documento',
    example: '12345',
  })
  id: string;
  @ApiProperty({
    description: 'ID de la conversación',
    example: '12345',
  })
  idConversacion: string;

  @ApiProperty({
    description: 'Usuario',
    example: 'user123',
  })
  user: string;

  @ApiProperty({
    description: 'Marca de tiempo',
    example: 1616161616161,
  })
  timestamp: Date | number;

  @ApiProperty({
    description: 'Lista de conversaciones',
    type: [ConversacionDTO],
  })
  conversaciones: ConversacionDTO[];
}
