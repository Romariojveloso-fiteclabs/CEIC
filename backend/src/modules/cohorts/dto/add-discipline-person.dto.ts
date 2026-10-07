import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsUUID } from 'class-validator';

export class AddDisciplinePersonDto {
  @ApiProperty({ example: '7afcb789-348c-4953-b2f6-bf51fa520008' })
  @IsUUID()
  personId!: string;

  @ApiProperty({ example: 'professor', enum: ['professor', 'preceptor', 'guest'] })
  @IsIn(['professor', 'preceptor', 'guest'])
  role!: 'professor' | 'preceptor' | 'guest';
}
