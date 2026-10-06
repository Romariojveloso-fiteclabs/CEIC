import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty({ description: 'ID unico do usuario (UUID)', example: '7afcb789-348c-4953-b2f6-bf51fa520008', type: () => String })
  id!: string;

  @ApiProperty({ description: 'Nome do usuario', example: 'Super Admin', type: () => String })
  name!: string;

  @ApiProperty({ description: 'E-mail do usuario', example: 'admin@ceic.local', type: () => String })
  email!: string;

  @ApiProperty({ description: 'Indicador de e-mail verificado', example: true, type: () => Boolean })
  emailVerified!: boolean;

  @ApiProperty({ description: 'Papel/permissao atribuida ao usuario', example: 'admin', type: () => String })
  role!: string;

  @ApiProperty({ description: 'Data de criacao do usuario', example: '2026-10-05T12:00:00.000Z', type: () => Date })
  createdAt!: Date;

  @ApiProperty({ description: 'Data da ultima atualizacao', example: '2026-10-05T12:00:00.000Z', type: () => Date })
  updatedAt!: Date;
}

export class LoginResponseDto {
  @ApiProperty({
    description: 'Token de autenticacao para utilizacao no Bearer header',
    example: 'y8bVybWKCX15VApA47BPkoB6I2fSNn3Z',
    type: () => String,
  })
  token!: string;

  @ApiProperty({ description: 'Dados cadastrais do usuario autenticado', type: () => AuthUserDto })
  user!: AuthUserDto;

  @ApiProperty({ description: 'Indicador de redirecionamento', example: false, type: () => Boolean })
  redirect!: boolean;
}
