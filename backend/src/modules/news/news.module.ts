import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module.js';
import { AdminNewsController } from './admin-news.controller.js';
import { NewsController } from './news.controller.js';
import { NewsService } from './news.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminNewsController, NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}
