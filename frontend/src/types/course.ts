export interface ModuleTopic {
  title: string;
  description: string;
}

export interface CourseModule {
  id: number;
  code: string;
  title: string;
  workload: number;
  practicalHours: number;
  category: 'fundamentos' | 'deteccao' | 'forense' | 'inteligencia' | 'governanca' | 'ofensiva' | 'nuvem';
  categoryLabel: string;
  summary: string;
  topics: string[];
  tools: string[];
  competencies: string[];
  evaluationMethod: string;
  instructor?: string;
}

export interface CourseProgram {
  id: string;
  title: string;
  slug: string;
  degree: string;
  tagline: string;
  description: string;
  workloadTotal: number;
  practicalHours: number;
  category: 'pos-graduacao' | 'mentoria' | 'pesquisa';
  modules: CourseModule[];
}

export interface FacultyMember {
  id: string;
  name: string;
  title: string;
  institutionRole: string;
  academicBackground: string;
  bio: string;
  areasOfExpertise: string[];
  lattesUrl?: string;
  badge: string;
  avatarUrl?: string;
  mediaCount?: number;
}

export interface ProgramImage {
  id: string;
  title: string;
  category: 'cyber-range' | 'laboratorios' | 'aulas' | 'pesquisa' | 'certificacao' | 'instalacoes';
  categoryLabel: string;
  imageUrl: string;
  caption: string;
  date: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: 'academico' | 'matricula' | 'metodologia' | 'certificacao' | 'sigaa';
  highlight?: string;
}

export interface PartnerInfo {
  id: string;
  name: string;
  category: 'tecnologia' | 'educacao' | 'seguranca' | 'inteligencia';
  categoryLabel: string;
  logoUrl: string;
  description: string;
  websiteUrl?: string;
}

export interface MediaAppearance {
  id: string;
  facultyName: string;
  facultyRole: string;
  facultyPhotoUrl?: string;
  mediaTitle: string;
  vehicle: string;
  date?: string;
  details: string;
  imageUrl?: string;
  videoUrl?: string;
}

export interface SelectionStep {
  stepNumber: number;
  title: string;
  summary: string;
  details: string[];
  tips?: string[];
  warning?: string;
  imageUrl?: string;
  actionUrl?: string;
  actionLabel?: string;
}

export interface DocenteManualStep {
  stepNumber: number;
  title: string;
  instruction: string;
  details: string[];
  screenshots?: { url: string; caption?: string }[];
  actionLinks?: { label: string; url: string; isDownload?: boolean }[];
  importantNotice?: string;
}
