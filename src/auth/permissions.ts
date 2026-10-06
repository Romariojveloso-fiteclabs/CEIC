import { ForbiddenException } from '@nestjs/common';
import { UserHasPermission } from '@thallesp/nestjs-better-auth';
import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements } from 'better-auth/plugins/admin/access';

export const statements = {
  ...defaultStatements,
  content: ['read', 'create', 'update', 'publish', 'delete'],
  course: ['read', 'create', 'update', 'delete', 'publish', 'archive', 'restore'],
  cohort: ['read', 'create', 'update', 'delete', 'publish', 'archive', 'restore'],
  discipline: ['read', 'create', 'update', 'delete', 'archive', 'restore'],
  people: ['read', 'create', 'update', 'delete', 'archive', 'restore'],
  page: ['read', 'create', 'update', 'delete', 'publish', 'archive', 'restore'],
  news: ['read', 'create', 'update', 'delete', 'publish', 'archive', 'restore'],
  partner: ['read', 'create', 'update', 'delete', 'publish', 'archive', 'restore'],
  mentorship: ['read', 'create', 'update', 'delete', 'publish', 'archive', 'restore'],
  media: ['read', 'upload', 'delete'],
  siteSettings: ['read', 'update'],
  audit: ['read'],
} as const;

export const accessControl = createAccessControl(statements);

export const roles = {
  admin: accessControl.newRole(statements),
  editor: accessControl.newRole({
    content: statements.content,
    course: statements.course,
    cohort: statements.cohort,
    discipline: statements.discipline,
    people: statements.people,
    page: statements.page,
    news: statements.news,
    partner: statements.partner,
    mentorship: statements.mentorship,
    media: statements.media,
    siteSettings: ['read'],
    audit: ['read'],
  }),
  author: accessControl.newRole({
    content: ['read', 'create', 'update'],
    course: ['read', 'create', 'update'],
    cohort: ['read', 'create', 'update'],
    discipline: ['read', 'create', 'update'],
    people: ['read', 'create', 'update'],
    page: ['read', 'create', 'update'],
    news: ['read', 'create', 'update'],
    partner: ['read', 'create', 'update'],
    mentorship: ['read', 'create', 'update'],
    media: ['read', 'upload'],
    siteSettings: ['read'],
  }),
};

export const defaultRole = 'author' satisfies keyof typeof roles;
export const adminRole = 'admin' satisfies keyof typeof roles;

type Resource = keyof typeof statements;
type ActionOf<R extends Resource> = (typeof statements[R])[number];

export type Permission = {
  [R in Resource]: `${R}:${ActionOf<R>}`;
}[Resource];

export function RequirePermission(permission: Permission) {
  const [resource, action] = permission.split(':');
  return UserHasPermission({ permissions: { [resource!]: [action!] } });
}

export function assertOwnership(
  entity: { createdBy?: string | null; status?: string | null },
  user: { id: string; role?: string | null },
  options: { allowDraftOnly?: boolean } = { allowDraftOnly: true },
) {
  if (user.role === 'admin' || user.role === 'editor') return;
  if (entity.createdBy !== user.id) {
    throw new ForbiddenException('Acesso negado: você só pode modificar seu próprio conteúdo.');
  }
  if (options.allowDraftOnly && entity.status && entity.status !== 'draft') {
    throw new ForbiddenException('Acesso negado: autores só podem alterar conteúdo em rascunho.');
  }
}
