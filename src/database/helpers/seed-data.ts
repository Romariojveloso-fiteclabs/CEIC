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
  description: string;
  published: boolean;
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
    description: 'Fundamentos de arquitetura web, protocolos HTTP, APIs RESTful e boas praticas de seguranca.',
    published: true,
  },
  {
    title: 'Arquitetura de Software e Clean Code',
    slug: 'arquitetura-software-clean-code',
    description: 'Padroes de projeto, principios SOLID, modularizacao e design de software sustentavel.',
    published: true,
  },
  {
    title: 'Seguranca e Autenticacao com OAuth e JWT',
    slug: 'seguranca-autenticacao-oauth-jwt',
    description: 'Implementacao pratica de autenticacao, RBAC, sessao segura e controle de acesso.',
    published: true,
  },
  {
    title: 'TypeScript Avancado e Design Patterns',
    slug: 'typescript-avancado-design-patterns',
    description: 'Tipagem avancada, generics, decorators e tecnicas robustas para aplicacoes escalaveis.',
    published: false,
  },
  {
    title: 'Microsservicos com NestJS e Docker',
    slug: 'microsservicos-nestjs-docker',
    description: 'Construcao e orquestracao de servicos conteinerizados de alta disponibilidade.',
    published: false,
  },
];
