import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error-response.dto.js';

const defaultDescriptions: Record<number, string> = {
  400: 'Requisicao invalida ou dados inconsistentes',
  401: 'Nao autenticado ou credenciais invalidas',
  403: 'Acesso proibido ou permissao insuficiente',
  404: 'Recurso nao encontrado',
  409: 'Conflito de estado ou duplicidade de recurso',
  422: 'Entidade improcessavel ou violacao de regra de negocio',
  500: 'Erro interno no servidor',
};

export function ApiStandardErrors(...statusCodes: number[]) {
  const codes = statusCodes.length > 0 ? statusCodes : [400, 401, 403, 404, 500];

  return applyDecorators(
    ...codes.map((status) =>
      ApiResponse({
        status,
        description: defaultDescriptions[status] || 'Erro inesperado na operacao',
        type: ErrorResponseDto,
      }),
    ),
  );
}
