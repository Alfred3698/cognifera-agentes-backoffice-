import {
  HttpException,
  HttpService,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Logger } from '@b-accel-logger/logger.service';
import { PropertiesDBService } from '../db-module/properties.service';
import {
  ChatRequest,
  ChatResponseDto,
  MessageDto,
  ResponseBotDto,
  ResponseModelDto,
  UpdateConfigParamDto,
  updateConfigPreguntasYRespuestas,
  updateConfigRestricciones,
  UpdateGenetic,
} from './backoffice.dto';
import { UdgConfigParamService } from '../elasticsearch/udgConfigParamService';
import { ConversacionesService } from '../elasticsearch/conversaciones.service';
import { ChatgptService } from '../chatgpt/chatgptService';
import moment from 'moment-timezone';
import { MAX_QUESTIONS_PER_DAY } from '../../constants/common';

@Injectable()
export class BackofficeService {
  constructor(
    private readonly propertiesDBService: PropertiesDBService,
    private readonly udgConfigParamService: UdgConfigParamService,
    private readonly conversacionesService: ConversacionesService,
    private readonly chatGptService: ChatgptService,
    private httpService: HttpService,
    private logger: Logger,
  ) {}

  async getChat(
    params: ChatRequest,
    userId: string,
    isNewKnowledgeBase: boolean,
  ): Promise<ChatResponseDto> {
    const { q, pushName } = params;
    const idConversacion = params.idConversacion;
    this.logger.log('int getChat with params:', idConversacion);
    const { questionCount } =
      await this.conversacionesService.getConversationQuestionsCountByDay(
        idConversacion,
        moment().format('YYYY-MM-DD'),
        userId,
      );

    const config = await this.getConfigParams(userId);
    const limitMaxQuestionsPerDay =
      config[0].limitMaxQuestionsPerDay ?? MAX_QUESTIONS_PER_DAY;
    if (questionCount >= limitMaxQuestionsPerDay) {
      this.logger.log(
        `Límite de preguntas alcanzado para el día: ${questionCount} - ${idConversacion}`,
      );
      const botResponse = new ResponseBotDto();
      botResponse.idConversacion = idConversacion;
      botResponse.txtConversacionUser = q;
      botResponse.txtConversacionBot =
        'Lo siento, has alcanzado el límite de preguntas por día. Por favor, intenta nuevamente mañana.';
      return {
        status: 'Success',
        message: null,
        data: botResponse,
      };
    }

    const baseConocimiento = await this.getBaseConocimiento(
      q,
      userId,
      isNewKnowledgeBase,
    );
    const messages = await this.buildInitialMessages(
      baseConocimiento,
      q,
      idConversacion,
      userId,
    );
    const respModel = this.buildResponseModel(messages);
    const chatResponse = await this.getChatResponse(respModel);

    this.validateChatResponse(chatResponse);

    const botResponse = this.buildBotResponse(
      idConversacion,
      q,
      chatResponse.choices[0].message.content,
    );

    return await this.handleConversacion(
      pushName, // Cambié nameUser a pushName
      messages,
      idConversacion,
      q,
      botResponse,
      userId,
    );
  }

