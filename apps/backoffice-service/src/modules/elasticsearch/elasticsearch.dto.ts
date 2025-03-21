import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfigParamDto {
  @ApiProperty({
    description: 'ID del documento',
    example: '1',
  })
  id: string;

  @ApiProperty({
    description: 'Límite máximo de tokens de consulta',
    example: 100,
  })
  limit_max_query_tokens: number;

  @ApiProperty({
    description: 'Límite máximo de caracteres',
    example: 1000,
  })
  limit_max_caracters: number;

  @ApiProperty({
    description: 'Límite mínimo de caracteres',
    example: 10,
  })
  limit_min_caracters: number;

  @ApiProperty({
    description: 'Límite de tiempo entre conversaciones',
    example: 60,
  })
  limit_time_between_conversations: number;

  @ApiProperty({
    description: 'Base de conocimiento',
    example: ['conocimiento1', 'conocimiento2'],
  })
  base_conocimiento: string[];
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
