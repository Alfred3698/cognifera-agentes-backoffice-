import { Injectable } from '@nestjs/common';
import { Logger } from '@b-accel-logger/logger.service';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { ConversacionesService } from '../elasticsearch/conversaciones.service';

import { v4 as uuidv4 } from 'uuid';
import { DashboardResponseDto } from './dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(
    private readonly conversacionesService: ConversacionesService,

    private logger: Logger,
  ) {}

  async getDashboardMetrics(): Promise<DashboardResponseDto> {
    const metrics = await this.conversacionesService.getDashboardMetrics();
    const recentActivity = await this.conversacionesService.geyRecentActivity();
    return { metrics, recentActivity };
  }

  async getFilteredConversations(
    startDate: string,
    endDate: string,
  ): Promise<any> {
    const startTimestamp = moment(startDate, 'DD-MM-YYYY').valueOf();
    const endTimestamp = moment(endDate, 'DD-MM-YYYY').endOf('day').valueOf();

    const filteredConversations =
      await this.conversacionesService.getFilteredConversations(
        startTimestamp,
        endTimestamp,
      );
    return filteredConversations;
  }

  async generateExcelFromConversations(
    filteredConversations: any[],
  ): Promise<string> {
    const data = filteredConversations.map((conversation) => ({
      Usuario: conversation.user,
      ID_Conversacion: conversation.idConversacion,
      Timestamp: conversation.timestamp,
      Conversaciones: conversation.conversaciones
        .map((c: any) => `[${c.type}] ${c.text}`)
        .join('\n'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Conversaciones');

    // Generar un nombre de archivo único usando UUID
    const filePath = `filtered_conversations_${uuidv4()}.xlsx`;
    XLSX.writeFile(workbook, filePath);

    this.logger.log(`Archivo Excel generado: ${filePath}`);
    return filePath;
  }

  async getFilteredConversationsAndGenerateExcel(
    startDate: string,
    endDate: string,
  ): Promise<string> {
    const filteredConversations = await this.getFilteredConversations(
      startDate,
      endDate,
    );

    const excelFilePath = await this.generateExcelFromConversations(
      filteredConversations,
    );

    return excelFilePath;
  }
}
