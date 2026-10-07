import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { config } from '../config/config.js';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly client = config.email.apiKey ? new Resend(config.email.apiKey) : undefined;

  get configured(): boolean {
    return this.client !== undefined;
  }

  async send(message: { to: string; subject: string; text: string }): Promise<void> {
    if (!this.client) {
      throw new Error('Configure RESEND_API_KEY para enviar e-mails.');
    }
    const { error } = await this.client.emails.send({ from: config.email.from, ...message });
    if (error) {
      this.logger.error(`Resend: ${error.name}: ${error.message}`);
      throw new Error('Não foi possível enviar o e-mail pelo Resend.');
    }
  }
}
