import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID, Length, Matches } from 'class-validator';

export class UpdateNewsDto {
  @ApiPropertyOptional({ example: 'CEIC Lança Novo Programa de Residência' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  @Matches(/\S/)
  title?: string;

  @ApiPropertyOptional({ example: 'ceic-lanca-novo-programa-residencia' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @ApiPropertyOptional({ example: 'Breve resumo da notícia para listagens.' })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional({ example: '# Novo Programa\n\nConteúdo completo atualizado.' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({ example: '7afcb789-348c-4953-b2f6-bf51fa520008' })
  @IsOptional()
  @IsUUID()
  coverMediaId?: string;

  @ApiPropertyOptional({ example: ['7afcb789-348c-4953-b2f6-bf51fa520008'] })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  personIds?: string[];
}
