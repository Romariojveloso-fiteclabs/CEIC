import { Logger } from '@nestjs/common';
import { createApp } from './app.js';
import { config } from './config/config.js';

async function bootstrap() {
  const app = await createApp();
  await app.listen(config.app.port, '0.0.0.0');
}

bootstrap().catch((error: unknown) => {
  new Logger('Bootstrap').error(error instanceof Error ? error.message : 'Falha ao iniciar a API.');
  process.exit(1);
});
