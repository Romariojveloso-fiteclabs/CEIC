export interface CmsCourse {
  id: string;
  title: string;
  slug: string;
  description: string;
  published: boolean;
  workloadHours?: number;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseDto {
  title: string;
  slug: string;
  description: string;
  workloadHours?: number;
  published?: boolean;
}

export interface UpdateCourseDto {
  title?: string;
  slug?: string;
  description?: string;
  workloadHours?: number;
  published?: boolean;
}
