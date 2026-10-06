import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module.js';
import { AdminMentorshipsController } from './admin-mentorships.controller.js';
import { MentorshipsController } from './mentorships.controller.js';
import { MentorshipsService } from './mentorships.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminMentorshipsController, MentorshipsController],
  providers: [MentorshipsService],
  exports: [MentorshipsService],
})
export class MentorshipsModule {}
