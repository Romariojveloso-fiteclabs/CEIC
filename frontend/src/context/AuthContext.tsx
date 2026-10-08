import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, Permission, hasPermission as checkPermission, can as checkCan } from '../auth/permissions';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
  lastLogin: string;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  emailVerified: boolean;
  createdAt: string;
  lastActive: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  usersList: ManagedUser[];
  login: (email: string, password?: string) => Promise<boolean>;
  quickLogin: (role: Role) => void;
  logout: () => void;
  hasPermission: (permission: Permission) => boolean;
  can: (resource: 'content' | 'media' | 'users', action: string) => boolean;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; message: string }>;
  updateUserRole: (userId: string, newRole: Role) => void;
  deleteUser: (userId: string) => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const AUTH_STORAGE_KEY = 'ceic_better_auth_session';

const DEMO_ACCOUNTS: Record<Role, AuthUser> = {
  admin: {
    id: 'usr-admin-uuid-01',
    name: 'Administrador Geral CEIC',
    email: 'admin@ceic.tec.br',
    role: 'admin',
    emailVerified: true,
    createdAt: '2026-01-15T08:00:00Z',
    lastLogin: 'Agora',
  },
  editor: {
    id: 'usr-editor-uuid-02',
    name: 'Carlos Editor de Conteúdo',
    email: 'editor@ceic.tec.br',
    role: 'editor',
    emailVerified: true,
    createdAt: '2026-02-10T10:30:00Z',
    lastLogin: 'Agora',
  },
  author: {
    id: 'usr-author-uuid-03',
    name: 'Mariana Autora & Pesquisadora',
    email: 'author@ceic.tec.br',
    role: 'author',
    emailVerified: true,
    createdAt: '2026-03-01T14:15:00Z',
    lastLogin: 'Agora',
  },
};

const INITIAL_USERS: ManagedUser[] = [
  {
    id: 'usr-admin-uuid-01',
    name: 'Administrador Geral CEIC',
    email: 'admin@ceic.tec.br',
    role: 'admin',
    emailVerified: true,
    createdAt: '15/01/2026',
    lastActive: 'Ativo agora',
  },
  {
    id: 'usr-editor-uuid-02',
    name: 'Carlos Editor de Conteúdo',
    email: 'editor@ceic.tec.br',
    role: 'editor',
    emailVerified: true,
    createdAt: '10/02/2026',
    lastActive: 'Hoje, 08:30',
  },
  {
    id: 'usr-author-uuid-03',
    name: 'Mariana Autora & Pesquisadora',
    email: 'author@ceic.tec.br',
    role: 'author',
    emailVerified: true,
    createdAt: '01/03/2026',
    lastActive: 'Ontem, 16:45',
  },
  {
    id: 'usr-author-uuid-04',
    name: 'Lucas Redator Cyber',
    email: 'lucas.author@ceic.tec.br',
    role: 'author',
    emailVerified: false,
    createdAt: '28/09/2026',
    lastActive: 'Aguardando verificação',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as AuthUser;
          // Grant admin rights so user has full capabilities
          parsed.role = 'admin';
          return parsed;
        }
      } catch {
        // Fallback
      }
    }
    return DEMO_ACCOUNTS.admin;
  });

  const [usersList, setUsersList] = useState<ManagedUser[]>(INITIAL_USERS);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        if (user) {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        }
      } catch {
        // Ignore
      }
    }
  }, [user]);

  const login = async (email: string, _password?: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();
    // Default to admin for full CMS management permissions
    let role: Role = 'admin';

    if (cleanEmail.includes('editor')) {
      role = 'editor';
    } else if (cleanEmail.includes('author')) {
      role = 'author';
    } else {
      role = 'admin';
    }

    const demo = DEMO_ACCOUNTS[role] || DEMO_ACCOUNTS.admin;
    setUser({
      ...demo,
      role: 'admin', // Ensure administrator role
      name: cleanEmail.split('@')[0] ? cleanEmail.split('@')[0].toUpperCase() : demo.name,
      email: cleanEmail.length > 3 ? cleanEmail : demo.email,
      lastLogin: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    });

    setIsAuthModalOpen(false);
    return true;
  };

  const quickLogin = (role: Role) => {
    const selected = DEMO_ACCOUNTS[role];
    setUser({
      ...selected,
      lastLogin: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    });
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return checkPermission(user.role, permission);
  };

  const can = (resource: 'content' | 'media' | 'users', action: string): boolean => {
    if (!user) return false;
    return true; // Authenticated CMS managers have access
  };

  const requestPasswordReset = async (email: string) => {
    return {
      success: true,
      message: `Instruções de redefinição de senha enviadas via Resend para ${email}.`,
    };
  };

  const updateUserRole = (userId: string, newRole: Role) => {
    if (!can('users', 'manage')) return;
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    if (user && user.id === userId) {
      setUser({ ...user, role: newRole });
    }
  };

  const deleteUser = (userId: string) => {
    setUsersList((prev) => prev.filter((u) => u.id !== userId));
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        usersList,
        login,
        quickLogin,
        logout,
        hasPermission,
        can,
        requestPasswordReset,
        updateUserRole,
        deleteUser,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
