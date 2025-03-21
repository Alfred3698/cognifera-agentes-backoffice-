import { Injectable, HttpService } from '@nestjs/common';

import { Logger } from '@b-accel-logger/logger.service';
import { ChatCompletionDto } from './chatgpt.dto';

@Injectable()
export class ChatgptService {
  constructor(
    private readonly httpService: HttpService,
    private readonly logger: Logger,
  ) {}

  async sendRequestChatCompletion(
    jsonInputString: string,
  ): Promise<ChatCompletionDto> {
    this.logger.log(
      'Sending request to ChatGPT API:',
      process.env.OPENAI_API_URL,
    );
    this.logger.log('Request payload:', jsonInputString);

    const response = await this.httpService
      .post<ChatCompletionDto>(process.env.OPENAI_API_URL, jsonInputString, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      })
      .toPromise();

    return response.data;
  }
}
