import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreatePageDto {
  @ApiProperty({ example: 'Sobre o CEIC' })
  @IsString()
  @Length(1, 200)
  @Matches(/\S/)
  title!: string;

  @ApiPropertyOptional({ example: 'sobre' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @ApiPropertyOptional({ example: 'Resumo institucional da página.' })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiProperty({ example: '# Sobre o CEIC\n\nTexto em Markdown.' })
  @IsString()
  content!: string;
}
