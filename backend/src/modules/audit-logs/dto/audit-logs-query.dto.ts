import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto.js';

export class AuditLogsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ example: 'course' })
  @IsOptional()
  @IsString()
  entityType?: string;

  @ApiPropertyOptional({ example: '9a941b31-3dc8-4b78-af67-0c7fbe8e9ad3' })
  @IsOptional()
  @IsUUID()
  entityId?: string;
}
