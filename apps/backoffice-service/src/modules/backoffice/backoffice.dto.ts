import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsNumber,
  ArrayNotEmpty,
  Max,
  Min,
  IsOptional,
  isBoolean,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ConfigParamDto } from '../elasticsearch/elasticsearch.dto';

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

export class UpdateConfigParamDto {
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
    description: 'Indica si el modelo está activo para RAG',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActiveRag: boolean;
}

export class UpdateGenetic {
  @ApiProperty({
    description: 'ID del documento',
    example: '1',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Array de contextos, puede ser uno o más',
    example: ['contexto1', 'contexto2'],
  })
  @IsArray()
  contexto: string[];
}

export class updateConfigRestricciones extends UpdateGenetic {
  @ApiProperty({
    description: 'contextos permitidos',
    example: true,
  })
  @IsBoolean()
  permitido: boolean;
}

export class PreguntasYRespuestasDto {
  @ApiProperty({
    description: 'Array de preguntas, puede ser uno o más',
    example: 'contexto1',
  })
  preguntas: string;

  @ApiProperty({
    description: 'Array de respuestas, puede ser uno o más',
    example: 'contexto1',
  })
  @IsArray()
  respuestas: string;
}
export class updateConfigPreguntasYRespuestas {
  @ApiProperty({
    description: 'ID del documento',
    example: '1',
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'Array de preguntas y respuestas',
    type: [PreguntasYRespuestasDto],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true }) // Valida cada elemento del array
  preguntasYRespuestas: PreguntasYRespuestasDto[];
}
