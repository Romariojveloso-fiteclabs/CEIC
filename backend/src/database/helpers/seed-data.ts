export interface SeedUser {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'author';
  emailVerified: boolean;
  banned?: boolean;
  banReason?: string;
}

export interface SeedCourse {
  title: string;
  slug: string;
  shortDescription?: string;
  description: string;
  status: 'published' | 'draft' | 'archived';
  publishedAt?: Date | null;
}

export const seedUsers: SeedUser[] = [
  {
    name: 'Super Admin',
    email: 'admin@ceic.local',
    password: 'Admin@123456',
    role: 'admin',
    emailVerified: true,
  },
  {
    name: 'Editor Conteudo',
    email: 'editor@ceic.local',
    password: 'Editor@123456',
    role: 'editor',
    emailVerified: true,
  },
  {
    name: 'Autor Artigos',
    email: 'author@ceic.local',
    password: 'Author@123456',
    role: 'author',
    emailVerified: true,
  },
  {
    name: 'Aluno Plataforma',
    email: 'aluno@ceic.local',
    password: 'Aluno@123456',
    role: 'author',
    emailVerified: true,
  },
  {
    name: 'Usuario Suspenso',
    email: 'banido@ceic.local',
    password: 'Banido@123456',
    role: 'author',
    emailVerified: true,
    banned: true,
    banReason: 'Violacao dos termos de servico da plataforma',
  },
];

export const seedCourses: SeedCourse[] = [
  {
    title: 'Introducao ao Desenvolvimento Web Moderno',
    slug: 'introducao-desenvolvimento-web-moderno',
    shortDescription: 'Fundamentos de arquitetura web e APIs RESTful.',
    description: 'Fundamentos de arquitetura web, protocolos HTTP, APIs RESTful e boas praticas de seguranca.',
    status: 'published',
    publishedAt: new Date(),
  },
  {
    title: 'Arquitetura de Software e Clean Code',
    slug: 'arquitetura-software-clean-code',
    shortDescription: 'Padroes de projeto e principios SOLID.',
    description: 'Padroes de projeto, principios SOLID, modularizacao e design de software sustentavel.',
    status: 'published',
    publishedAt: new Date(),
  },
  {
    title: 'Seguranca e Autenticacao com OAuth e JWT',
    slug: 'seguranca-autenticacao-oauth-jwt',
    shortDescription: 'Implementacao pratica de autenticacao e RBAC.',
    description: 'Implementacao pratica de autenticacao, RBAC, sessao segura e controle de acesso.',
    status: 'published',
    publishedAt: new Date(),
  },
  {
    title: 'TypeScript Avancado e Design Patterns',
    slug: 'typescript-avancado-design-patterns',
    shortDescription: 'Tipagem avancada, generics e decorators.',
    description: 'Tipagem avancada, generics, decorators e tecnicas robustas para aplicacoes escalaveis.',
    status: 'draft',
    publishedAt: null,
  },
  {
    title: 'Microsservicos com NestJS e Docker',
    slug: 'microsservicos-nestjs-docker',
    shortDescription: 'Construcao e orquestracao de servicos conteinerizados.',
    description: 'Construcao e orquestracao de servicos conteinerizados de alta disponibilidade.',
    status: 'draft',
    publishedAt: null,
  },
];
