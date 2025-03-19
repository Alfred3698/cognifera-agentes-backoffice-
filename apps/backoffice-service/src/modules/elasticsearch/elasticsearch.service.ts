import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import { Logger } from '@b-accel-logger/logger.service';
@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private readonly client: Client;

  constructor(private logger: Logger) {
    this.client = new Client({
      node: 'http://31.220.107.240:9200', // URL de Elasticsearch
      auth: {
        username: 'elastic', // Si usas autenticación básica
        password: 'iuscopilot08011269Eeyd#!',
      },
    });
  }

  async onModuleInit() {
    try {
      await this.client.cluster.health();
      this.logger.log('Elasticsearch Connected:');
    } catch (error) {
      this.logger.error('Elasticsearch Connection Error:', error);
    }
  }

  async indexDocument(index: string, id: string, body: any) {
    return this.client.index({
      index,
      id,
      body,
    });
  }

  async search(index: string, query: any) {
    return this.client.search({
      index,
      body: query,
    });
  }

  async deleteDocument(index: string, id: string) {
    return this.client.delete({
      index,
      id,
    });
  }
}
