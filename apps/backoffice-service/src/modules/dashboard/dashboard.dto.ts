import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class DashboardMetricsDto {
  @ApiProperty({
    description: 'Número total de usuarios',
    example: 100,
  })
  totalUsers: number;

  @ApiProperty({
    description: 'Número total de conversaciones',
    example: 500,
  })
  totalConversaciones: number;
}

export class RecentActivityDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    example: 'John Doe',
  })
  user: string;

  @ApiProperty({
    description: 'ID único de la conversación',
    example: '1234567890',
  })
  idConversacion: string;

  @ApiProperty({
    description: 'Marca de tiempo de la actividad reciente ',
    example: '01/4/2025 10:59 PM',
  })
  timestamp: number;
}

export class DashboardResponseDto {
  @ApiProperty({
    description: 'Métricas generales del dashboard',
    type: DashboardMetricsDto,
  })
  metrics: DashboardMetricsDto;

  @ApiProperty({
    description: 'Actividad reciente del dashboard',
    type: [RecentActivityDto],
  })
  recentActivity: RecentActivityDto[];
}

export class GetFilteredConversationsDto {
  @ApiProperty({
    description: 'Fecha de inicio en formato DD-MM-YYYY',
    example: '01-04-2025',
  })
  @IsString()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: 'startDate debe estar en el formato DD-MM-YYYY',
  })
  startDate: string;

  @ApiProperty({
    description: 'Fecha de fin en formato DD-MM-YYYY',
    example: '02-04-2025',
  })
  @IsString()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, {
    message: 'endDate debe estar en el formato DD-MM-YYYY',
  })
  endDate: string;
}