  private async getBaseConocimiento(
    question: string,
    userId: string,
    isNewKnowledgeBase: boolean,
  ): Promise<string> {
    const existingReglas = await this.getConfigParams(userId);
    let ragKnowledgeBase = '';
    this.logger.log('int getBaseConocimiento with params:');
    const reglasToUpdate = existingReglas[0];
    if (!isNewKnowledgeBase) {
      return reglasToUpdate.baseConocimiento.join('');
    } else if (reglasToUpdate.entrenamiento.contextoGlobal.length > 0) {
      if (reglasToUpdate.isActiveRag) {
        ragKnowledgeBase = await this.ragKnowledgeBase(question);
      }

      reglasToUpdate.entrenamiento.contextoGlobal.join('');
      if (reglasToUpdate.entrenamiento.restricciones.denegado.length > 0) {
        const denegado =
          'NO debes de responder a las preguntas que se encuentran en la lista de restricciones:';
        reglasToUpdate.entrenamiento.contextoGlobal[0] =
          reglasToUpdate.entrenamiento.contextoGlobal +
          ' ' +
          denegado +
          ' ' +
          reglasToUpdate.entrenamiento.restricciones.denegado.join('. ');
      }
      if (reglasToUpdate.entrenamiento.restricciones.permitido.length > 0) {
        const permitido =
          'Puedo responder a la pregunta porque contiene palabras o frases que están en la lista de restricciones.';
        reglasToUpdate.entrenamiento.contextoGlobal[0] =
          reglasToUpdate.entrenamiento.contextoGlobal +
          ' ' +
          permitido +
          ' ' +
          reglasToUpdate.entrenamiento.restricciones.permitido.join('. ');
      }
      if (reglasToUpdate.entrenamiento.preguntasYRespuestas.length > 0) {
        const preguntasYRespuestas =
          'Utiliza la siguiente información para responder a las preguntas:';
        reglasToUpdate.entrenamiento.contextoGlobal[0] =
          reglasToUpdate.entrenamiento.contextoGlobal +
          ' ' +
          preguntasYRespuestas +
          ' ' +
          reglasToUpdate.entrenamiento.preguntasYRespuestas
            ?.map(
              (item) =>
                `Pregunta: ${item.preguntas} Respuesta: ${item.respuestas}`,
            )
            ?.join('. ');
      }
    }

    return (
      reglasToUpdate.entrenamiento.contextoGlobal.join('\n.') +
      'Ademas considera la siguiente información: ' +
      ragKnowledgeBase
    );
  }

  private async buildInitialMessages(
    baseConocimiento: string,
    q: string,
    idConversacion: string,
    userId: string,
  ): Promise<MessageDto[]> {
    const messages: MessageDto[] = [];
    messages.push({
      role: 'system',
      content: baseConocimiento,
    });

    if (idConversacion) {
      const conversacionPrincipal =
        await this.conversacionesService.getAllConversacionesByIdConversacion(
          idConversacion,
          userId,
          true,
        );
      if (conversacionPrincipal.length) {
        for (const conversacion of conversacionPrincipal[0].conversaciones) {
          const messageUser: MessageDto = {
            role: conversacion.type === 'question' ? 'user' : 'assistant',
            content: conversacion.text,
          };
          messages.push(messageUser);
        }
      }
    }

    messages.push({
      role: 'user',
      content: q,
    });

    return messages;
  }

  private buildResponseModel(messages: MessageDto[]): ResponseModelDto {
    return {
      model: 'gpt-4o-mini-2024-07-18',
      messages: messages,
    };
  }

  private async getChatResponse(respModel: ResponseModelDto): Promise<any> {
    const jsonInputString = JSON.stringify(respModel);
    this.logger.log('Request model --------->:', respModel.model);
    return await this.chatGptService.sendRequestChatCompletion(jsonInputString);
  }

