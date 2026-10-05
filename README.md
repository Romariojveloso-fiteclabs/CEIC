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

## Banco

```bash
npm run db:generate
npm run db:migrate
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

```bash
npm run docker:up
npm run docker:down
npm run docker:logs
```

## Swagger

Documentação interativa em `http://localhost:3000/api/docs` (JSON em `/api/docs-json`). Fica ativa fora de produção e, em produção, somente com `SWAGGER_ENABLED=true`; o `.env` local a habilita, inclusive no Docker. Use `SWAGGER_ENABLED=false` para desativá-la. As rotas de `/api/auth/*` não constam na documentação.

## Build

```bash
npm run build
npm run start:prod
npm test
```

Os testes usam `TEST_DATABASE_URL` ou `DATABASE_URL`.
