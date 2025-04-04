import { Injectable } from '@nestjs/common';

import { Logger } from '@b-accel-logger/logger.service';

import { ElasticsearchService } from './elasticsearch.service';
import { ConfigParamDto } from './elasticsearch.dto';

@Injectable()
export class UdgConfigParamService {
  constructor(
    private readonly elasticSearchService: ElasticsearchService,
    private logger: Logger,
  ) {}

  async getConfigParams(): Promise<ConfigParamDto[]> {
    const response = await this.elasticSearchService.search(
      process.env.ELASTICSEARCH_INDEX_CONFIG_PARAM,
      {
        query: {
          match_all: {},
        },
      },
    );

    return response.body.hits.hits.map((hit: any) => {
      const source = hit._source;
      return {
        id: hit._id,
        limit_max_query_tokens: source.limit_max_query_tokens,
        limit_max_caracters: source.limit_max_caracters,
        limit_min_caracters: source.limit_min_caracters,
        limit_time_between_conversations:
          source.limit_time_between_conversations,
        base_conocimiento: source.base_conocimiento,
      } as ConfigParamDto;
    });
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
