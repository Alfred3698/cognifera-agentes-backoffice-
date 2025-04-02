import { ApiProperty } from '@nestjs/swagger';

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
