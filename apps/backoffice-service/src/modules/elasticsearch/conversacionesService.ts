import { Injectable } from '@nestjs/common';

import { Logger } from '@b-accel-logger/logger.service';

import { ElasticsearchService } from './elasticsearch.service';
import {
  ConfigParamDto,
  ConversacionDTO,
  ConversacionPrincipalDTO,
} from './elasticsearch.dto';

@Injectable()
export class ConversacionesService {
  indexName = process.env.ELASTICSEARCH_INDEX_CONVERSACIONES;
  constructor(
    private readonly elasticSearchService: ElasticsearchService,
    private logger: Logger,
  ) {}

  async getAllConversacionesByIdConversacion(
    idConversacion: string,
  ): Promise<ConversacionPrincipalDTO[]> {
    const response = await this.elasticSearchService.search(this.indexName, {
      query: {
        ids: {
          values: [idConversacion],
        },
      },
    });

    return response.body.hits.hits.map((hit: any) => {
      const source = hit._source;
      return {
        id: hit._id,
        idConversacion: source.idConversacion,
        user: source.user,
        timestamp: new Date(source.timestamp),
        conversaciones: source.conversaciones.map((conversacion: any) => ({
          text: conversacion.text,
          type: conversacion.type,
          referencias: conversacion.referencias,
          timestamp: conversacion.timestamp,
        })),
      } as ConversacionPrincipalDTO;
    });
  }

  async createConversacion(
    txtConversacionUser: string,
    txtConversacionBot: string,
    idConversacion: string,
  ) {
    const conversaciones = this.buildConversaciones(
      txtConversacionUser,
      txtConversacionBot,
    );
    const conversacionPrincipal = new ConversacionPrincipalDTO();

    conversacionPrincipal.idConversacion = idConversacion;
    conversacionPrincipal.timestamp = new Date().getTime();
    conversacionPrincipal.conversaciones = conversaciones;
    const documento = await this.elasticSearchService.indexDocument(
      this.indexName,
      idConversacion,
      conversacionPrincipal,
    );
    this.logger.log('Documento creado exitosamente:');
    return documento.body._id;
  }
  async addConversacion(
    txtConversacionUser: string,
    txtConversacionBot: string,
    idConversacion: string,
  ) {
    const conversaciones = this.buildConversaciones(
      txtConversacionUser,
      txtConversacionBot,
    );
    await this.updateConversacion(conversaciones, idConversacion);
  }
  buildConversaciones(
    txtConversacionUser: string,
    txtConversacionBot: string,
  ): ConversacionDTO[] {
    const conversaciones: ConversacionDTO[] = [];

    conversaciones.push({
      text: txtConversacionUser,
      type: 'question',
      referencias: null,
      timestamp: new Date().getTime(),
    });

    conversaciones.push({
      text: txtConversacionBot,
      type: 'answer',
      referencias: null,
      timestamp: new Date().getTime(),
    });
    return conversaciones;
  }

  async updateConversacion(
    conversaciones: ConversacionDTO[],
    idConversacion: string,
  ) {
    const conversacion = await this.getAllConversacionesByIdConversacion(
      idConversacion,
    );
    const conversacionPrincipal = conversacion[0];
    if (conversacionPrincipal == null) {
      return false;
    }
    conversacionPrincipal.conversaciones.push(...conversaciones);

    const idDoc = conversacionPrincipal.id;

    try {
      await this.elasticSearchService.updateDocument(
        this.indexName,
        idDoc,
        conversacionPrincipal,
      );
      this.logger.log('Documento actualizado exitosamente:');
    } catch (error) {
      this.logger.error('Error al actualizar el documento:', error);
      throw new Error('Error al actualizar el documento');
    }

    return true;
  }
}
