import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignInDto {
  @ApiProperty({ description: 'E-mail cadastrado do usuario', example: 'admin@ceic.local', type: () => String })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: 'Senha da conta', example: 'Admin@123456', type: () => String })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiPropertyOptional({ description: 'Manter a sessao ativa por tempo prolongado', example: true, default: true, type: () => Boolean })
  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;
}
