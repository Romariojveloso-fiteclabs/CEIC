export type Role = 'admin' | 'editor' | 'author';

export type Permission =
  | 'content:read'
  | 'content:create'
  | 'content:update'
  | 'content:publish'
  | 'content:delete'
  | 'media:read'
  | 'media:upload'
  | 'media:delete'
  | 'users:manage';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  author: [
    'content:read',
    'content:create',
    'content:update',
    'content:publish',
    'content:delete',
    'media:read',
    'media:upload',
    'media:delete',
  ],
  editor: [
    'content:read',
    'content:create',
    'content:update',
    'content:publish',
    'content:delete',
    'media:read',
    'media:upload',
    'media:delete',
    'users:manage',
  ],
  admin: [
    'content:read',
    'content:create',
    'content:update',
    'content:publish',
    'content:delete',
    'media:read',
    'media:upload',
    'media:delete',
    'users:manage',
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function can(role: Role, resource: 'content' | 'media' | 'users', action: string): boolean {
  const perm = `${resource}:${action}` as Permission;
  return hasPermission(role, perm);
}
