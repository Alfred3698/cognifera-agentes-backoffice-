import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsObject, IsOptional, IsString } from 'class-validator';
import { MessageDto } from '../backoffice/backoffice.dto';

export class ChoiceDto {
  @ApiProperty({
    description: 'Índice de la elección',
    example: 0,
  })
  @IsInt()
  index: number;

  @ApiProperty({
    description: 'Mensaje de la elección',
    type: MessageDto,
  })
  @IsObject()
  message: MessageDto;

  @ApiProperty({
    description: 'Logprobs de la elección',
    example: null,
  })
  @IsOptional()
  @IsObject()
  logprobs: any;

  @ApiProperty({
    description: 'Razón de finalización de la elección',
    example: 'stop',
  })
  @IsString()
  finishReason: string;
}

export class UsageDto {
  @ApiProperty({
    description: 'Número de tokens del prompt',
    example: 50,
  })
  @IsInt()
  prompt_tokens: number;

  @ApiProperty({
    description: 'Número de tokens de la completación',
    example: 100,
  })
  @IsInt()
  completion_tokens: number;

  @ApiProperty({
    description: 'Número total de tokens',
    example: 150,
  })
  @IsInt()
  total_tokens: number;
}
export class ChatCompletionDto {
  @ApiProperty({
    description: 'ID de la respuesta',
    example: 'cmpl-1a2b3c4d5e6f7g8h9i0j',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Tipo de objeto',
    example: 'text_completion',
  })
  @IsString()
  object: string;

  @ApiProperty({
    description: 'Fecha de creación en formato Unix timestamp',
    example: 1616161616,
  })
  @IsInt()
  created: number;

  @ApiProperty({
    description: 'Modelo utilizado',
    example: 'gpt-3.5-turbo',
  })
  @IsString()
  model: string;

  @ApiProperty({
    description: 'Lista de elecciones',
    type: [ChoiceDto],
  })
  choices: ChoiceDto[];

  @ApiProperty({
    description: 'Uso de la API',
  })
  @IsObject()
  usage: UsageDto;

  @ApiProperty({
    description: 'Huella digital del sistema',
    example: null,
  })
  @IsOptional()
  @IsObject()
  systemFingerprint: any;
}
