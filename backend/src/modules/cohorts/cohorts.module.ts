import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module.js';
import { AdminCohortsController } from './admin-cohorts.controller.js';
import { CohortsController } from './cohorts.controller.js';
import { CohortsService } from './cohorts.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminCohortsController, CohortsController],
  providers: [CohortsService],
  exports: [CohortsService],
})
export class CohortsModule {}
