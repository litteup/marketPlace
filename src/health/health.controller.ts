import { Controller, Get, HttpException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({
    summary: 'Check API health status',
    description:
      'Returns the current status of the API and database connection',
  })
  @ApiResponse({
    status: 200,
    description: 'API is healthy and database connection is successful',
  })
  @ApiResponse({
    status: 503,
    description: 'API is unhealthy or database connection failed',
  })
  async checkHealth() {
    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: 'connected',
        message: 'API is running smoothly',
      };
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          timestamp: new Date().toISOString(),
          database: 'disconnected',
          message: 'Database connection failed',
          error:
            error && typeof error === 'object' && 'message' in error
              ? (error as Error).message
              : String(error),
        },
        503,
      );
    }
  }
}
