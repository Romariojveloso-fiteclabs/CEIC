import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUrl, IsUUID, Length, Matches, Min } from 'class-validator';

export class UpdatePartnerDto {
  @ApiPropertyOptional({ example: 'Empresa Parceira S/A' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  @Matches(/\S/)
  name?: string;

  @ApiPropertyOptional({ example: 'empresa-parceira' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @ApiPropertyOptional({ example: 'Descrição da parceria e atuação.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '7afcb789-348c-4953-b2f6-bf51fa520008' })
  @IsOptional()
  @IsUUID()
  logoMediaId?: string;

  @ApiPropertyOptional({ example: 'https://parceiro.com.br' })
  @IsOptional()
  @IsUrl()
  websiteUrl?: string;

  @ApiPropertyOptional({ example: '7afcb789-348c-4953-b2f6-bf51fa520008' })
  @IsOptional()
  @IsUUID()
  representativePersonId?: string;

  @ApiPropertyOptional({ example: 'Depoimento sobre a parceria com o CEIC.' })
  @IsOptional()
  @IsString()
  testimonial?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}
