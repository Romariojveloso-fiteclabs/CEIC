import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CourseResponseDto {
  @ApiProperty({ example: '7afcb789-348c-4953-b2f6-bf51fa520008', type: () => String })
  id!: string;

  @ApiProperty({ example: 'TypeScript Avançado e Design Patterns', type: () => String })
  title!: string;

  @ApiProperty({ example: 'typescript-avancado-design-patterns', type: () => String })
  slug!: string;

  @ApiPropertyOptional({ example: 'Resumo conciso do curso.', type: () => String })
  shortDescription?: string | null;

  @ApiProperty({ example: 'Conteúdo programático completo.', type: () => String })
  description!: string;

  @ApiPropertyOptional({ example: '7afcb789-348c-4953-b2f6-bf51fa520008', type: () => String })
  coverMediaId?: string | null;

  @ApiProperty({ example: 'published', enum: ['draft', 'published', 'archived'], type: () => String })
  status!: string;

  @ApiPropertyOptional({ example: '2026-10-05T12:00:00.000Z', type: () => Date })
  publishedAt?: Date | null;

  @ApiProperty({ example: '2026-10-05T12:00:00.000Z', type: () => Date })
  createdAt!: Date;

  @ApiProperty({ example: '2026-10-05T12:30:00.000Z', type: () => Date })
  updatedAt!: Date;

  @ApiPropertyOptional({ example: '7afcb789-348c-4953-b2f6-bf51fa520008', type: () => String })
  createdBy?: string | null;

  @ApiPropertyOptional({ example: '7afcb789-348c-4953-b2f6-bf51fa520008', type: () => String })
  updatedBy?: string | null;

  @ApiPropertyOptional({ example: null, type: () => Date })
  deletedAt?: Date | null;
}
