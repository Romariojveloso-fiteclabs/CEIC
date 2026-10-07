import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module.js';
import { AdminMediaController } from './admin-media.controller.js';
import { MediaController } from './media.controller.js';
import { MediaStorageService } from './media-storage.service.js';
import { MediaService } from './media.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminMediaController, MediaController],
  providers: [MediaStorageService, MediaService],
  exports: [MediaService, MediaStorageService],
})
export class MediaModule {}
