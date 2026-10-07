# CEIC API

## Requisitos

Node.js 24, npm 11, Docker e Docker Compose.

## Instalação

```bash
npm install
npm run setup
```

Configure `RESEND_API_KEY` e `EMAIL_FROM` no `.env` para enviar e-mails.

```bash
npm run auth:admin -- --email admin@example.com --name Admin
```

## Desenvolvimento

```bash
npm run dev
```

## Documentação (Swagger)

Com a aplicação em execução, a documentação OpenAPI fica disponível em:

- Swagger UI: `http://localhost:3000/api/docs`
- OpenAPI JSON: `http://localhost:3000/api/docs-json`
- OpenAPI YAML: `http://localhost:3000/api/docs-yaml`
- Better Auth Reference (Scalar): `http://localhost:3000/api/auth/reference`

## Banco

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
npm run db:studio
```

### Erro de senha (`28P01`)

```bash
docker compose up -d postgres
docker compose exec postgres psql -U ceic -d ceic
```

Execute `\password ceic`, informe a senha de `DATABASE_URL` e saia com `\q`.

```bash
docker compose up -d --wait postgres
npm run db:migrate
npm run db:studio
```

## Docker

### Banco de Dados (PostgreSQL)

Para subir apenas o container de banco de dados (`postgres`):

```bash
npm run docker:db
npm run docker:db:down
```

Configurações do container `postgres`:
- Usuário: `ceic`
- Senha: `ceic`
- Banco: `ceic`
- Porta no host: `5433` (mapeada para `5432` no container)
- Volume: `postgres_data`

### Ambiente Completo (API + PostgreSQL)

```bash
npm run docker:up
npm run docker:down
npm run docker:logs
```

## Swagger

Documentação interativa em `http://localhost:3000/api/docs` (JSON em `/api/docs-json`). Fica ativa fora de produção e, em produção, somente com `SWAGGER_ENABLED=true`; o `.env` local a habilita, inclusive no Docker. Use `SWAGGER_ENABLED=false` para desativá-la. Inclui endpoints autenticados e administrativos (`/api/auth/*`) e gerenciamento de cursos (`/api/courses`).

## Build

```bash
npm run build
npm run start:prod
npm test
```

Os testes usam `TEST_DATABASE_URL` ou `DATABASE_URL`.
