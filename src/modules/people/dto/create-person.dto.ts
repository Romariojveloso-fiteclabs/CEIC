import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl, IsUUID, Length, Matches } from 'class-validator';

export class CreatePersonDto {
  @ApiProperty({ example: 'Dr. Roberto Santos' })
  @IsString()
  @Length(1, 200)
  @Matches(/\S/)
  name!: string;

  @ApiPropertyOptional({ example: 'roberto-santos' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @ApiPropertyOptional({ example: 'Professor Titular' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  title?: string;

  @ApiPropertyOptional({ example: 'UFPE' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  organization?: string;

  @ApiPropertyOptional({ example: 'Biografia e resumo de qualificações.' })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ example: '7afcb789-348c-4953-b2f6-bf51fa520008' })
  @IsOptional()
  @IsUUID()
  photoMediaId?: string;

  @ApiPropertyOptional({ example: 'roberto@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: 'https://linkedin.com/in/roberto' })
  @IsOptional()
  @IsUrl()
  linkedinUrl?: string;

  @ApiPropertyOptional({ example: 'https://roberto.dev' })
  @IsOptional()
  @IsUrl()
  websiteUrl?: string;
}
