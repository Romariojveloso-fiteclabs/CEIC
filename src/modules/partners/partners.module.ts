import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module.js';
import { AdminPartnersController } from './admin-partners.controller.js';
import { PartnersController } from './partners.controller.js';
import { PartnersService } from './partners.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminPartnersController, PartnersController],
  providers: [PartnersService],
  exports: [PartnersService],
})
export class PartnersModule {}
