import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ description: 'Nome completo do novo usuario', example: 'Admin Usuario' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'E-mail cadastrado', example: 'novo.usuario@ceic.local' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: 'Senha de acesso (minimo 8 caracteres)', example: 'Admin@123456' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiPropertyOptional({ description: 'URL da imagem do perfil', example: 'https://example.com/avatar.png' })
  @IsUrl()
  @IsOptional()
  image?: string;
}
