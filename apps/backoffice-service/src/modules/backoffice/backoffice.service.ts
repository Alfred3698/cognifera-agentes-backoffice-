import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Logger } from '@b-accel-logger/logger.service';
import { PropertiesDBService } from '../db-module/properties.service';
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
    const { q, pushName } = params;
    const idConversacion = params.idConversacion;
    this.logger.log('int getChat with params:', idConversacion);

    const baseConocimiento = await this.getBaseConocimiento();
    const messages = await this.buildInitialMessages(
      baseConocimiento,
      q,
      idConversacion,
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
    );
  }

  private async getBaseConocimiento(): Promise<string> {
    const existingReglas = await this.getAllDocuments();
    const reglasToUpdate = existingReglas[0];
    return reglasToUpdate.base_conocimiento.join('');
  }

  private async buildInitialMessages(
    baseConocimiento: string,
    q: string,
    idConversacion: string,
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
      model: 'gpt-4o-mini-2024-07-18', // Reemplaza esto con el modelo adecuado
      messages: messages,
    };
  }

  private async getChatResponse(respModel: ResponseModelDto): Promise<any> {
    const jsonInputString = JSON.stringify(respModel);
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
  ): Promise<ChatResponseDto> {
    if (messages.length === 2) {
      idConversacion = await this.conversacionesService.createConversacion(
        q,
        botResponse.txtConversacionBot,
        idConversacion,
      );
    } else {
      await this.conversacionesService.addConversacion(
        q,
        botResponse.txtConversacionBot,
        idConversacion,
      );
    }

    return {
      status: 'Success',
      message: null,
      data: botResponse,
    };
  }

  async getAllDocuments() {
    return await this.udgConfigParamService.getAllDocuments();
  }
}
