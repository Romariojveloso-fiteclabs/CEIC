import React, { useState } from 'react';
import { 
  X, 
  Shield, 
  Lock, 
  Mail, 
  ArrowRight, 
  UserCheck, 
  Key, 
  AlertCircle,
  CheckCircle2,
  Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../auth/permissions';
import { useLanguage } from '../context/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRedirect?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccessRedirect,
}) => {
  const { login, quickLogin, requestPasswordReset } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<'login' | 'forgot-password'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Por favor, informe seu e-mail cadastrado.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        await login(email, password);
        setIsLoading(false);
        onClose();
        if (onSuccessRedirect) {
          onSuccessRedirect();
        }
      } else {
        const res = await requestPasswordReset(email);
        setIsLoading(false);
        setResetFeedback(res.message);
      }
    } catch {
      setError('Falha na autenticação. Verifique as credenciais ou utilize os atalhos de teste.');
      setIsLoading(false);
    }
  };

  const handleRoleQuickLogin = (role: Role) => {
    quickLogin(role);
    onClose();
    if (onSuccessRedirect) {
      onSuccessRedirect();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="max-w-md w-full rounded-2xl bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#508EBC]/40 shadow-2xl p-6 sm:p-7 relative text-[#26292D] dark:text-slate-200 overflow-hidden transition-all">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-[#021C2F] dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#001726] transition-colors"
          aria-label={t.common.close}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-[#508EBC]/15 border border-[#508EBC]/40 flex items-center justify-center text-[#508EBC] dark:text-[#80B7DF] shadow-xs shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#508EBC]/20 text-[#508EBC] dark:text-[#80B7DF] font-bold">
                Better Auth · RBAC
              </span>
            </div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-[#021C2F] dark:text-white mt-0.5">
              {mode === 'login' ? 'Painel CMS CEIC' : 'Recuperação de Senha'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {mode === 'login' ? 'Autenticação baseada em funções (admin, editor, author)' : 'Envio de token seguro através do Resend'}
            </p>
          </div>
        </div>

        {mode === 'login' && (
          <div className="mb-5 p-3.5 rounded-xl bg-slate-50 dark:bg-[#000B13]/60 border border-slate-200 dark:border-[#0e304b]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-[#021C2F] dark:text-slate-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#508EBC] dark:text-[#80B7DF]" />
                Atalhos Rápidos de Avaliação (1 Clique)
              </span>
              <span className="text-[10px] font-mono text-emerald-500 font-bold">
                RBAC SDD
              </span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
              <button
                type="button"
                onClick={() => handleRoleQuickLogin('admin')}
                className="text-left p-2 rounded-lg bg-white dark:bg-[#021C2F] hover:bg-slate-100 dark:hover:bg-[#05263d] border border-slate-200 dark:border-[#508EBC]/30 hover:border-purple-500 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400">
                    Admin
                  </span>
                  <ArrowRight className="w-3 h-3 text-purple-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[9px] text-slate-500 truncate mt-0.5">
                  Acesso Total
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickLogin('editor')}
                className="text-left p-2 rounded-lg bg-white dark:bg-[#021C2F] hover:bg-slate-100 dark:hover:bg-[#05263d] border border-slate-200 dark:border-[#508EBC]/30 hover:border-blue-500 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    Editor
                  </span>
                  <ArrowRight className="w-3 h-3 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[9px] text-slate-500 truncate mt-0.5">
                  Publica & Deleta
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickLogin('author')}
                className="text-left p-2 rounded-lg bg-white dark:bg-[#021C2F] hover:bg-slate-100 dark:hover:bg-[#05263d] border border-slate-200 dark:border-[#508EBC]/30 hover:border-emerald-500 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    Author
                  </span>
                  <ArrowRight className="w-3 h-3 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[9px] text-slate-500 truncate mt-0.5">
                  Cria & Rascunhos
                </p>
              </button>
            </div>
          </div>
        )}

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-[#0e304b]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-mono">
            <span className="bg-[#FFFFFF] dark:bg-[#021C2F] px-2 text-slate-400">
              {mode === 'login' ? 'Ou credenciais da conta' : 'Resend Email Service'}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {resetFeedback && (
          <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{resetFeedback}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-[#021C2F] dark:text-slate-300 mb-1">
              E-mail do Usuário
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ex: admin@ceic.tec.br"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-xs text-[#021C2F] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#508EBC]"
              />
            </div>
          </div>

          {mode === 'login' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#021C2F] dark:text-slate-300">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('forgot-password');
                    setError(null);
                    setResetFeedback(null);
                  }}
                  className="text-[11px] text-[#508EBC] dark:text-[#80B7DF] hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-xs text-[#021C2F] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#508EBC]"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg bg-[#508EBC] hover:bg-[#417fae] active:bg-[#346c96] text-white text-xs font-bold transition-all shadow-md shadow-[#508EBC]/20 flex items-center justify-center gap-2 mt-4"
          >
            {isLoading ? (
              <span>Processando requisição...</span>
            ) : mode === 'login' ? (
              <>
                <UserCheck className="w-4 h-4" />
                <span>Entrar no Painel CMS</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Enviar E-mail de Recuperação</span>
              </>
            )}
          </button>
        </form>

        {mode === 'forgot-password' && (
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setResetFeedback(null);
              }}
              className="text-xs text-[#508EBC] dark:text-[#80B7DF] hover:underline"
            >
              ← Voltar para o Login
            </button>
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-slate-200 dark:border-[#0e304b] flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#508EBC]" />
            Better Auth · Drizzle ORM
          </span>
          <span>CEIC Security</span>
        </div>
      </div>
    </div>
  );
};
