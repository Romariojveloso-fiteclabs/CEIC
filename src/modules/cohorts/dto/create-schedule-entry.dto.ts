import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsIn, IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';

export class CreateScheduleEntryDto {
  @ApiPropertyOptional({ example: '2026-03-10T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ example: '08:00' })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  startTime?: string;

  @ApiPropertyOptional({ example: '12:00' })
  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  endTime?: string;

  @ApiPropertyOptional({ example: 'in_person', enum: ['in_person', 'online', 'hybrid'] })
  @IsOptional()
  @IsIn(['in_person', 'online', 'hybrid'])
  modality?: 'in_person' | 'online' | 'hybrid';

  @ApiPropertyOptional({ example: 'Aula prática de laboratório.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}
