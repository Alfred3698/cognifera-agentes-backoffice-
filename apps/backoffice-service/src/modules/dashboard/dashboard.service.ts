import { Injectable } from '@nestjs/common';
import { Logger } from '@b-accel-logger/logger.service';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { ConversacionesService } from '../elasticsearch/conversaciones.service';
import * as ExcelJS from 'exceljs';
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

  async generateStyledExcel(filteredConversations: any[]): Promise<string> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Conversaciones');

    // Cabeceras
    worksheet.columns = [
      { header: 'fecha', key: 'fecha', width: 20 },
      { header: 'usuario', key: 'usuario', width: 25 },
      { header: 'pregunta', key: 'pregunta', width: 60 },
      { header: 'respuesta', key: 'respuesta', width: 80 },
    ];

    // Estilo azul a la cabecera
    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '002060' }, // Azul oscuro
      };
      cell.font = { color: { argb: 'FFFFFF' }, bold: true }; // Texto blanco y en negrita
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Agregar datos
    filteredConversations.forEach((conversation) => {
      const { user, timestamp, conversaciones } = conversation;

      conversaciones.forEach((c: any, i: number) => {
        if (c.type === 'question') {
          const nextAnswer = conversaciones[i + 1];
          worksheet.addRow({
            fecha: timestamp,
            usuario: user,
            pregunta: c.text,
            respuesta: nextAnswer?.type === 'answer' ? nextAnswer.text : '',
          });
        }
      });
    });

    const filePath = `conversaciones_${moment().format(
      'DD-MM-YYYY',
    )}_${uuidv4()}.xlsx`;
    await workbook.xlsx.writeFile(filePath);

    this.logger.log(`Archivo Excel generado: ${filePath}`);
    return filePath;
  }
  async getFilteredConversationsAndGenerateExcel(
    startDate: string,
    endDate: string,
  ): Promise<string> {
    this.logger.log(
      `Obteniendo conversaciones filtradas desde ${startDate} hasta ${endDate}`,
    );
    const filteredConversations = await this.getFilteredConversations(
      startDate,
      endDate,
    );

    const excelFilePath = await this.generateStyledExcel(filteredConversations);

    return excelFilePath;
  }
}
