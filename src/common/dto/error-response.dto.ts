import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ description: 'Codigo de status HTTP', example: 400 })
  statusCode!: number;

  @ApiProperty({
    description: 'Mensagem explicativa ou lista de inconsistencias de validacao',
    oneOf: [
      { type: 'string', example: 'Parametros invalidos na requisicao' },
      { type: 'array', items: { type: 'string' }, example: ['email deve ser um e-mail valido'] },
    ],
  })
  message!: string | string[];

  @ApiProperty({ description: 'Descricao textual da categoria do erro HTTP', example: 'Bad Request' })
  error!: string;

  @ApiPropertyOptional({ description: 'Codigo interno ou especifico do erro para regras de negocio', example: 'VALIDATION_ERROR' })
  code?: string;

  @ApiProperty({ description: 'Data e hora da ocorrencia no formato ISO 8601', example: '2026-10-05T15:00:00.000Z' })
  timestamp!: string;

  @ApiProperty({ description: 'Caminho do endpoint requisitado', example: '/api/courses' })
  path!: string;
}
