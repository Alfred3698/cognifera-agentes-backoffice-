import { Injectable } from '@nestjs/common';

import moment from 'moment-timezone';
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
    userId: string,
  ): Promise<ConversacionPrincipalDTO[]> {
    const response = await this.elasticSearchService.search(this.indexName, {
      query: {
        bool: {
          filter: [
            {
              term: {
                idConversacion: idConversacion, // Búsqueda exacta por idConversacion
              },
            },
            {
              term: {
                'userId.keyword': userId, // Búsqueda exacta por userId
              },
            },
          ],
        },
      },
    });

    return response.body.hits.hits.map((hit: any) => {
      const source = hit._source;
      return {
        id: hit._id,
        idConversacion: source.idConversacion,
        user: source.user,
        userId: source.userId,
        timestamp: source.timestamp,
        conversaciones: source.conversaciones
          .filter((conversacion: any) => conversacion.active) // Filtrar solo las conversaciones activas
          .map((conversacion: any) => ({
            text: conversacion.text,
            type: conversacion.type,
            referencias: conversacion.referencias,
            timestamp: conversacion.timestamp,
            active: conversacion.active, // Mapear la propiedad active
          })),
      } as ConversacionPrincipalDTO;
    });
  }

  async createConversacion(
    nameUser: string,
    txtConversacionUser: string,
    txtConversacionBot: string,
    idConversacion: string,
    userId: string,
  ) {
    const conversaciones = this.buildConversaciones(
      txtConversacionUser,
      txtConversacionBot,
    );
    const conversacionPrincipal = new ConversacionPrincipalDTO();
    conversacionPrincipal.user = nameUser;
    conversacionPrincipal.userId = userId;
    conversacionPrincipal.idConversacion = idConversacion;
    conversacionPrincipal.timestamp = moment()
      .tz('America/Mexico_City')
      .valueOf();
    conversacionPrincipal.conversaciones = conversaciones;
    const documento = await this.elasticSearchService.indexDocument(
      this.indexName,
      idConversacion + userId,
      conversacionPrincipal,
    );
    this.logger.log('Documento creado exitosamente:');
    return documento.body._id;
  }
  async addConversacion(
    txtConversacionUser: string,
    txtConversacionBot: string,
    idConversacion: string,
    userId: string,
  ) {
    const conversaciones = this.buildConversaciones(
      txtConversacionUser,
      txtConversacionBot,
    );
    await this.updateConversacion(conversaciones, idConversacion, userId);
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
      timestamp: moment().tz('America/Mexico_City').valueOf(),
      active: true,
    });

    conversaciones.push({
      text: txtConversacionBot,
      type: 'answer',
      referencias: null,
      timestamp: moment().tz('America/Mexico_City').valueOf(),
      active: true,
    });
    return conversaciones;
  }

  async updateConversacion(
    conversaciones: ConversacionDTO[],
    idConversacion: string,
    userId: string,
  ) {
    const conversacion = await this.getAllConversacionesByIdConversacion(
      idConversacion,
      userId,
    );
    const conversacionPrincipal = conversacion[0];
    if (conversacionPrincipal == null) {
      return false;
    }
    conversacionPrincipal.conversaciones.push(...conversaciones);

    const idDoc = conversacionPrincipal.id;
    conversacionPrincipal.timestamp = moment()
      .tz('America/Mexico_City')
      .valueOf();
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

  async getDashboardMetrics(userId: string): Promise<DashboardMetricsDto> {
    const query = {
      size: 0,
      query: {
        bool: {
          filter: [
            {
              term: {
                'userId.keyword': userId, // Búsqueda exacta por userId
              },
            },
          ],
        },
      },
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

  async geyRecentActivity(userId: string): Promise<RecentActivityDto[]> {
    const query = {
      size: 10,
      query: {
        bool: {
          filter: [
            {
              term: {
                'userId.keyword': userId, // Búsqueda exacta por userId
              },
            },
          ],
        },
      },
      sort: [
        {
          timestamp: {
            order: 'desc', // Orden descendente por timestamp
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
        timestamp: moment(source.timestamp)
          .tz('America/Mexico_City')
          .format('DD/M/YYYY h:mm A'),
      };
    });
  }
  async getFilteredConversations(
    userId: string,
    startTimestamp: number,
    endTimestamp: number,
  ): Promise<any[]> {
    const query = {
      query: {
        bool: {
          must: [
            {
              match_all: {},
            },
          ],
          filter: [
            {
              term: {
                'userId.keyword': userId,
              },
            },
            {
              range: {
                timestamp: {
                  gte: startTimestamp, // Timestamp de inicio
                  lte: endTimestamp, // Timestamp de fin
                },
              },
            },
          ],
        },
      },
      size: 1000, // Limita los resultados a 1000 documentos
      sort: [
        {
          timestamp: {
            order: 'desc', // Orden descendente por timestamp
          },
        },
      ],
      _source: {
        includes: ['idConversacion', 'user', 'timestamp', 'conversaciones'],
      },
    };

    try {
      const response = await this.elasticSearchService.search(
        this.indexName,
        query,
      );

      if (!response.body.hits || !response.body.hits.hits) {
        this.logger.error('La respuesta no contiene hits válidos.');
        return [];
      }

      // Mapeo de los resultados
      return response.body.hits.hits.map((hit: any) => {
        const source = hit._source;
        return {
          id: hit._id,
          user: source.user,
          idConversacion: source.idConversacion,
          timestamp: moment(source.timestamp)
            .tz('America/Mexico_City') // Convierte a hora local de Ciudad de México
            .format('DD/M/YYYY h:mm A'), // Formatea la fecha
          conversaciones: source.conversaciones.map((conversacion: any) => ({
            text: conversacion.text,
            type: conversacion.type,
            timestamp: conversacion.timestamp,
          })),
        };
      });
    } catch (error) {
      this.logger.error('Error al ejecutar el query:', error);
      throw new Error('Error al obtener las conversaciones filtradas');
    }
  }

  async getConversationQuestionsCountByDay(
    id: string,
    date: string, // Fecha en formato 'YYYY-MM-DD',
    userId: string,
  ): Promise<{ id: string; questionCount: number }> {
    // Convertir la fecha proporcionada al inicio y fin del día en formato timestamp
    const startOfDay = moment
      .tz(date, 'YYYY-MM-DD', 'America/Mexico_City')
      .startOf('day')
      .valueOf();
    const endOfDay = moment
      .tz(date, 'YYYY-MM-DD', 'America/Mexico_City')
      .endOf('day')
      .valueOf();
    this.logger.log('startOfDay', String(startOfDay));
    this.logger.log('endOfDay', String(endOfDay));
    const response = await this.elasticSearchService.search(this.indexName, {
      query: {
        bool: {
          must: [
            {
              ids: {
                values: [id + userId], // Buscar por ID específico
              },
            },
          ],
          filter: [
            {
              term: {
                'userId.keyword': userId, // Búsqueda exacta por userId
              },
            },
            {
              range: {
                timestamp: {
                  gte: startOfDay, // Timestamp de inicio
                  lte: endOfDay, // Timestamp de fin
                },
              },
            },
          ],
        },
      },
    });

    if (!response.body.hits || !response.body.hits.hits.length) {
      return { id, questionCount: 0 };
    }

    const source = response.body.hits.hits[0]._source;

    const questionCount = source.conversaciones.filter(
      (conversacion: any) =>
        conversacion.type === 'question' &&
        conversacion.timestamp >= startOfDay &&
        conversacion.timestamp <= endOfDay,
    ).length;

    return {
      id: source.id,
      questionCount,
    };
  }
}
