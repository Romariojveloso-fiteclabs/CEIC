# CEIC API

## Requisitos

Node.js 24, npm 11, Docker e Docker Compose.

## Instalação

```bash
npm install
npm run setup
```

O `.env` versionado contém somente valores locais. Configure `RESEND_API_KEY` e um `EMAIL_FROM` autorizado para enviar e-mails; sem a chave, recuperação e verificação retornam `503 EMAIL_NOT_CONFIGURED`. A verificação é solicitada em `/api/auth/send-verification-email`.

Para criar o primeiro administrador, execute `npm run auth:admin -- --email admin@example.com --name Admin`; o CLI solicita a senha.

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

## Docker

```bash
npm run docker:up
npm run docker:down
npm run docker:logs
```

## Build

```bash
npm run build
npm run start:prod
npm test
```

Os testes usam PostgreSQL real em `TEST_DATABASE_URL` (ou `DATABASE_URL`) e removem somente os dados criados pela própria execução.
