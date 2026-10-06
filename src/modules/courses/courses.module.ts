import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module.js';
import { AdminCoursesController } from './admin-courses.controller.js';
import { CoursesController } from './courses.controller.js';
import { CoursesService } from './courses.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminCoursesController, CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
