import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class PublishCourseDto {
  @ApiProperty({ description: 'Define se o curso esta publicado', example: true })
  @IsBoolean()
  published!: boolean;
}
