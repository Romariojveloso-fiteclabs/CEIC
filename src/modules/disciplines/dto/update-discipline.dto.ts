import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString, Length, Matches, Min } from 'class-validator';

export class UpdateDisciplineDto {
  @ApiPropertyOptional({ example: 'Segurança Ofensiva' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  @Matches(/\S/)
  title?: string;

  @ApiPropertyOptional({ example: 'seguranca-ofensiva' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @ApiPropertyOptional({ example: 'Ementa da disciplina com tópicos essenciais.' })
  @IsOptional()
  @IsString()
  syllabus?: string;

  @ApiPropertyOptional({ example: ['Livro A', 'Livro B'] })
  @IsOptional()
  @IsArray()
  bibliography?: string[];

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @IsInt()
  @Min(0)
  defaultCredits?: number;

  @ApiPropertyOptional({ example: 60 })
  @IsOptional()
  @IsInt()
  @Min(0)
  defaultWorkloadHours?: number;
}
