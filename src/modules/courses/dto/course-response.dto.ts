import { ApiProperty } from '@nestjs/swagger';

export class CourseResponseDto {
  @ApiProperty({ description: 'Identificador unico do curso (UUID)', example: '7afcb789-348c-4953-b2f6-bf51fa520008' })
  id!: string;

  @ApiProperty({ description: 'Titulo do curso', example: 'TypeScript Avancado e Design Patterns' })
  title!: string;

  @ApiProperty({ description: 'Slug unico amigavel para URLs', example: 'typescript-avancado-design-patterns' })
  slug!: string;

  @ApiProperty({ description: 'Descricao do conteudo e ementa do curso', example: 'Tipagem avancada, generics e tecnicas de arquitetura limpa.' })
  description!: string;

  @ApiProperty({ description: 'Status de publicacao do curso na plataforma', example: true })
  published!: boolean;

  @ApiProperty({ description: 'Data de criacao do registro', example: '2026-10-05T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ description: 'Data da ultima atualizacao', example: '2026-10-05T12:30:00.000Z' })
  updatedAt!: Date;
}
