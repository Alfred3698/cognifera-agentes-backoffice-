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

export class MessageDto {
  @ApiProperty({
    description: 'Rol del mensaje',
    example: 'user',
  })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({
    description: 'Contenido del mensaje',
    example: 'Hola, ¿cómo estás?',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
export class ResponseModelDto {
  @ApiProperty({
    description: 'Modelo de la conversación',
    example: 'gpt-3.5-turbo',
  })
  @IsString()
  model: string;

  @ApiProperty({
    description: 'Lista de mensajes',
    type: [MessageDto],
  })
  messages: MessageDto[];
}

export class ChatResponseDto {
  @ApiProperty({
    description: 'Estado de la respuesta',
    example: 'success',
  })
  @IsString()
  status: string;

  @ApiProperty({
    description: 'Mensaje de la respuesta',
    example: 'Operación realizada con éxito',
  })
  @IsString()
  message: string;

  @ApiProperty({
    description: 'Datos de la respuesta',
    example: {},
  })
  data: any;
}

export class ResponseBotDto {
  @ApiProperty({
    description: 'ID de la conversación',
    example: '12345',
  })
  @IsString()
  idConversacion: string;

  @ApiProperty({
    description: 'Texto de la conversación del usuario',
    example: 'Hola, ¿cómo estás?',
  })
  @IsString()
  txtConversacionUser: string;

  @ApiProperty({
    description: 'Texto de la conversación del bot',
    example: 'Estoy bien, gracias por preguntar.',
  })
  @IsString()
  txtConversacionBot: string;
}
