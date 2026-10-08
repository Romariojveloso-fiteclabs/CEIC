export type ContentStatus = 'draft' | 'published' | 'archived';

export interface ScheduleItem {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  modality: 'Presencial' | 'Online Síncrono' | 'Cyber Range';
  activity: string;
}

export interface DisciplineOffer {
  id: string;
  disciplineId: string;
  credits: number;
  workloadHours: number;
  startDate: string;
  endDate: string;
  professorIds: string[];
  schedule: ScheduleItem[];
}

export interface CmsDiscipline {
  id: string;
  name: string;
  slug: string;
  syllabus: string;
  bibliography: string;
  credits: number;
  workloadHours: number;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CmsCohort {
  id: string;
  courseId: string;
  name: string;
  startDate: string;
  endDate: string;
  enrollmentStart: string;
  enrollmentEnd: string;
  enrollmentStatus: 'open' | 'upcoming' | 'closed';
  classHours: number;
  practicalHours: number;
  vacancies: number;
  price: string;
  enrollmentUrl: string;
  noticeUrl: string;
  status: ContentStatus;
  disciplines: DisciplineOffer[];
  createdAt: string;
  updatedAt: string;
}

export interface CmsCourseItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  coverImage: string;
  status: ContentStatus;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CmsPerson {
  id: string;
  name: string;
  title: string;
  organization: string;
  bio: string;
  photoUrl: string;
  email: string;
  linkedinUrl: string;
  websiteUrl: string;
  roleTags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CmsMentorship {
  id: string;
  title: string;
  mentorId: string;
  summary: string;
  description: string;
  workloadHours: number;
  duration: string;
  noticeUrl: string;
  enrollmentUrl: string;
  status: ContentStatus;
  schedule: ScheduleItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CmsNews {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverImage: string;
  content: string;
  relatedPeopleIds: string[];
  status: ContentStatus;
  authorId: string;
  authorName: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CmsPartner {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  websiteUrl: string;
  representativeId: string;
  testimonial: string;
  order: number;
  status: ContentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  status: ContentStatus;
  systemKey: 'sobre' | 'faq' | 'manual-docente' | 'inscricao' | 'contato' | 'custom';
  createdAt: string;
  updatedAt: string;
}

export interface CmsMediaItem {
  id: string;
  title: string;
  url: string;
  altText: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
}

export interface SiteSettings {
  institutional: {
    brandName: string;
    entity: string;
    department: string;
    address: string;
    ordinance: string;
  };
  hero: {
    mainHeadline: string;
    leadParagraph: string;
    ctaLabel: string;
    ctaUrl: string;
  };
  contact: {
    email: string;
    phone: string;
    supportUrl: string;
    officeHours: string;
  };
  social: {
    linkedin: string;
    github: string;
    youtube: string;
    instagram: string;
  };
}

export interface AuditLog {
  id: string;
  date: string;
  userEmail: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'ARCHIVE' | 'AUTH';
  entityType: 'Curso' | 'Turma' | 'Disciplina' | 'Pessoa' | 'Notícia' | 'Mídia' | 'Configurações' | 'Usuário' | 'Mentoria' | 'Parceiro' | 'Página';
  entityTitle: string;
  details: string;
  beforeState?: string;
  afterState?: string;
}
