import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Length,
  Matches,
  Min,
} from 'class-validator';

export class CreateCohortDto {
  @ApiProperty({ example: '7afcb789-348c-4953-b2f6-bf51fa520008' })
  @IsUUID()
  courseId!: string;

  @ApiProperty({ example: 'Turma 2026.1' })
  @IsString()
  @Length(1, 200)
  @Matches(/\S/)
  name!: string;

  @ApiPropertyOptional({ example: '2026-03-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-07-31T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ example: '2026-01-10T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  enrollmentStart?: string;

  @ApiPropertyOptional({ example: '2026-02-25T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  enrollmentEnd?: string;

  @ApiPropertyOptional({ example: 'upcoming', enum: ['upcoming', 'open', 'closed'] })
  @IsOptional()
  @IsIn(['upcoming', 'open', 'closed'])
  enrollmentStatus?: 'upcoming' | 'open' | 'closed';

  @ApiPropertyOptional({ example: 'https://inscricao.ceic.tec.br' })
  @IsOptional()
  @IsUrl()
  registrationUrl?: string;

  @ApiPropertyOptional({ example: 'https://ceic.tec.br/edital-2026-1.pdf' })
  @IsOptional()
  @IsUrl()
  selectionNoticeUrl?: string;

  @ApiPropertyOptional({ example: 120 })
  @IsOptional()
  @IsInt()
  @Min(0)
  classHours?: number;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @IsInt()
  @Min(0)
  practicalHours?: number;

  @ApiPropertyOptional({ example: 1500.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 40 })
  @IsOptional()
  @IsInt()
  @Min(0)
  availableSeats?: number;
}
