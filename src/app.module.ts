import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module.js';
import { CoursesModule } from './modules/courses/courses.module.js';

@Module({ imports: [AuthModule, CoursesModule] })
export class AppModule {}
