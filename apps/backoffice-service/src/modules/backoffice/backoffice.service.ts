import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';

import { Logger } from '@b-accel-logger/logger.service';
import { PropertiesDBService } from '../db-module/properties.service';
import { TestMe } from '../../database/entities/test-me.entity';
import {
  ChatRequest,
  ChatResponseDto,
  MessageDto,
  ResponseBotDto,
  ResponseModelDto,
} from './backoffice.dto';
import { UdgConfigParamService } from '../elasticsearch/udgConfigParamService';
import { ConversacionesService } from '../elasticsearch/conversacionesService';
import { ChatgptService } from '../chatgpt/chatgptService';

@Injectable()
export class BackofficeService {
  constructor(
    private readonly propertiesDBService: PropertiesDBService,
    private readonly udgConfigParamService: UdgConfigParamService,
    private readonly conversacionesService: ConversacionesService,
    private readonly chatGptService: ChatgptService,
    private logger: Logger,
  ) {}

  async getChat(params: ChatRequest): Promise<ChatResponseDto> {
    const { pushName, q, tosearch, max } = params;
    let idConversacion = params.idConversacion;
    this.logger.log('int getChat with params:', idConversacion);
    const existingReglas = await this.getAllDocuments();
    const reglasToUpdate = existingReglas[0];
    const baseConocimiento = reglasToUpdate.base_conocimiento.join('');
    const messages: MessageDto[] = [];
    messages.push({
      role: 'system',
      content: baseConocimiento,
    });
    if (idConversacion) {
      const conversacionPrincipal =
        await this.conversacionesService.getAllConversacionesByIdConversacion(
          idConversacion,
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

    const respModel: ResponseModelDto = {
      model: 'gpt-4o-mini-2024-07-18', // Reemplaza esto con el modelo adecuado
      messages: messages,
    };

    // Convertir a JSON
    const jsonInputString = JSON.stringify(respModel);
    const chatResponse = await this.chatGptService.sendRequestChatCompletion(
      jsonInputString,
    );
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
    const botResponse = new ResponseBotDto();
    botResponse.idConversacion = idConversacion;
    botResponse.txtConversacionUser = q;
    botResponse.txtConversacionBot = chatResponse.choices[0].message.content;
    if (messages.length === 2) {
      idConversacion = await this.conversacionesService.createConversacion(
        q,
        botResponse.txtConversacionBot,
        idConversacion,
      );
      return {
        status: 'Success',
        message: null,
        data: botResponse,
      };
    } else {
      await this.conversacionesService.addConversacion(
        q,
        botResponse.txtConversacionBot,
        idConversacion,
      );
      return {
        status: 'Success',
        message: null,
        data: botResponse,
      };
    }
  }

  async getAllDocuments() {
    return await this.udgConfigParamService.getAllDocuments();
  }
}
