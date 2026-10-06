import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({ description: 'Codigo de status HTTP', example: 400, type: () => Number })
  statusCode!: number;

  @ApiProperty({
    description: 'Mensagem explicativa ou lista de inconsistencias de validacao',
    example: 'Parametros invalidos na requisicao',
    type: () => Object,
  })
  message!: string | string[];

  @ApiProperty({ description: 'Descricao textual da categoria do erro HTTP', example: 'Bad Request', type: () => String })
  error!: string;

  @ApiPropertyOptional({ description: 'Codigo interno ou especifico do erro para regras de negocio', example: 'VALIDATION_ERROR', type: () => String })
  code?: string;

  @ApiProperty({ description: 'Data e hora da ocorrencia no formato ISO 8601', example: '2026-10-05T15:00:00.000Z', type: () => String })
  timestamp!: string;

  @ApiProperty({ description: 'Caminho do endpoint requisitado', example: '/api/courses', type: () => String })
  path!: string;
}
