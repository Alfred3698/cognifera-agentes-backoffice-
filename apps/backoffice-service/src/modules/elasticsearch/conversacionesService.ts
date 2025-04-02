import { Injectable } from '@nestjs/common';

import moment from 'moment';
import { Logger } from '@b-accel-logger/logger.service';

import { ElasticsearchService } from './elasticsearch.service';
import {
  ConfigParamDto,
  ConversacionDTO,
  ConversacionPrincipalDTO,
} from './elasticsearch.dto';
import {
  DashboardMetricsDto,
  RecentActivityDto,
} from '../dashboard/dashboard.dto';

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
        timestamp: source.timestamp,
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
    nameUser: string,
    txtConversacionUser: string,
    txtConversacionBot: string,
    idConversacion: string,
  ) {
    const conversaciones = this.buildConversaciones(
      txtConversacionUser,
      txtConversacionBot,
    );
    const conversacionPrincipal = new ConversacionPrincipalDTO();
    conversacionPrincipal.user = nameUser;
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

  async getDashboardMetrics(): Promise<DashboardMetricsDto> {
    const query = {
      size: 0,
      aggs: {
        unique_ids: {
          cardinality: {
            field: 'idConversacion.keyword',
          },
        },
        total_conversaciones: {
          sum: {
            script: {
              source:
                "params['_source'].containsKey('conversaciones') ? params['_source']['conversaciones'].size() : 0",
            },
          },
        },
      },
    };

    try {
      const response = await this.elasticSearchService.search(
        this.indexName,
        query,
      );

      const uniqueIds = response.body.aggregations.unique_ids.value || 0;
      const totalConversaciones =
        response.body.aggregations.total_conversaciones.value || 0;

      this.logger.log(`Unique IDs: ${uniqueIds}`);
      this.logger.log(`Total Conversaciones: ${totalConversaciones}`);

      return {
        totalUsers: uniqueIds,
        totalConversaciones,
      };
    } catch (error) {
      this.logger.error('Error al obtener métricas del dashboard:', error);
      throw new Error('Error al obtener métricas del dashboard');
    }
  }

  async geyRecentActivity(): Promise<RecentActivityDto[]> {
    const query = {
      size: 5,
      sort: [
        {
          timestamp: {
            order: 'desc',
          },
        },
      ],
      _source: {
        includes: ['idConversacion', 'user', 'timestamp'],
      },
    };
    const response = await this.elasticSearchService.search(
      this.indexName,
      query,
    );
    if (!response.body.hits || !response.body.hits.hits) {
      this.logger.error('La respuesta no contiene hits válidos.');
      return [];
    }

    return response.body.hits.hits.map((hit: any) => {
      const source = hit._source;
      return {
        user: source.user,
        idConversacion: source.idConversacion,
        timestamp: moment(source.timestamp).format('DD/M/YYYY h:mm A'),
      };
    });
  }
}
