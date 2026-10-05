import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthService } from '@thallesp/nestjs-better-auth';
import { LoginResponseDto } from '../auth/dto/login-response.dto.js';
import { SignInDto } from '../auth/dto/sign-in.dto.js';
import { SignUpDto } from '../auth/dto/sign-up.dto.js';
import { ErrorResponseDto } from '../common/dto/error-response.dto.js';
import { CourseResponseDto } from '../modules/courses/dto/course-response.dto.js';

interface BetterAuthOpenApiSpec {
  paths?: Record<string, Record<string, {
    tags?: string[];
    summary?: string;
    description?: string;
    responses?: Record<string, unknown>;
  }>>;
  components?: { schemas?: Record<string, unknown> };
}

const allowedAuthPaths: Record<string, { summary: string; tag: string; keepMethods?: string[] }> = {
  '/sign-out': { summary: 'Encerrar sessao ativa (Sign Out)', tag: 'auth', keepMethods: ['post'] },
  '/get-session': { summary: 'Consultar sessao ativa e dados do usuario autenticado', tag: 'auth', keepMethods: ['get'] },
  '/change-password': { summary: 'Alterar senha da conta autenticada', tag: 'auth', keepMethods: ['post'] },
  '/request-password-reset': { summary: 'Solicitar redefinicao de senha por e-mail', tag: 'auth', keepMethods: ['post'] },
  '/reset-password': { summary: 'Redefinir senha utilizando token de recuperacao', tag: 'auth', keepMethods: ['post'] },
  '/send-verification-email': { summary: 'Enviar e-mail para confirmacao de conta', tag: 'auth', keepMethods: ['post'] },
  '/verify-email': { summary: 'Confirmar e-mail utilizando token de verificacao', tag: 'auth', keepMethods: ['get'] },
  '/list-sessions': { summary: 'Listar todas as sessoes ativas do usuario', tag: 'auth', keepMethods: ['get'] },
  '/revoke-session': { summary: 'Revogar sessao especifica informando token', tag: 'auth', keepMethods: ['post'] },
  '/revoke-other-sessions': { summary: 'Revogar todas as outras sessoes ativas', tag: 'auth', keepMethods: ['post'] },
  '/admin/list-users': { summary: 'Listar usuarios cadastrados (Admin)', tag: 'admin', keepMethods: ['get'] },
  '/admin/get-user': { summary: 'Consultar detalhes de um usuario (Admin)', tag: 'admin', keepMethods: ['get'] },
  '/admin/create-user': { summary: 'Criar usuario administrativamente (Admin)', tag: 'admin', keepMethods: ['post'] },
  '/admin/update-user': { summary: 'Atualizar dados de um usuario (Admin)', tag: 'admin', keepMethods: ['post'] },
  '/admin/remove-user': { summary: 'Excluir usuario do sistema (Admin)', tag: 'admin', keepMethods: ['post'] },
  '/admin/set-role': { summary: 'Definir papel (role) de usuario (Admin)', tag: 'admin', keepMethods: ['post'] },
  '/admin/set-user-password': { summary: 'Redefinir senha de um usuario (Admin)', tag: 'admin', keepMethods: ['post'] },
  '/admin/ban-user': { summary: 'Banir usuario do sistema (Admin)', tag: 'admin', keepMethods: ['post'] },
  '/admin/unban-user': { summary: 'Desbanir usuario do sistema (Admin)', tag: 'admin', keepMethods: ['post'] },
};

const standardErrorResponses = {
  '400': {
    description: 'Requisicao invalida ou dados inconsistentes',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponseDto' },
      },
    },
  },
  '401': {
    description: 'Nao autenticado ou credenciais invalidas',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponseDto' },
      },
    },
  },
  '403': {
    description: 'Acesso proibido ou permissao insuficiente',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponseDto' },
      },
    },
  },
  '404': {
    description: 'Recurso nao encontrado',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponseDto' },
      },
    },
  },
  '422': {
    description: 'Entidade improcessavel ou violacao de regra de negocio',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponseDto' },
      },
    },
  },
  '500': {
    description: 'Erro interno no servidor',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponseDto' },
      },
    },
  },
};

export async function setupSwagger(app: INestApplication): Promise<void> {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('CEIC API')
    .setDescription('Documentacao OpenAPI dos endpoints da CEIC API')
    .setVersion('0.1.0')
    .addTag('auth', 'Autenticacao e gestao de sessao do usuario')
    .addTag('admin', 'Operacoes administrativas de usuarios e permissoes')
    .addTag('courses', 'Gerenciamento de cursos e conteudos')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Token JWT / Bearer para autenticacao',
        in: 'header',
      },
      'bearer',
    )
    .addCookieAuth('better-auth.session_token')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    extraModels: [SignInDto, SignUpDto, LoginResponseDto, ErrorResponseDto, CourseResponseDto],
  });

  document.paths['/api/auth/sign-in'] = {
    post: {
      tags: ['auth'],
      summary: 'Autenticar com e-mail e senha e gerar token (Sign In)',
      description: 'Valida as credenciais do usuario, gera a sessao e retorna o token de autenticacao (Bearer token) e os dados do usuario logado.',
      operationId: 'signIn',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/SignInDto',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Autenticado com sucesso. Retorna o token de autenticacao e os dados do usuario.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginResponseDto',
              },
            },
          },
        },
        ...standardErrorResponses,
      },
    },
  } as never;

  document.paths['/api/auth/sign-up'] = {
    post: {
      tags: ['auth'],
      summary: 'Cadastrar novo usuario com e-mail e senha (Sign Up)',
      description: 'Cria uma nova conta de usuario no sistema e retorna o token de autenticacao e dados cadastrais.',
      operationId: 'signUp',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/SignUpDto',
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Cadastro realizado com sucesso.',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginResponseDto',
              },
            },
          },
        },
        ...standardErrorResponses,
      },
    },
  } as never;

  try {
    const authService = app.get(AuthService, { strict: false });
    const auth = authService?.instance as {
      api?: {
        generateOpenAPISchema?: () => Promise<BetterAuthOpenApiSpec>;
      };
    };

    if (auth?.api?.generateOpenAPISchema) {
      const authSchema = await auth.api.generateOpenAPISchema();

      if (authSchema?.components?.schemas) {
        document.components = document.components || {};
        document.components.schemas = {
          ...authSchema.components.schemas,
          ...(document.components.schemas || {}),
        } as never;
      }

      if (authSchema?.paths) {
        for (const [pathKey, configItem] of Object.entries(allowedAuthPaths)) {
          const rawPath = authSchema.paths[pathKey];
          if (!rawPath) continue;

          const fullPath = `/api/auth${pathKey}`;
          const filteredPathMethods: Record<string, unknown> = {};

          for (const method of Object.keys(rawPath)) {
            if (configItem.keepMethods && !configItem.keepMethods.includes(method.toLowerCase())) {
              continue;
            }

            const operation = rawPath[method];
            if (operation && typeof operation === 'object') {
              operation.tags = [configItem.tag];
              operation.summary = configItem.summary;

              operation.responses = {
                ...(operation.responses || {}),
                ...standardErrorResponses,
              };
            }
            filteredPathMethods[method] = operation;
          }

          if (Object.keys(filteredPathMethods).length > 0) {
            document.paths[fullPath] = filteredPathMethods as never;
          }
        }
      }
    }
  } catch {
  }

  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
