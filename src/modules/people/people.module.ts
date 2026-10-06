import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module.js';
import { AdminPeopleController } from './admin-people.controller.js';
import { PeopleController } from './people.controller.js';
import { PeopleService } from './people.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminPeopleController, PeopleController],
  providers: [PeopleService],
  exports: [PeopleService],
})
export class PeopleModule {}
