import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ description: 'Nome completo do novo usuario', example: 'Admin Usuario', type: () => String })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'E-mail cadastrado', example: 'novo.usuario@ceic.local', type: () => String })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: 'Senha de acesso (minimo 8 caracteres)', example: 'Admin@123456', type: () => String })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiPropertyOptional({ description: 'URL da imagem do perfil', example: 'https://example.com/avatar.png', type: () => String })
  @IsUrl()
  @IsOptional()
  image?: string;
}
