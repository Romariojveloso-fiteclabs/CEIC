import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUUID, Length, Matches, MaxLength, ValidateIf } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'TypeScript Avançado' })
  @IsString()
  @Length(1, 200)
  @Matches(/\S/)
  title!: string;

  @ApiPropertyOptional({ example: 'typescript-avancado' })
  @ValidateIf((_o: unknown, v: unknown) => v !== undefined)
  @IsString()
  @Length(1, 200)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @ApiPropertyOptional({ example: 'Breve introdução ao curso.' })
  @ValidateIf((_o: unknown, v: unknown) => v !== undefined)
  @IsString()
  @MaxLength(500)
  shortDescription?: string;

  @ApiPropertyOptional({ example: 'Descrição detalhada do curso.' })
  @ValidateIf((_o: unknown, v: unknown) => v !== undefined)
  @IsString()
  @MaxLength(20000)
  description?: string;

  @ApiPropertyOptional({ example: '7afcb789-348c-4953-b2f6-bf51fa520008' })
  @ValidateIf((_o: unknown, v: unknown) => v !== undefined)
  @IsUUID()
  coverMediaId?: string;
}