  private validateChatResponse(chatResponse: any): void {
    if (
      !chatResponse ||
      !chatResponse.choices ||
      !chatResponse.choices[0] ||
      !chatResponse.choices[0].message ||
      chatResponse.choices[0].message.content === undefined
    ) {
      throw new HttpException(
        'ChatGPT response is invalid or incomplete',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private buildBotResponse(
    idConversacion: string,
    q: string,
    botContent: string,
  ): ResponseBotDto {
    const botResponse = new ResponseBotDto();
    botResponse.idConversacion = idConversacion;
    botResponse.txtConversacionUser = q;
    botResponse.txtConversacionBot = botContent;
    return botResponse;
  }

  private async handleConversacion(
    nameUser: string,
    messages: MessageDto[],
    idConversacion: string,
    q: string,
    botResponse: ResponseBotDto,
    userId: string,
  ): Promise<ChatResponseDto> {
    if (messages.length === 2) {
      idConversacion = await this.conversacionesService.createConversacion(
        nameUser,
        q,
        botResponse.txtConversacionBot,
        idConversacion,
        userId,
      );
    } else {
      await this.conversacionesService.addConversacion(
        q,
        botResponse.txtConversacionBot,
        idConversacion,
        userId,
      );
    }

    return {
      status: 'Success',
      message: null,
      data: botResponse,
    };
  }

  async getConfigParams(userId: string) {
    return await this.udgConfigParamService.getConfigParams(undefined, userId);
  }
  async _getConfigParams(userId: string) {
    const config = await this.udgConfigParamService.getConfigParams(
      undefined,
      userId,
    );
    config.forEach((item) => {
      delete item.baseConocimiento;
      delete item.entrenamiento;
      return;
    });
    return config[0];
  }

  async getConfigEntrenamiento(userId: string) {
    const config = await this.udgConfigParamService.getConfigParams(
      undefined,
      userId,
    );
    return { id: config[0].id, entrenamiento: config[0].entrenamiento };
  }

  async updateConfigParam(updates: UpdateConfigParamDto): Promise<any> {
    try {
      const configParams = await this.udgConfigParamService.getConfigParams(
        updates.id,
        undefined,
      );
      if (!configParams || configParams.length === 0) {
        this.logger.error(
          `Configuración no encontrada para el ID: ${updates.id}`,
        );
        throw new HttpException(
          'Configuración no encontrada.',
          HttpStatus.NOT_FOUND,
        );
      }

      const updateElasticSearch = {
        limit_max_query_tokens: updates.limitMaxQueryTokens,
        is_active_rag: updates.isActiveRag ?? false,
        limit_max_caracters: updates.limitMaxCaracters,
        limit_min_caracters: updates.limitMinCaracters,
        limit_time_between_conversations: updates.limitTimeBetweenConversations,
        limit_Max_questions_per_day: updates.limitMaxQuestionsPerDay,
        base_conocimiento: configParams[0].baseConocimiento,
        id: updates.id,
      };
      await this.udgConfigParamService.updateConfigParam(
        updates.id,
        updateElasticSearch,
      );

      return {
        status: 'Success',
        message: 'Configuración actualizada exitosamente.',
      };
    } catch (error) {
      throw new HttpException(
        `Error al actualizar la configuración: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateConfigContextoGlobal(data: UpdateGenetic): Promise<any> {
    try {
      const configParams = await this.udgConfigParamService.getConfigParams(
        data.id,
        undefined,
      );
      if (!configParams || configParams.length === 0) {
        this.logger.error(`Configuración no encontrada para el ID: ${data.id}`);
        throw new HttpException(
          'Configuración no encontrada.',
          HttpStatus.NOT_FOUND,
        );
      }

      const updateElasticSearch = {
        limit_max_query_tokens: configParams[0].limitMaxQueryTokens,
        limit_max_caracters: configParams[0].limitMaxCaracters,
        limit_min_caracters: configParams[0].limitMinCaracters,
        limit_time_between_conversations:
          configParams[0].limitTimeBetweenConversations,
        limit_Max_questions_per_day: configParams[0].limitMaxQuestionsPerDay,
        base_conocimiento: configParams[0].baseConocimiento,
        id: data.id,
        entrenamiento: {
          contexto_global: data.contexto,
          restricciones: {
            permitido:
              configParams[0].entrenamiento?.restricciones?.permitido ?? [],
            denegado:
              configParams[0].entrenamiento?.restricciones?.denegado ?? [],
          },
          preguntas_y_respuestas:
            configParams[0].entrenamiento.preguntasYRespuestas,
        },
      };
      await this.udgConfigParamService.updateConfigParam(
        data.id,
        updateElasticSearch,
      );

      return {
        status: 'Success',
        message: 'Configuración actualizada exitosamente.',
      };
    } catch (error) {
      throw new HttpException(
        `Error al actualizar la configuración: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateConfigRestricciones(
    data: updateConfigRestricciones,
  ): Promise<any> {
    try {
      const { permitido } = data;
      const configParams = await this.udgConfigParamService.getConfigParams(
        data.id,
        undefined,
      );
      if (!configParams || configParams.length === 0) {
        this.logger.error(`Configuración no encontrada para el ID: ${data.id}`);
        throw new HttpException(
          'Configuración no encontrada.',
          HttpStatus.NOT_FOUND,
        );
      }

      const updateElasticSearch = {
        limit_max_query_tokens: configParams[0].limitMaxQueryTokens,
        limit_max_caracters: configParams[0].limitMaxCaracters,
        limit_min_caracters: configParams[0].limitMinCaracters,
        limit_time_between_conversations:
          configParams[0].limitTimeBetweenConversations,
        limit_Max_questions_per_day: configParams[0].limitMaxQuestionsPerDay,
        base_conocimiento: configParams[0].baseConocimiento,
        id: data.id,
        entrenamiento: {
          contexto_global: configParams[0].entrenamiento?.contextoGlobal ?? [],
          restricciones: {
            permitido: permitido
              ? data.contexto
              : configParams[0].entrenamiento?.restricciones?.permitido ?? [],
            denegado: !permitido
              ? data.contexto
              : configParams[0].entrenamiento?.restricciones?.denegado ?? [],
          },
          preguntas_y_respuestas:
            configParams[0].entrenamiento.preguntasYRespuestas,
        },
      };
      await this.udgConfigParamService.updateConfigParam(
        data.id,
        updateElasticSearch,
      );

      return {
        status: 'Success',
        message: 'Configuración actualizada exitosamente.',
      };
    } catch (error) {
      throw new HttpException(
        `Error al actualizar la configuración: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateConfigPreguntas(
    data: updateConfigPreguntasYRespuestas,
  ): Promise<any> {
    try {
      const configParams = await this.udgConfigParamService.getConfigParams(
        data.id,
        undefined,
      );
      if (!configParams || configParams.length === 0) {
        this.logger.error(`Configuración no encontrada para el ID: ${data.id}`);
        throw new HttpException(
          'Configuración no encontrada.',
          HttpStatus.NOT_FOUND,
        );
      }

      const updateElasticSearch = {
        limit_max_query_tokens: configParams[0].limitMaxQueryTokens,
        limit_max_caracters: configParams[0].limitMaxCaracters,
        limit_min_caracters: configParams[0].limitMinCaracters,
        limit_time_between_conversations:
          configParams[0].limitTimeBetweenConversations,
        limit_Max_questions_per_day: configParams[0].limitMaxQuestionsPerDay,
        base_conocimiento: configParams[0].baseConocimiento,
        id: data.id,
        entrenamiento: {
          contexto_global: configParams[0].entrenamiento?.contextoGlobal ?? [],
          restricciones: {
            permitido:
              configParams[0].entrenamiento?.restricciones?.permitido ?? [],
            denegado:
              configParams[0].entrenamiento?.restricciones?.denegado ?? [],
          },
          preguntas_y_respuestas: data.preguntasYRespuestas,
        },
      };
      await this.udgConfigParamService.updateConfigParam(
        data.id,
        updateElasticSearch,
      );

      return {
        status: 'Success',
        message: 'Configuración actualizada exitosamente.',
      };
    } catch (error) {
      throw new HttpException(
        `Error al actualizar la configuración: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async ragKnowledgeBase(pregunta: string): Promise<any> {
    try {
      const { data: response } = await this.httpService
        .post(process.env.RAG_URL, {
          pregunta,
          k: 20,
        })
        .toPromise();
      //return response?.resultados?.map((item) => item?.texto).join('\n');
      return response?.respuesta;
    } catch (error) {
      this.logger.error(
        `Error retrieving knowledge base data: ${error.message}`,
      );
      throw new HttpException(
        'Error retrieving knowledge base data',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
