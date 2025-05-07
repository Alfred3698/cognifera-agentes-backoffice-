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

  async getDashboardMetrics(userId: string): Promise<DashboardResponseDto> {
    const metrics = await this.conversacionesService.getDashboardMetrics(
      userId,
    );
    const recentActivity = await this.conversacionesService.geyRecentActivity(
      userId,
    );
    return { metrics, recentActivity };
  }

  async getFilteredConversations(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<any> {
    const startTimestamp = moment
      .tz(startDate, 'DD-MM-YYYY', 'America/Mexico_City')
      .startOf('day')
      .valueOf();
    const endTimestamp = moment
      .tz(endDate, 'DD-MM-YYYY', 'America/Mexico_City')
      .endOf('day')
      .valueOf();

    let filteredConversations =
      await this.conversacionesService.getFilteredConversations(
        userId,
        startTimestamp,
        endTimestamp,
      );
    filteredConversations = await this.filterConversationsByDate(
      filteredConversations,
      startTimestamp,
      endTimestamp,
    );
    return filteredConversations;
  }

  async filterConversationsByDate(
    filteredConversations: any[],
    startDate: number,
    endDate: number,
  ): Promise<any[]> {
    return filteredConversations
      .map((item) => {
        const filteredConversaciones = item.conversaciones.filter(
          (conversacion: any) => {
            return (
              conversacion.timestamp >= startDate &&
              conversacion.timestamp <= endDate
            );
          },
        );

        // Retornar solo los elementos que tienen conversaciones dentro del rango
        return {
          ...item,
          conversaciones: filteredConversaciones,
        };
      })
      .filter((item) => item.conversaciones.length > 0); // Eliminar elementos sin conversaciones
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
      const { user, conversaciones } = conversation;

      conversaciones.forEach((c: any, i: number) => {
        if (c.type === 'question') {
          const nextAnswer = conversaciones[i + 1];
          worksheet.addRow({
            fecha: moment(c.timestamp)
              .tz('America/Mexico_City') // Convierte a hora local de Ciudad de México
              .format('DD/M/YYYY h:mm A'),
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
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<string> {
    this.logger.log(
      `Obteniendo conversaciones filtradas desde ${startDate} hasta ${endDate}`,
    );
    const filteredConversations = await this.getFilteredConversations(
      userId,
      startDate,
      endDate,
    );

    const excelFilePath = await this.generateStyledExcel(filteredConversations);

    return excelFilePath;
  }
}
