import 'reflect-metadata';
import { createAuth } from '../src/auth/auth.js';
import { DatabaseService } from '../src/database/database.service.js';
import { EmailService } from '../src/email/email.service.js';

const database = new DatabaseService();
export const auth = createAuth(database.db, new EmailService());
