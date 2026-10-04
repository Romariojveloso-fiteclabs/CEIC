import { UserHasPermission } from '@thallesp/nestjs-better-auth';
import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements } from 'better-auth/plugins/admin/access';

export const statements = {
  ...defaultStatements,
  content: ['read', 'create', 'update', 'publish', 'delete'],
  media: ['read', 'upload', 'delete'],
} as const;

export const accessControl = createAccessControl(statements);

export const roles = {
  admin: accessControl.newRole(statements),
  editor: accessControl.newRole({ content: statements.content, media: statements.media }),
  author: accessControl.newRole({ content: ['read', 'create', 'update'], media: ['read', 'upload'] }),
};

export const defaultRole = 'author' satisfies keyof typeof roles;
export const adminRole = 'admin' satisfies keyof typeof roles;

type ContentAction = (typeof statements.content)[number];
type MediaAction = (typeof statements.media)[number];
type Permission = `content:${ContentAction}` | `media:${MediaAction}`;

export function RequirePermission(permission: Permission) {
  const [resource, action] = permission.split(':');
  return UserHasPermission({ permissions: { [resource!]: [action!] } });
}
