import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module.js';
import { AdminDisciplinesController } from './admin-disciplines.controller.js';
import { DisciplinesController } from './disciplines.controller.js';
import { DisciplinesService } from './disciplines.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminDisciplinesController, DisciplinesController],
  providers: [DisciplinesService],
  exports: [DisciplinesService],
})
export class DisciplinesModule {}
