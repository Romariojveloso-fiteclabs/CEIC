import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, Length, Matches, MaxLength, ValidateIf } from 'class-validator';

export class UpdateCourseDto {
  @ApiPropertyOptional({ description: 'Titulo do curso', example: 'TypeScript Avancado' })
  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @IsString()
  @Length(1, 200)
  @Matches(/\S/)
  title?: string;

  @ApiPropertyOptional({ description: 'Slug unico do curso', example: 'typescript-avancado' })
  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @IsString()
  @Length(1, 200)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @ApiPropertyOptional({ description: 'Descricao detalhada do curso', example: 'Curso completo cobrindo recursos avancados' })
  @ValidateIf((_object: unknown, value: unknown) => value !== undefined)
  @IsString()
  @MaxLength(20000)
  description?: string;
}
