import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { sql } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service.js';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly database: DatabaseService) {}

  @Get()
  @AllowAnonymous()
  @ApiOperation({ summary: 'Verificar se o processo está em execução (liveness)' })
  @ApiResponse({ status: 200, example: { status: 'ok' } })
  check() {
    return { status: 'ok' };
  }

  @Get('ready')
  @AllowAnonymous()
  @ApiOperation({ summary: 'Verificar se a API e o banco PostgreSQL estão prontos (readiness)' })
  @ApiResponse({ status: 200, example: { status: 'ok', database: 'connected' } })
  async ready() {
    try {
      await this.database.db.execute(sql`SELECT 1`);
      return { status: 'ok', database: 'connected' };
    } catch {
      throw new ServiceUnavailableException('Banco de dados indisponível.');
    }
  }
}
