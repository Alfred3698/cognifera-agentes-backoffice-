import { Injectable, OnModuleInit } from '@nestjs/common';

import { Logger } from '@b-accel-logger/logger.service';

import { ElasticsearchService } from './elasticsearch.service';
import { ConfigParamDto } from './elasticsearch.dto';

@Injectable()
export class UdgConfigParamService {
  constructor(
    private readonly elasticSearchService: ElasticsearchService,
    private logger: Logger,
  ) {}

  async getConfigParams(id: string, userId: string): Promise<ConfigParamDto[]> {
    const query = id
      ? {
          query: {
            match: {
              _id: id, // Buscar por un ID específico
            },
          },
        }
      : {
          query: {
            bool: {
              filter: [
                {
                  term: {
                    user_id: userId, // Búsqueda exacta por user_id
                  },
                },
              ],
            },
          },
        }; // Buscar por user_id si no se proporciona un ID

    const response = await this.elasticSearchService.search(
      process.env.ELASTICSEARCH_INDEX_CONFIG_PARAM,
      query,
    );

    return response.body.hits.hits.map((hit: any) => {
      const source = hit._source;
      return {
        id: hit._id,
        limitMaxQueryTokens: source.limit_max_query_tokens,
        isActiveRag: source.is_active_rag ?? false,
        limitMaxCaracters: source.limit_max_caracters,
        limitMinCaracters: source.limit_min_caracters,
        limitTimeBetweenConversations: source.limit_time_between_conversations,
        baseConocimiento: source.base_conocimiento,
        limitMaxQuestionsPerDay: source.limit_Max_questions_per_day ?? 0,
        entrenamiento: {
          contextoGlobal: source.entrenamiento?.contexto_global ?? [], // Mapeo de contexto_global a contextoGlobal
          restricciones: {
            permitido: source.entrenamiento?.restricciones?.permitido ?? [],
            denegado: source.entrenamiento?.restricciones?.denegado ?? [],
          },
          preguntasYRespuestas:
            source.entrenamiento?.preguntas_y_respuestas ?? [],
        },
      } as ConfigParamDto;
    });
  }

  // ...existing code...

  async saveConfigParams(userId: string): Promise<any> {
    const emptyConfig = {
      user_id: userId,
      limit_max_query_tokens: 0,
      is_active_rag: false,
      limit_max_caracters: 0,
      limit_min_caracters: 0,
      limit_time_between_conversations: 0,
      base_conocimiento: [],
      limit_Max_questions_per_day: 0,
      entrenamiento: {
        contexto_global: [],
        restricciones: {
          permitido: [],
          denegado: [],
        },
        preguntas_y_respuestas: [],
      },
    };

    return await this.elasticSearchService.indexDocument(
      process.env.ELASTICSEARCH_INDEX_CONFIG_PARAM,
      undefined,
      emptyConfig,
    );
  }

  async updateConfigParam(
    id: string,
    updates: Record<string, any>,
  ): Promise<any> {
    return await this.elasticSearchService.updateDocument(
      process.env.ELASTICSEARCH_INDEX_CONFIG_PARAM,
      id,
      updates,
    );
  }
}
