import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUrl, IsUUID, Length, Matches, Min } from 'class-validator';

export class CreateMentorshipDto {
  @ApiProperty({ example: 'Mentoria em Cibersegurança' })
  @IsString()
  @Length(1, 200)
  @Matches(/\S/)
  title!: string;

  @ApiPropertyOptional({ example: 'mentoria-ciberseguranca' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @ApiPropertyOptional({ example: 'Breve introdução à mentoria.' })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiPropertyOptional({ example: 'Descrição detalhada com objetivos e metodologia.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '7afcb789-348c-4953-b2f6-bf51fa520008' })
  @IsOptional()
  @IsUUID()
  mentorPersonId?: string;

  @ApiPropertyOptional({ example: 6 })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationMonths?: number;

  @ApiPropertyOptional({ example: 40 })
  @IsOptional()
  @IsInt()
  @Min(1)
  workloadHours?: number;

  @ApiPropertyOptional({ example: 'https://inscricao.ceic.tec.br/mentoria' })
  @IsOptional()
  @IsUrl()
  applicationUrl?: string;

  @ApiPropertyOptional({ example: 'https://ceic.tec.br/edital-mentoria.pdf' })
  @IsOptional()
  @IsUrl()
  noticeUrl?: string;
}
