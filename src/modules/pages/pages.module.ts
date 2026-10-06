import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module.js';
import { AdminPagesController } from './admin-pages.controller.js';
import { PagesController } from './pages.controller.js';
import { PagesService } from './pages.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminPagesController, PagesController],
  providers: [PagesService],
  exports: [PagesService],
})
export class PagesModule {}
