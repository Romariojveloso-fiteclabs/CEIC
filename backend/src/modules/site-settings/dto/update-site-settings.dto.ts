import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsObject, IsOptional, IsString, IsUUID, Length, Matches } from 'class-validator';

export class UpdateSiteSettingsDto {
  @ApiPropertyOptional({ example: 'CEIC - Centro de Educação e Inovação' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  @Matches(/\S/)
  siteName?: string;

  @ApiPropertyOptional({ example: 'Plataforma oficial de capacitação tecnológica e inovação.' })
  @IsOptional()
  @IsString()
  siteDescription?: string;

  @ApiPropertyOptional({ example: 'Formação Tecnológica de Alta Performance' })
  @IsOptional()
  @IsString()
  heroTitle?: string;

  @ApiPropertyOptional({ example: 'Capacitando profissionais e pesquisadores para o futuro.' })
  @IsOptional()
  @IsString()
  heroSubtitle?: string;

  @ApiPropertyOptional({ example: '7afcb789-348c-4953-b2f6-bf51fa520008' })
  @IsOptional()
  @IsUUID()
  heroMediaId?: string;

  @ApiPropertyOptional({ example: 'contato@ceic.tec.br' })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({ example: '+55 81 99999-9999' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiPropertyOptional({ example: 'Recife, PE, Brasil' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: { instagram: 'https://instagram.com/ceic', linkedin: 'https://linkedin.com/company/ceic' } })
  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, unknown>;
}
