import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { DatabaseService } from '../../database/database.service.js';
import { courses } from '../../database/schema/courses.schema.js';
import type { CreateCourseDto } from './dto/create-course.dto.js';
import type { UpdateCourseDto } from './dto/update-course.dto.js';

@Injectable()
export class CoursesService {
  constructor(private readonly database: DatabaseService) {}

  findPublished() {
    return this.database.db.select().from(courses).where(eq(courses.published, true)).orderBy(desc(courses.createdAt));
  }

  async findPublishedBySlug(slug: string) {
    const [course] = await this.database.db.select().from(courses)
      .where(and(eq(courses.slug, slug), eq(courses.published, true))).limit(1);
    if (!course) throw new NotFoundException('Curso não encontrado.');
    return course;
  }

  create(input: CreateCourseDto) {
    return this.write(() => this.database.db.insert(courses).values(input).returning());
  }

  update(id: string, input: UpdateCourseDto) {
    return this.write(() => this.database.db.update(courses).set({ ...input, updatedAt: new Date() })
      .where(eq(courses.id, id)).returning());
  }

  publish(id: string, published: boolean) {
    return this.write(() => this.database.db.update(courses).set({ published, updatedAt: new Date() })
      .where(eq(courses.id, id)).returning());
  }

  async remove(id: string) {
    await this.write(() => this.database.db.delete(courses).where(eq(courses.id, id)).returning());
  }

  private async write(operation: () => Promise<(typeof courses.$inferSelect)[]>) {
    try {
      const [course] = await operation();
      if (!course) throw new NotFoundException('Curso não encontrado.');
      return course;
    } catch (error) {
      const cause = error instanceof Error ? error.cause : error;
      if (cause && typeof cause === 'object' && 'code' in cause && cause.code === '23505') {
        throw new ConflictException('Já existe um curso com este slug.');
      }
      throw error;
    }
  }
}
