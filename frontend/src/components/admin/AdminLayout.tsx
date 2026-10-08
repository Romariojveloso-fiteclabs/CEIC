import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { 
  Shield, 
  LayoutDashboard, 
  BookOpen, 
  GraduationCap, 
  Layers, 
  Users, 
  Sparkles, 
  Newspaper, 
  Handshake, 
  FileText, 
  Image as ImageIcon, 
  UserCheck, 
  Settings as SettingsIcon, 
  ScrollText, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  ChevronRight, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Globe, 
  Archive, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Clock, 
  Award, 
  ArrowLeft,
  RotateCcw,
  Copy,
  Check,
  Lock,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCms } from '../../context/CmsContext';
import { Role, ROLE_PERMISSIONS } from '../../auth/permissions';
import { StatusBadge } from './StatusBadge';
import { MediaPickerModal } from './MediaPickerModal';
import { ScheduleLineEditor } from './ScheduleLineEditor';
import { MarkdownEditor } from './MarkdownEditor';
import { 
  CmsCourseItem, 
  CmsCohort, 
  CmsDiscipline, 
  CmsPerson, 
  CmsMentorship, 
  CmsNews, 
  CmsPartner, 
  CmsPage, 
  ContentStatus,
  DisciplineOffer
} from '../../types/cms';

export type AdminView = 
  | 'dashboard'
  | 'courses'
  | 'cohorts'
  | 'disciplines'
  | 'people'
  | 'mentorships'
  | 'news'
  | 'partners'
  | 'pages'
  | 'media'
  | 'users'
  | 'settings'
  | 'audit';

interface AdminLayoutProps {
  onBackToPortal: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ onBackToPortal }) => {
  const { user, isAuthenticated, logout, quickLogin, can, updateUserRole, deleteUser, usersList, openAuthModal } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const cms = useCms();

  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Common filter & search state for list views
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ContentStatus>('all');

  // Media Picker Global Modal
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [mediaPickerCallback, setMediaPickerCallback] = useState<(url: string) => void>(() => () => {});

  // Editor states
  const [editingCourse, setEditingCourse] = useState<CmsCourseItem | null>(null);
  const [courseActiveTab, setCourseActiveTab] = useState<'info' | 'cohorts'>('info');

  const [editingCohort, setEditingCohort] = useState<CmsCohort | null>(null);
  const [editingCohortOffer, setEditingCohortOffer] = useState<DisciplineOffer | null>(null);

  const [editingDiscipline, setEditingDiscipline] = useState<CmsDiscipline | null>(null);
  const [editingPerson, setEditingPerson] = useState<CmsPerson | null>(null);
  const [editingMentorship, setEditingMentorship] = useState<CmsMentorship | null>(null);
  const [editingNews, setEditingNews] = useState<CmsNews | null>(null);
  const [editingPartner, setEditingPartner] = useState<CmsPartner | null>(null);
  const [editingPage, setEditingPage] = useState<CmsPage | null>(null);

  // Audit detail modal
  const [selectedAuditLog, setSelectedAuditLog] = useState<any | null>(null);

  // In-app delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState<{
    type: string;
    id: string;
    title: string;
    onConfirm: () => void;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const openMediaPickerFor = (callback: (url: string) => void) => {
    setMediaPickerCallback(() => callback);
    setMediaPickerOpen(true);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-[#F7F9FB] dark:bg-[#000B13] flex items-center justify-center p-4 transition-colors">
        <div className="max-w-md w-full bg-white dark:bg-[#021C2F] border border-slate-200 dark:border-[#508EBC]/40 rounded-2xl p-8 text-center text-[#26292D] dark:text-slate-200 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#508EBC]/15 dark:bg-[#508EBC]/20 border border-[#508EBC]/40 dark:border-[#508EBC]/50 flex items-center justify-center text-[#508EBC] dark:text-[#80B7DF] mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-[#508EBC] dark:text-[#80B7DF] font-bold">
            CEIC CMS · Better Auth
          </span>
          <h2 className="font-display text-2xl font-bold text-[#021C2F] dark:text-white mt-2">
            Autenticação Necessária
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            Área administrativa restrita aos papéis autorizados (Admin, Editor, Author).
          </p>

          <div className="mt-6 space-y-2">
            <button
              onClick={openAuthModal}
              className="w-full py-2.5 px-4 rounded-xl bg-[#508EBC] hover:bg-[#417fae] text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
            >
              Fazer Login Institucional
            </button>
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                onClick={() => quickLogin('admin')}
                className="px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/40 text-[11px] font-mono hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors cursor-pointer"
              >
                Acesso Rápido Admin
              </button>
              <button
                onClick={() => quickLogin('editor')}
                className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/40 text-[11px] font-mono hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
              >
                Acesso Editor
              </button>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-200 dark:border-[#0e304b] flex items-center justify-between">
            <button onClick={onBackToPortal} className="text-xs text-[#508EBC] hover:underline cursor-pointer">
              ← Voltar ao Portal Público
            </button>
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] text-slate-600 dark:text-slate-300 hover:text-[#021C2F] dark:hover:text-white transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-[#508EBC]" />}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Navigation Items according to SDD
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'main' },
    // Conteúdo
    { id: 'courses', label: 'Cursos', icon: BookOpen, group: 'content' },
    { id: 'cohorts', label: 'Turmas', icon: GraduationCap, group: 'content' },
    { id: 'disciplines', label: 'Disciplinas', icon: Layers, group: 'content' },
    { id: 'people', label: 'Pessoas', icon: Users, group: 'content' },
    { id: 'mentorships', label: 'Mentorias', icon: Sparkles, group: 'content' },
    { id: 'news', label: 'Notícias', icon: Newspaper, group: 'content' },
    { id: 'partners', label: 'Parceiros', icon: Handshake, group: 'content' },
    { id: 'pages', label: 'Páginas', icon: FileText, group: 'content' },
    // Arquivos
    { id: 'media', label: 'Mídia', icon: ImageIcon, group: 'files' },
    // Administração
    { id: 'users', label: 'Usuários', icon: UserCheck, group: 'admin' },
    { id: 'settings', label: 'Configurações', icon: SettingsIcon, group: 'admin' },
    { id: 'audit', label: 'Auditoria', icon: ScrollText, group: 'admin' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FB] dark:bg-[#000810] text-[#26292D] dark:text-slate-200 flex flex-col font-sans select-text transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 right-6 z-50 bg-white dark:bg-[#021C2F] text-[#021C2F] dark:text-white border border-[#508EBC] px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-medium animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onClose={() => setMediaPickerOpen(false)}
        onSelect={(url) => {
          mediaPickerCallback(url);
          setMediaPickerOpen(false);
          showToast('Mídia selecionada.');
        }}
      />

      {/* Global In-App Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#021C2F] border border-rose-300 dark:border-rose-500/50 rounded-2xl max-w-md w-full p-6 shadow-2xl text-[#26292D] dark:text-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-600 dark:text-rose-400 font-bold">
                  Exclusão Definitiva · {deleteTarget.type}
                </span>
                <h3 className="text-base font-bold text-[#021C2F] dark:text-white font-display">
                  Confirmar Exclusão
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Tem certeza que deseja excluir o item <span className="font-semibold text-[#021C2F] dark:text-white">«{deleteTarget.title}»</span>? Esta ação removerá o registro do sistema.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-[#0e304b]">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] text-slate-700 dark:text-slate-300 hover:text-[#021C2F] dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#041d33] text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  const run = deleteTarget.onConfirm;
                  setDeleteTarget(null);
                  run();
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir Definitivamente</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="h-14 bg-white dark:bg-[#011424] border-b border-slate-200 dark:border-[#0e304b] px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 z-30 transition-colors shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-[#021C2F] dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#000B13] lg:hidden cursor-pointer"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#508EBC]/15 dark:bg-[#508EBC]/20 border border-[#508EBC]/40 dark:border-[#508EBC]/50 flex items-center justify-center text-[#508EBC] dark:text-[#80B7DF]">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-sm text-[#021C2F] dark:text-white tracking-tight">
              CEIC <span className="text-[#508EBC] dark:text-[#80B7DF]">CMS</span>
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-slate-100 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] text-[10px] font-mono text-slate-500 dark:text-slate-400">
              v1.0-sdd
            </span>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick role test switcher */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-[#000B13] p-1 rounded-xl border border-slate-200 dark:border-[#0e304b] text-[10px] font-mono">
            <span className="text-slate-500 px-1.5 font-bold uppercase">Role:</span>
            {(['admin', 'editor', 'author'] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  quickLogin(r);
                  showToast(`Sessão alterada para ${r.toUpperCase()}.`);
                }}
                className={`px-2 py-0.5 rounded uppercase font-bold transition-colors cursor-pointer ${
                  user.role === r
                    ? r === 'admin'
                      ? 'bg-purple-600 text-white shadow-xs'
                      : r === 'editor'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#021C2F] dark:hover:text-white'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* User pill */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] text-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400" />
            <span className="font-medium text-[#021C2F] dark:text-slate-200 hidden sm:inline truncate max-w-[140px]">
              {user.name}
            </span>
            <span className="font-mono text-[10px] uppercase text-[#508EBC] dark:text-[#80B7DF] font-bold">
              [{user.role}]
            </span>
          </div>

          <button
            onClick={logout}
            className="p-1.5 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition-colors cursor-pointer"
            title="Sair do CMS"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Shell (Sidebar + Workspace) */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-14 lg:inset-auto left-0 z-20 w-64 bg-white dark:bg-[#010E1A] border-r border-slate-200 dark:border-[#0e304b] flex flex-col justify-between transform transition-transform duration-200 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-3 space-y-4 overflow-y-auto">
            {/* Group: Principal */}
            <div>
              <button
                onClick={() => {
                  setCurrentView('dashboard');
                  setSidebarOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer ${
                  currentView === 'dashboard'
                    ? 'bg-[#508EBC] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#021C2F]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            </div>

            {/* Group: Conteúdo */}
            <div>
              <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1">
                Conteúdo
              </p>
              <div className="space-y-0.5">
                {navItems.filter((i) => i.group === 'content').map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id as AdminView);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#508EBC] text-white font-semibold shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#021C2F]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group: Arquivos */}
            <div>
              <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1">
                Arquivos
              </p>
              <div className="space-y-0.5">
                {navItems.filter((i) => i.group === 'files').map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id as AdminView);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#508EBC] text-white font-semibold shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#021C2F]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group: Administração */}
            <div>
              <p className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1">
                Administração
              </p>
              <div className="space-y-0.5">
                {navItems.filter((i) => i.group === 'admin').map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentView(item.id as AdminView);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-purple-600 text-white font-semibold shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#021C2F]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Footer info */}
          <div className="p-3 border-t border-slate-200 dark:border-[#0e304b] text-[10px] font-mono text-slate-500 dark:text-slate-400 space-y-1">
            <p className="font-semibold text-slate-600 dark:text-slate-300">Monólito Modular CEIC</p>
            <p>PostgreSQL · Drizzle · Better Auth</p>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-10 bg-black/60 lg:hidden"
          />
        )}

        {/* Workspace */}
        <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-[#F7F9FB] dark:bg-[#000B13] transition-colors">

          {/* ========================================================================= */}
          {/* VIEW: DASHBOARD */}
          {/* ========================================================================= */}
          {currentView === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <h2 className="font-display font-bold text-xl text-[#021C2F] dark:text-white">Dashboard do CMS</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Visão geral do conteúdo, turmas ativas e fluxo editorial</p>
              </div>

              {/* Informações úteis e simples */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b]">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">Cursos Publicados</p>
                  <p className="text-2xl font-bold text-[#021C2F] dark:text-white mt-1">
                    {cms.courses.filter((c) => c.status === 'published').length}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">{cms.courses.length} total</p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b]">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">Turmas Ativas</p>
                  <p className="text-2xl font-bold text-blue-400 mt-1">
                    {cms.cohorts.filter((c) => c.enrollmentStatus === 'open').length}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">{cms.cohorts.length} turmas</p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b]">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">Rascunhos</p>
                  <p className="text-2xl font-bold text-amber-400 mt-1">
                    {cms.courses.filter((c) => c.status === 'draft').length +
                     cms.news.filter((n) => n.status === 'draft').length}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Aguardando pub.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b]">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">Notícias</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">
                    {cms.news.filter((n) => n.status === 'published').length}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Publicadas</p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b]">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">Arquivos Mídia</p>
                  <p className="text-2xl font-bold text-purple-400 mt-1">
                    {cms.media.length}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">No acervo</p>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b]">
                  <p className="text-[10px] font-mono text-slate-400 uppercase">Usuários</p>
                  <p className="text-2xl font-bold text-sky-400 mt-1">
                    {usersList.length}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1">Better Auth</p>
                </div>
              </div>

              {/* Turmas com inscrições abertas & Conteúdos aguardando publicação */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Turmas com Inscrições Abertas */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#021C2F] dark:text-white flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#508EBC]" />
                      <span>Turmas com Inscrições Abertas</span>
                    </h3>
                    <button
                      onClick={() => setCurrentView('cohorts')}
                      className="text-xs text-[#80B7DF] hover:underline"
                    >
                      Ver todas
                    </button>
                  </div>

                  <div className="space-y-2">
                    {cms.cohorts.filter((c) => c.enrollmentStatus === 'open').map((coh) => (
                      <div key={coh.id} className="p-3 rounded-xl bg-slate-50 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-[#021C2F] dark:text-white">{coh.name}</p>
                          <p className="text-slate-400 text-[11px] font-mono">
                            Vagas: {coh.vacancies} · Valor: {coh.price}
                          </p>
                        </div>
                        <StatusBadge status={coh.enrollmentStatus} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Conteúdos em Rascunho / Aguardando Publicação */}
                <div className="p-5 rounded-2xl bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#021C2F] dark:text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span>Conteúdos Aguardando Publicação</span>
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    {cms.courses.filter((c) => c.status === 'draft').map((c) => (
                      <div key={c.id} className="p-3 rounded-xl bg-slate-50 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] flex items-center justify-between">
                        <div>
                          <p className="font-bold text-[#021C2F] dark:text-white">{c.title}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">Curso · Autor: {c.authorName}</p>
                        </div>
                        <StatusBadge status="draft" />
                      </div>
                    ))}

                    {cms.news.filter((n) => n.status === 'draft').map((n) => (
                      <div key={n.id} className="p-3 rounded-xl bg-slate-50 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] flex items-center justify-between">
                        <div>
                          <p className="font-bold text-[#021C2F] dark:text-white">{n.title}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">Notícia · Autor: {n.authorName}</p>
                        </div>
                        <StatusBadge status="draft" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Últimas Alterações / Auditoria */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-[#021C2F] dark:text-white flex items-center gap-2">
                    <ScrollText className="w-4 h-4 text-[#508EBC]" />
                    <span>Últimas Alterações no Sistema</span>
                  </h3>
                  {user.role === 'admin' && (
                    <button
                      onClick={() => setCurrentView('audit')}
                      className="text-xs text-[#80B7DF] hover:underline"
                    >
                      Histórico Completo
                    </button>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  {cms.auditLogs.slice(0, 5).map((log) => (
                    <div key={log.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="font-mono text-[10px] text-[#80B7DF] font-bold">[{log.action}]</span>
                        <span className="text-[#021C2F] dark:text-white font-medium ml-2">{log.entityType}: {log.entityTitle}</span>
                        <p className="text-slate-500 text-[11px] truncate">{log.details}</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">{log.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: CURSOS (/admin/courses) */}
          {/* ========================================================================= */}
          {currentView === 'courses' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* If editing course */}
              {editingCourse ? (
                <div className="space-y-4">
                  {/* Top Bar Editor */}
                  <div className="p-4 bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] rounded-2xl flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setEditingCourse(null)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] text-slate-700 dark:text-slate-300 hover:text-[#021C2F] dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#021C2F] transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div>
                        <h2 className="font-bold text-base text-[#021C2F] dark:text-white">{editingCourse.title || 'Novo Curso'}</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StatusBadge status={editingCourse.status} />
                          <span className="text-xs text-slate-400 font-mono">Slug: /{editingCourse.slug}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          cms.saveCourse(editingCourse, user.email);
                          showToast('Curso salvo com sucesso.');
                          setEditingCourse(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-white text-slate-900 text-xs font-bold transition-colors"
                      >
                        Salvar Alterações
                      </button>

                      {/* Publish / Archive actions */}
                      <button
                        onClick={() => {
                          const newStatus = editingCourse.status === 'published' ? 'draft' : 'published';
                          const updated = { ...editingCourse, status: newStatus as ContentStatus };
                          cms.saveCourse(updated, user.email);
                          setEditingCourse(updated);
                          showToast(`Curso ${newStatus === 'published' ? 'publicado' : 'retornado para rascunho'}.`);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#508EBC] hover:bg-[#417fae] text-white text-xs font-bold transition-colors"
                      >
                        {editingCourse.status === 'published' ? 'Despublicar' : 'Publicar'}
                      </button>
                      <button
                        onClick={() => {
                          const newStatus = editingCourse.status === 'archived' ? 'draft' : 'archived';
                          const updated = { ...editingCourse, status: newStatus as ContentStatus };
                          cms.saveCourse(updated, user.email);
                          setEditingCourse(updated);
                          showToast(`Curso ${newStatus === 'archived' ? 'arquivado' : 'restaurado para rascunho'}.`);
                        }}
                        className="px-3 py-2 rounded-xl bg-amber-50 dark:bg-[#000B13] border border-amber-200 dark:border-[#0e304b] hover:border-amber-500/50 text-amber-700 dark:text-amber-400 text-xs font-bold transition-colors cursor-pointer"
                      >
                        {editingCourse.status === 'archived' ? 'Restaurar' : 'Arquivar'}
                      </button>

                      {/* Delete Course in Editor */}
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteTarget({
                            type: 'Curso',
                            id: editingCourse.id,
                            title: editingCourse.title,
                            onConfirm: () => {
                              cms.deleteCourse(editingCourse.id, user.email);
                              setEditingCourse(null);
                              showToast('Curso excluído com sucesso.');
                            },
                          });
                        }}
                        className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 hover:text-rose-700 dark:hover:text-white border border-rose-200 dark:border-rose-500/40 transition-colors cursor-pointer"
                        title="Excluir curso permanentemente"
                        aria-label="Excluir curso"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Tabs: [Informações] e [Turmas] */}
                  <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#0e304b] pb-1 text-xs font-semibold">
                    <button
                      onClick={() => setCourseActiveTab('info')}
                      className={`px-3 py-1.5 rounded-lg ${
                        courseActiveTab === 'info' ? 'bg-[#508EBC] text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-[#021C2F] dark:hover:text-white'
                      }`}
                    >
                      Informações
                    </button>
                    <button
                      onClick={() => setCourseActiveTab('cohorts')}
                      className={`px-3 py-1.5 rounded-lg ${
                        courseActiveTab === 'cohorts' ? 'bg-[#508EBC] text-white font-bold' : 'text-slate-600 dark:text-slate-400 hover:text-[#021C2F] dark:hover:text-white'
                      }`}
                    >
                      Turmas Associadas ({cms.cohorts.filter((coh) => coh.courseId === editingCourse.id).length})
                    </button>
                  </div>

                  {courseActiveTab === 'info' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Left: Formulário Principal (2 cols) */}
                      <div className="lg:col-span-2 space-y-4 p-5 bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] rounded-2xl text-xs">
                        <div>
                          <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Título do Curso</label>
                          <input
                            type="text"
                            value={editingCourse.title}
                            onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC] focus:outline-none focus:border-[#508EBC]"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Slug da URL</label>
                          <input
                            type="text"
                            value={editingCourse.slug}
                            onChange={(e) => setEditingCourse({ ...editingCourse, slug: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC] font-mono"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Resumo Curto (Lead)</label>
                          <textarea
                            rows={3}
                            value={editingCourse.summary}
                            onChange={(e) => setEditingCourse({ ...editingCourse, summary: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Descrição Completa</label>
                          <textarea
                            rows={6}
                            value={editingCourse.description}
                            onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                            className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                          />
                        </div>
                      </div>

                      {/* Right: Metadados, Capa e Status (1 col) */}
                      <div className="space-y-4 p-5 bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] rounded-2xl text-xs">
                        <div>
                          <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Status Editorial</label>
                          <select
                            value={editingCourse.status}
                            onChange={(e) => setEditingCourse({ ...editingCourse, status: e.target.value as ContentStatus })}
                            className="w-full p-2 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                          >
                            <option value="draft">Rascunho</option>
                            <option value="published">Publicado</option>
                            <option value="archived">Arquivado</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Imagem de Capa</label>
                          <div className="space-y-2">
                            {editingCourse.coverImage ? (
                              <div className="relative aspect-video rounded-xl overflow-hidden border border-[#0e304b]">
                                <img src={editingCourse.coverImage} alt="Capa" className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="aspect-video rounded-xl border border-dashed border-[#0e304b] flex items-center justify-center text-slate-500">
                                Sem imagem de capa
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => openMediaPickerFor((url) => setEditingCourse({ ...editingCourse, coverImage: url }))}
                              className="w-full py-2 rounded-xl bg-[#000B13] border border-[#0e304b] hover:border-[#508EBC] text-xs font-semibold text-slate-300 hover:text-white"
                            >
                              Selecionar Imagem do Acervo
                            </button>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-200 dark:border-[#0e304b] text-[11px] text-slate-400 space-y-1 font-mono">
                          <p>Autor: {editingCourse.authorName}</p>
                          <p>Criado em: {editingCourse.createdAt?.slice(0, 10)}</p>
                          <p>Atualizado em: {editingCourse.updatedAt?.slice(0, 10)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {courseActiveTab === 'cohorts' && (
                    <div className="space-y-3 p-5 bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] rounded-2xl text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-white">Turmas Vinculadas a este Curso</h3>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">Gerencie as ofertas e cronogramas sem duplicar o curso</p>
                        </div>
                        <button
                          onClick={() => {
                            const newCoh = cms.saveCohort({ courseId: editingCourse.id, name: `Turma ${new Date().getFullYear()}` });
                            setEditingCohort(newCoh);
                            setCurrentView('cohorts');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#508EBC] hover:bg-[#417fae] text-white font-bold"
                        >
                          + Criar Nova Turma
                        </button>
                      </div>

                      <div className="space-y-2 mt-3">
                        {cms.cohorts.filter((coh) => coh.courseId === editingCourse.id).map((coh) => (
                          <div key={coh.id} className="p-3 rounded-xl bg-slate-50 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] flex items-center justify-between">
                            <div>
                              <p className="font-bold text-[#021C2F] dark:text-white">{coh.name}</p>
                              <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                                Início: {coh.startDate || 'A definir'} · {coh.disciplines.length} disciplinas na grade
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <StatusBadge status={coh.enrollmentStatus} />
                              <button
                                onClick={() => {
                                  setEditingCohort(coh);
                                  setCurrentView('cohorts');
                                }}
                                className="p-2 rounded-lg bg-slate-100 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] text-[#508EBC] dark:text-[#80B7DF] hover:text-[#021C2F] dark:hover:text-white hover:border-[#508EBC] hover:bg-slate-200 dark:hover:bg-[#021C2F] transition-colors cursor-pointer"
                                title="Editar turma"
                                aria-label="Editar turma"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteTarget({
                                    type: 'Turma',
                                    id: coh.id,
                                    title: coh.name,
                                    onConfirm: () => {
                                      cms.deleteCohort(coh.id, user.email);
                                      showToast('Turma excluída com sucesso.');
                                    },
                                  });
                                }}
                                className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 dark:hover:text-white transition-colors cursor-pointer"
                                title="Excluir turma"
                                aria-label="Excluir turma"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* List View of Courses */
                <div className="space-y-4">
                  {/* Page Header */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h2 className="font-display font-bold text-xl text-[#021C2F] dark:text-white">Cursos</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Gerenciamento do catálogo principal de cursos</p>
                    </div>

                    <button
                      onClick={() => {
                        const newC = cms.saveCourse({ title: 'Novo Curso de Defesa', status: 'draft' }, user.email);
                        setEditingCourse(newC);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#508EBC] hover:bg-[#417fae] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Novo Curso</span>
                    </button>
                  </div>

                  {/* Standard Search & Filter bar */}
                  <div className="p-3 bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] rounded-2xl flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Buscar cursos..."
                        className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC] text-xs focus:outline-none focus:border-[#508EBC]"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      {(['all', 'published', 'draft', 'archived'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setStatusFilter(st)}
                          className={`px-2.5 py-1 rounded-lg capitalize text-xs transition-colors ${
                            statusFilter === st
                              ? 'bg-[#508EBC] text-white font-bold'
                              : 'text-slate-600 dark:text-slate-400 hover:text-[#021C2F] dark:hover:text-white'
                          }`}
                        >
                          {st === 'all' ? 'Todos' : st === 'published' ? 'Publicados' : st === 'draft' ? 'Rascunhos' : 'Arquivados'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Table */}
                  <div className="bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] rounded-2xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-[#000B13] text-slate-600 dark:text-slate-400 font-mono text-[10px] uppercase border-b border-slate-200 dark:border-[#0e304b]">
                        <tr>
                          <th className="py-3 px-4">Título</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Turmas</th>
                          <th className="py-3 px-4">Atualizado</th>
                          <th className="py-3 px-4 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-[#0e304b]/60">
                        {cms.courses
                          .filter((c) => statusFilter === 'all' || c.status === statusFilter)
                          .filter((c) => c.title.toLowerCase().includes(searchTerm.toLowerCase()))
                          .map((c) => {
                            const cohortsCount = cms.cohorts.filter((coh) => coh.courseId === c.id).length;
                            return (
                              <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-[#000B13]/50 transition-colors">
                                <td className="py-3 px-4">
                                  <p className="font-bold text-[#021C2F] dark:text-white">{c.title}</p>
                                  <p className="text-slate-500 font-mono text-[11px]">/{c.slug}</p>
                                </td>
                                <td className="py-3 px-4">
                                  <StatusBadge status={c.status} />
                                </td>
                                <td className="py-3 px-4 font-mono text-slate-300">
                                  {cohortsCount} {cohortsCount === 1 ? 'turma' : 'turmas'}
                                </td>
                                <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                                  {c.updatedAt ? c.updatedAt.slice(0, 10).split('-').reverse().join('/') : '-'}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      onClick={() => setEditingCourse(c)}
                                      className="p-2 rounded-lg bg-slate-100 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] hover:border-[#508EBC] text-[#508EBC] dark:text-[#80B7DF] hover:text-[#021C2F] dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#021C2F] transition-colors cursor-pointer"
                                      title="Editar curso"
                                      aria-label="Editar curso"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setDeleteTarget({
                                          type: 'Curso',
                                          id: c.id,
                                          title: c.title,
                                          onConfirm: () => {
                                            cms.deleteCourse(c.id, user.email);
                                            showToast('Curso excluído com sucesso.');
                                          },
                                        });
                                      }}
                                      className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 dark:hover:text-white transition-colors cursor-pointer"
                                      title="Excluir curso"
                                      aria-label="Excluir curso"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: TURMAS (/admin/cohorts) */}
          {/* ========================================================================= */}
          {currentView === 'cohorts' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {editingCohort ? (
                /* Cohort Form + Disciplines Offer List */
                <div className="space-y-4">
                  <div className="p-4 bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] rounded-2xl flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setEditingCohort(null)}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] text-slate-700 dark:text-slate-300 hover:text-[#021C2F] dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#021C2F] transition-colors cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div>
                        <h2 className="font-bold text-base text-[#021C2F] dark:text-white">{editingCohort.name}</h2>
                        <span className="text-xs text-slate-400">
                          Curso: {cms.courses.find((c) => c.id === editingCohort.courseId)?.title || 'Curso vinculado'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          cms.saveCohort(editingCohort, user.email);
                          showToast('Turma salva com sucesso.');
                          setEditingCohort(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#508EBC] hover:bg-[#417fae] text-white text-xs font-bold"
                      >
                        Salvar Turma
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteTarget({
                            type: 'Turma',
                            id: editingCohort.id,
                            title: editingCohort.name,
                            onConfirm: () => {
                              cms.deleteCohort(editingCohort.id, user.email);
                              setEditingCohort(null);
                              showToast('Turma excluída com sucesso.');
                            },
                          });
                        }}
                        className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 hover:text-rose-700 dark:hover:text-white border border-rose-200 dark:border-rose-500/40 transition-colors cursor-pointer"
                        title="Excluir turma permanentemente"
                        aria-label="Excluir turma"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Cohort Form Fields */}
                  <div className="p-5 bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Curso Vinculado</label>
                      <select
                        value={editingCohort.courseId}
                        onChange={(e) => setEditingCohort({ ...editingCohort, courseId: e.target.value })}
                        className="w-full p-2 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      >
                        {cms.courses.map((c) => (
                          <option key={c.id} value={c.id}>{c.title}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Nome da Turma</label>
                      <input
                        type="text"
                        value={editingCohort.name}
                        onChange={(e) => setEditingCohort({ ...editingCohort, name: e.target.value })}
                        className="w-full p-2 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Status das Inscrições</label>
                      <select
                        value={editingCohort.enrollmentStatus}
                        onChange={(e) => setEditingCohort({ ...editingCohort, enrollmentStatus: e.target.value as any })}
                        className="w-full p-2 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      >
                        <option value="open">Inscrições Abertas</option>
                        <option value="upcoming">Em Breve</option>
                        <option value="closed">Encerrada</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Data de Início</label>
                      <input
                        type="date"
                        value={editingCohort.startDate}
                        onChange={(e) => setEditingCohort({ ...editingCohort, startDate: e.target.value })}
                        className="w-full p-2 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Data de Término</label>
                      <input
                        type="date"
                        value={editingCohort.endDate}
                        onChange={(e) => setEditingCohort({ ...editingCohort, endDate: e.target.value })}
                        className="w-full p-2 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Vagas / Valor</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder="Vagas"
                          value={editingCohort.vacancies}
                          onChange={(e) => setEditingCohort({ ...editingCohort, vacancies: Number(e.target.value) })}
                          className="w-1/3 p-2 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                        />
                        <input
                          type="text"
                          placeholder="Valor"
                          value={editingCohort.price}
                          onChange={(e) => setEditingCohort({ ...editingCohort, price: e.target.value })}
                          className="w-2/3 p-2 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Seção: Disciplinas da turma */}
                  <div className="p-5 bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] rounded-2xl space-y-4 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#0e304b]">
                      <div>
                        <h3 className="font-bold text-sm text-[#021C2F] dark:text-white">Disciplinas Ofertadas Nesta Turma</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                          Configure professores e cronograma detalhado de cada disciplina
                        </p>
                      </div>

                      {/* Add discipline to cohort dropdown */}
                      <div className="flex items-center gap-2">
                        <select
                          id="selectDisciplineAdd"
                          className="p-1.5 rounded-lg bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC] text-xs"
                          defaultValue=""
                        >
                          <option value="" disabled>Selecionar disciplina para adicionar...</option>
                          {cms.disciplines.map((d) => (
                            <option key={d.id} value={d.id}>{d.name} ({d.workloadHours}h)</option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => {
                            const sel = (document.getElementById('selectDisciplineAdd') as HTMLSelectElement).value;
                            if (!sel) return;
                            const disc = cms.disciplines.find((d) => d.id === sel);
                            if (!disc) return;
                            const newOffer: DisciplineOffer = {
                              id: `off-${Date.now()}`,
                              disciplineId: disc.id,
                              credits: disc.credits,
                              workloadHours: disc.workloadHours,
                              startDate: editingCohort.startDate,
                              endDate: editingCohort.endDate,
                              professorIds: [cms.people[0]?.id || ''],
                              schedule: [],
                            };
                            cms.saveCohortDisciplineOffer(editingCohort.id, newOffer, user.email);
                            setEditingCohort({ ...editingCohort, disciplines: [...editingCohort.disciplines, newOffer] });
                            showToast(`Disciplina '${disc.name}' adicionada à turma.`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#508EBC] text-white font-bold"
                        >
                          + Adicionar à Turma
                        </button>
                      </div>
                    </div>

                    {/* Offers list */}
                    <div className="space-y-4">
                      {editingCohort.disciplines.map((off) => {
                        const disc = cms.disciplines.find((d) => d.id === off.disciplineId);
                        return (
                          <div key={off.id} className="p-4 rounded-xl bg-slate-50 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-bold text-[#021C2F] dark:text-white text-sm">{disc?.name || 'Disciplina'}</h4>
                                <p className="text-slate-400 font-mono text-[11px]">
                                  {off.workloadHours}h · {off.credits} créditos
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteTarget({
                                    type: 'Oferta de Disciplina',
                                    id: off.id,
                                    title: disc?.name || 'Disciplina',
                                    onConfirm: () => {
                                      cms.removeCohortDisciplineOffer(editingCohort.id, off.id, user.email);
                                      setEditingCohort({
                                        ...editingCohort,
                                        disciplines: editingCohort.disciplines.filter((d) => d.id !== off.id),
                                      });
                                      showToast('Disciplina removida da turma.');
                                    },
                                  });
                                }}
                                className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 dark:hover:text-white transition-colors cursor-pointer"
                                title="Remover disciplina da turma"
                                aria-label="Remover disciplina da turma"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Docente selection from People table */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                              <div>
                                <label className="block text-slate-400 text-[11px] font-semibold mb-1">Docente Responsável</label>
                                <select
                                  value={off.professorIds[0] || ''}
                                  onChange={(e) => {
                                    const updated = { ...off, professorIds: [e.target.value] };
                                    cms.saveCohortDisciplineOffer(editingCohort.id, updated, user.email);
                                    setEditingCohort({
                                      ...editingCohort,
                                      disciplines: editingCohort.disciplines.map((d) => (d.id === off.id ? updated : d)),
                                    });
                                  }}
                                  className="w-full p-2 rounded-lg bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] text-white text-xs"
                                >
                                  {cms.people.map((p) => (
                                    <option key={p.id} value={p.id}>{p.name} ({p.title})</option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-slate-400 text-[11px] font-semibold mb-1">Período de Execução</label>
                                <div className="flex gap-2">
                                  <input
                                    type="date"
                                    value={off.startDate}
                                    onChange={(e) => {
                                      const updated = { ...off, startDate: e.target.value };
                                      cms.saveCohortDisciplineOffer(editingCohort.id, updated, user.email);
                                    }}
                                    className="w-1/2 p-2 rounded-lg bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] text-white text-xs"
                                  />
                                  <input
                                    type="date"
                                    value={off.endDate}
                                    onChange={(e) => {
                                      const updated = { ...off, endDate: e.target.value };
                                      cms.saveCohortDisciplineOffer(editingCohort.id, updated, user.email);
                                    }}
                                    className="w-1/2 p-2 rounded-lg bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] text-white text-xs"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Schedule editor for this offer */}
                            <ScheduleLineEditor
                              items={off.schedule || []}
                              onChange={(newSchedule) => {
                                const updated = { ...off, schedule: newSchedule };
                                cms.saveCohortDisciplineOffer(editingCohort.id, updated, user.email);
                                setEditingCohort({
                                  ...editingCohort,
                                  disciplines: editingCohort.disciplines.map((d) => (d.id === off.id ? updated : d)),
                                });
                              }}
                              title={`Cronograma de ${disc?.name || 'Aulas'}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                /* List View of Cohorts */
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h2 className="font-display font-bold text-xl text-[#021C2F] dark:text-white">Turmas</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Turmas, ofertas de disciplinas e cronogramas</p>
                    </div>

                    <button
                      onClick={() => {
                        const newCoh = cms.saveCohort({ name: `Nova Turma ${new Date().getFullYear()}` }, user.email);
                        setEditingCohort(newCoh);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#508EBC] hover:bg-[#417fae] text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nova Turma</span>
                    </button>
                  </div>

                  <div className="bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] rounded-2xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-[#000B13] text-slate-600 dark:text-slate-400 font-mono text-[10px] uppercase border-b border-slate-200 dark:border-[#0e304b]">
                        <tr>
                          <th className="py-3 px-4">Turma</th>
                          <th className="py-3 px-4">Curso Vinculado</th>
                          <th className="py-3 px-4">Inscrições</th>
                          <th className="py-3 px-4">Disciplinas</th>
                          <th className="py-3 px-4 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-[#0e304b]/60">
                        {cms.cohorts.map((coh) => (
                          <tr key={coh.id} className="hover:bg-slate-50/80 dark:hover:bg-[#000B13]/50 transition-colors">
                            <td className="py-3 px-4">
                              <p className="font-bold text-[#021C2F] dark:text-white">{coh.name}</p>
                              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Início: {coh.startDate || 'A definir'}</p>
                            </td>
                            <td className="py-3 px-4 text-slate-300">
                              {cms.courses.find((c) => c.id === coh.courseId)?.title || 'Curso'}
                            </td>
                            <td className="py-3 px-4">
                              <StatusBadge status={coh.enrollmentStatus} />
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-300">
                              {coh.disciplines.length} ofertas
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setEditingCohort(coh)}
                                  className="p-2 rounded-lg bg-slate-100 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] text-[#508EBC] dark:text-[#80B7DF] hover:text-[#021C2F] dark:hover:text-white hover:border-[#508EBC] hover:bg-slate-200 dark:hover:bg-[#021C2F] transition-colors cursor-pointer"
                                  title="Editar turma e ofertas"
                                  aria-label="Editar turma e ofertas"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteTarget({
                                      type: 'Turma',
                                      id: coh.id,
                                      title: coh.name,
                                      onConfirm: () => {
                                        cms.deleteCohort(coh.id, user.email);
                                        showToast('Turma excluída com sucesso.');
                                      },
                                    });
                                  }}
                                  className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 dark:hover:text-white transition-colors cursor-pointer"
                                  title="Excluir turma"
                                  aria-label="Excluir turma"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: DISCIPLINAS (/admin/disciplines) */}
          {/* ========================================================================= */}
          {currentView === 'disciplines' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {editingDiscipline ? (
                <div className="space-y-4 p-5 bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] rounded-2xl text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#0e304b]">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingDiscipline(null)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] text-slate-700 dark:text-slate-300 hover:text-[#021C2F] dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#021C2F] transition-colors cursor-pointer">
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <h3 className="font-bold text-base text-[#021C2F] dark:text-white">{editingDiscipline.name}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          cms.saveDiscipline(editingDiscipline, user.email);
                          showToast('Disciplina salva com sucesso.');
                          setEditingDiscipline(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#508EBC] text-white font-bold"
                      >
                        Salvar Disciplina
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteTarget({
                            type: 'Disciplina',
                            id: editingDiscipline.id,
                            title: editingDiscipline.name,
                            onConfirm: () => {
                              cms.deleteDiscipline(editingDiscipline.id, user.email);
                              setEditingDiscipline(null);
                              showToast('Disciplina excluída com sucesso.');
                            },
                          });
                        }}
                        className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 hover:text-rose-700 dark:hover:text-white border border-rose-200 dark:border-rose-500/40 transition-colors cursor-pointer"
                        title="Excluir disciplina permanentemente"
                        aria-label="Excluir disciplina"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Nome da Disciplina</label>
                      <input
                        type="text"
                        value={editingDiscipline.name}
                        onChange={(e) => setEditingDiscipline({ ...editingDiscipline, name: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Slug</label>
                      <input
                        type="text"
                        value={editingDiscipline.slug}
                        onChange={(e) => setEditingDiscipline({ ...editingDiscipline, slug: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC] font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Créditos Padrão</label>
                      <input
                        type="number"
                        value={editingDiscipline.credits}
                        onChange={(e) => setEditingDiscipline({ ...editingDiscipline, credits: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Carga Horária Padrão (Horas)</label>
                      <input
                        type="number"
                        value={editingDiscipline.workloadHours}
                        onChange={(e) => setEditingDiscipline({ ...editingDiscipline, workloadHours: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Ementa Estruturada</label>
                    <textarea
                      rows={4}
                      value={editingDiscipline.syllabus}
                      onChange={(e) => setEditingDiscipline({ ...editingDiscipline, syllabus: e.target.value })}
                      placeholder="Descrição detalhada dos tópicos e competências..."
                      className="w-full p-3 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Bibliografia Recomendada</label>
                    <textarea
                      rows={3}
                      value={editingDiscipline.bibliography}
                      onChange={(e) => setEditingDiscipline({ ...editingDiscipline, bibliography: e.target.value })}
                      placeholder="Livros, artigos e normas técnicas..."
                      className="w-full p-3 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC] font-mono text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h2 className="font-display font-bold text-xl text-[#021C2F] dark:text-white">Disciplinas</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Catálogo de disciplinas, ementas e bibliografias</p>
                    </div>

                    <button
                      onClick={() => {
                        const newD = cms.saveDiscipline({ name: 'Nova Disciplina' }, user.email);
                        setEditingDiscipline(newD);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#508EBC] hover:bg-[#417fae] text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nova Disciplina</span>
                    </button>
                  </div>

                  <div className="bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] rounded-2xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-[#000B13] text-slate-600 dark:text-slate-400 font-mono text-[10px] uppercase border-b border-slate-200 dark:border-[#0e304b]">
                        <tr>
                          <th className="py-3 px-4">Nome da Disciplina</th>
                          <th className="py-3 px-4">Créditos</th>
                          <th className="py-3 px-4">Carga Horária</th>
                          <th className="py-3 px-4">Ementa Resumida</th>
                          <th className="py-3 px-4 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-[#0e304b]/60">
                        {cms.disciplines.map((d) => (
                          <tr key={d.id} className="hover:bg-slate-50/80 dark:hover:bg-[#000B13]/50 transition-colors">
                            <td className="py-3 px-4">
                              <p className="font-bold text-[#021C2F] dark:text-white">{d.name}</p>
                              <p className="text-slate-500 font-mono text-[11px]">/{d.slug}</p>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-300">{d.credits} cr</td>
                            <td className="py-3 px-4 font-mono text-slate-300">{d.workloadHours}h</td>
                            <td className="py-3 px-4 max-w-xs truncate text-slate-400">{d.syllabus}</td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setEditingDiscipline(d)}
                                  className="p-2 rounded-lg bg-slate-100 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] text-[#508EBC] dark:text-[#80B7DF] hover:text-[#021C2F] dark:hover:text-white hover:border-[#508EBC] hover:bg-slate-200 dark:hover:bg-[#021C2F] transition-colors cursor-pointer"
                                  title="Editar ementa"
                                  aria-label="Editar ementa"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteTarget({
                                      type: 'Disciplina',
                                      id: d.id,
                                      title: d.name,
                                      onConfirm: () => {
                                        cms.deleteDiscipline(d.id, user.email);
                                        showToast('Disciplina excluída com sucesso.');
                                      },
                                    });
                                  }}
                                  className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 dark:hover:text-white transition-colors cursor-pointer"
                                  title="Excluir disciplina"
                                  aria-label="Excluir disciplina"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: PESSOAS (/admin/people) */}
          {/* ========================================================================= */}
          {currentView === 'people' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {editingPerson ? (
                <div className="space-y-4 p-5 bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] rounded-2xl text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#0e304b]">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingPerson(null)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] text-slate-700 dark:text-slate-300 hover:text-[#021C2F] dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#021C2F] transition-colors cursor-pointer">
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <h3 className="font-bold text-base text-[#021C2F] dark:text-white">{editingPerson.name || 'Nova Pessoa'}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          cms.savePerson(editingPerson, user.email);
                          showToast('Perfil salvo com sucesso.');
                          setEditingPerson(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#508EBC] text-white font-bold"
                      >
                        Salvar Perfil
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteTarget({
                            type: 'Pessoa',
                            id: editingPerson.id,
                            title: editingPerson.name,
                            onConfirm: () => {
                              cms.deletePerson(editingPerson.id, user.email);
                              setEditingPerson(null);
                              showToast('Perfil excluído com sucesso.');
                            },
                          });
                        }}
                        className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 hover:text-rose-700 dark:hover:text-white border border-rose-200 dark:border-rose-500/40 transition-colors cursor-pointer"
                        title="Excluir perfil permanentemente"
                        aria-label="Excluir perfil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Nome Completo</label>
                      <input
                        type="text"
                        value={editingPerson.name}
                        onChange={(e) => setEditingPerson({ ...editingPerson, name: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Cargo / Título Acadêmico</label>
                      <input
                        type="text"
                        value={editingPerson.title}
                        onChange={(e) => setEditingPerson({ ...editingPerson, title: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Organização</label>
                      <input
                        type="text"
                        value={editingPerson.organization}
                        onChange={(e) => setEditingPerson({ ...editingPerson, organization: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">E-mail</label>
                      <input
                        type="email"
                        value={editingPerson.email}
                        onChange={(e) => setEditingPerson({ ...editingPerson, email: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">LinkedIn URL</label>
                      <input
                        type="url"
                        value={editingPerson.linkedinUrl}
                        onChange={(e) => setEditingPerson({ ...editingPerson, linkedinUrl: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Foto de Perfil</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={editingPerson.photoUrl}
                          onChange={(e) => setEditingPerson({ ...editingPerson, photoUrl: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                        />
                        <button
                          type="button"
                          onClick={() => openMediaPickerFor((url) => setEditingPerson({ ...editingPerson, photoUrl: url }))}
                          className="px-2.5 rounded-xl bg-[#508EBC]/20 text-[#80B7DF] shrink-0"
                        >
                          Acervo
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Biografia Acadêmica / Profissional</label>
                    <textarea
                      rows={4}
                      value={editingPerson.bio}
                      onChange={(e) => setEditingPerson({ ...editingPerson, bio: e.target.value })}
                      className="w-full p-3 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h2 className="font-display font-bold text-xl text-[#021C2F] dark:text-white">Pessoas</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Docentes, mentores, preceptores e representantes de parceiros</p>
                    </div>

                    <button
                      onClick={() => {
                        const newP = cms.savePerson({ name: 'Nova Pessoa' }, user.email);
                        setEditingPerson(newP);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#508EBC] text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Novo Perfil</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cms.people.map((p) => (
                      <div key={p.id} className="p-4 rounded-2xl bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] flex gap-3.5 items-start">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/60 shrink-0 border border-[#0e304b]">
                          {p.photoUrl ? (
                            <img src={p.photoUrl} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                              {p.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-white text-xs truncate">{p.name}</p>
                          <p className="text-[#80B7DF] text-[11px] truncate">{p.title}</p>
                          <p className="text-slate-400 text-[10px] truncate mt-0.5">{p.organization}</p>

                          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200 dark:border-[#0e304b]">
                            <span className="font-mono text-[9px] uppercase text-slate-500 truncate max-w-[120px]">{p.email || 'sem e-mail'}</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setEditingPerson(p)}
                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#000B13] text-[#508EBC] dark:text-[#80B7DF] hover:text-[#021C2F] dark:hover:text-white border border-slate-200 dark:border-[#0e304b] hover:border-[#508EBC] hover:bg-slate-200 dark:hover:bg-[#021C2F] transition-colors cursor-pointer"
                                title="Editar perfil"
                                aria-label="Editar perfil"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteTarget({
                                    type: 'Pessoa',
                                    id: p.id,
                                    title: p.name,
                                    onConfirm: () => {
                                      cms.deletePerson(p.id, user.email);
                                      showToast('Perfil excluído com sucesso.');
                                    },
                                  });
                                }}
                                className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 dark:hover:text-white transition-colors cursor-pointer"
                                title="Excluir pessoa"
                                aria-label="Excluir pessoa"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: NOTÍCIAS (/admin/news) */}
          {/* ========================================================================= */}
          {currentView === 'news' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {editingNews ? (
                <div className="space-y-4 p-5 bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] rounded-2xl text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#0e304b]">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingNews(null)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] text-slate-700 dark:text-slate-300 hover:text-[#021C2F] dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#021C2F] transition-colors cursor-pointer">
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <h3 className="font-bold text-base text-[#021C2F] dark:text-white">{editingNews.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          cms.saveNews(editingNews, user.email);
                          showToast('Notícia salva.');
                          setEditingNews(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-slate-100 text-slate-900 font-bold"
                      >
                        Salvar Rascunho
                      </button>
                      {can('content', 'publish') && (
                        <button
                          onClick={() => {
                            const newStatus = editingNews.status === 'published' ? 'draft' : 'published';
                            const updated = { ...editingNews, status: newStatus as ContentStatus };
                            cms.saveNews(updated, user.email);
                            setEditingNews(updated);
                            showToast(`Notícia ${newStatus === 'published' ? 'publicada' : 'despublicada'}.`);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#508EBC] text-white font-bold"
                        >
                          {editingNews.status === 'published' ? 'Despublicar' : 'Publicar Notícia'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteTarget({
                            type: 'Notícia',
                            id: editingNews.id,
                            title: editingNews.title,
                            onConfirm: () => {
                              cms.deleteNews(editingNews.id, user.email);
                              setEditingNews(null);
                              showToast('Notícia excluída com sucesso.');
                            },
                          });
                        }}
                        className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 hover:text-rose-700 dark:hover:text-white border border-rose-200 dark:border-rose-500/40 transition-colors cursor-pointer"
                        title="Excluir notícia permanentemente"
                        aria-label="Excluir notícia"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Título da Notícia</label>
                      <input
                        type="text"
                        value={editingNews.title}
                        onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Slug</label>
                      <input
                        type="text"
                        value={editingNews.slug}
                        onChange={(e) => setEditingNews({ ...editingNews, slug: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC] font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Resumo / Subtítulo</label>
                    <textarea
                      rows={2}
                      value={editingNews.summary}
                      onChange={(e) => setEditingNews({ ...editingNews, summary: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Conteúdo (Editor Markdown com Preview)</label>
                    <MarkdownEditor
                      value={editingNews.content}
                      onChange={(val) => setEditingNews({ ...editingNews, content: val })}
                      onOpenMediaPicker={() => openMediaPickerFor((url) => {
                        setEditingNews({ ...editingNews, content: `${editingNews.content}\n![Imagem](${url})` });
                      })}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h2 className="font-display font-bold text-xl text-[#021C2F] dark:text-white">Notícias & Comunicados</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Publicações editoriais formatadas em Markdown</p>
                    </div>

                    <button
                      onClick={() => {
                        const newN = cms.saveNews({ title: 'Novo Comunicado', content: '## Digite o texto...' }, user.email);
                        setEditingNews(newN);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#508EBC] text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nova Notícia</span>
                    </button>
                  </div>

                  <div className="bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] rounded-2xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 dark:bg-[#000B13] text-slate-600 dark:text-slate-400 font-mono text-[10px] uppercase border-b border-slate-200 dark:border-[#0e304b]">
                        <tr>
                          <th className="py-3 px-4">Título</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Publicado Em</th>
                          <th className="py-3 px-4 text-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-[#0e304b]/60">
                        {cms.news.map((n) => (
                          <tr key={n.id} className="hover:bg-slate-50/80 dark:hover:bg-[#000B13]/50 transition-colors">
                            <td className="py-3 px-4">
                              <p className="font-bold text-[#021C2F] dark:text-white">{n.title}</p>
                              <p className="text-slate-500 font-mono text-[11px]">/{n.slug}</p>
                            </td>
                            <td className="py-3 px-4">
                              <StatusBadge status={n.status} />
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-400">
                              {n.publishedAt || 'Ainda não publicado'}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setEditingNews(n)}
                                  className="p-2 rounded-lg bg-slate-100 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] text-[#508EBC] dark:text-[#80B7DF] hover:text-[#021C2F] dark:hover:text-white hover:border-[#508EBC] hover:bg-slate-200 dark:hover:bg-[#021C2F] transition-colors cursor-pointer"
                                  title="Editar notícia"
                                  aria-label="Editar notícia"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteTarget({
                                      type: 'Notícia',
                                      id: n.id,
                                      title: n.title,
                                      onConfirm: () => {
                                        cms.deleteNews(n.id, user.email);
                                        showToast('Notícia excluída com sucesso.');
                                      },
                                    });
                                  }}
                                  className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 dark:hover:text-white transition-colors cursor-pointer"
                                  title="Excluir notícia"
                                  aria-label="Excluir notícia"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: PÁGINAS (/admin/pages) */}
          {/* ========================================================================= */}
          {currentView === 'pages' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {editingPage ? (
                <div className="space-y-4 p-5 bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] rounded-2xl text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#0e304b]">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingPage(null)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] text-slate-700 dark:text-slate-300 hover:text-[#021C2F] dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#021C2F] transition-colors cursor-pointer">
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <h3 className="font-bold text-base text-[#021C2F] dark:text-white">{editingPage.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          cms.savePage(editingPage, user.email);
                          showToast('Página salva.');
                          setEditingPage(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#508EBC] text-white font-bold text-xs"
                      >
                        Salvar Página
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteTarget({
                            type: 'Página',
                            id: editingPage.id,
                            title: editingPage.title,
                            onConfirm: () => {
                              cms.deletePage(editingPage.id, user.email);
                              setEditingPage(null);
                              showToast('Página excluída com sucesso.');
                            },
                          });
                        }}
                        className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 hover:text-rose-700 dark:hover:text-white border border-rose-200 dark:border-rose-500/40 transition-colors cursor-pointer"
                        title="Excluir página"
                        aria-label="Excluir página"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Título da Página</label>
                    <input
                      type="text"
                      value={editingPage.title}
                      onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Conteúdo Markdown</label>
                    <MarkdownEditor
                      value={editingPage.content}
                      onChange={(val) => setEditingPage({ ...editingPage, content: val })}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-display font-bold text-xl text-[#021C2F] dark:text-white">Páginas Institucionais</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Sobre, FAQ, Manual do Docente, Inscrição e Contato</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cms.pages.map((p) => (
                      <div key={p.id} className="p-4 rounded-2xl bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-[#80B7DF] uppercase">Key: {p.systemKey}</span>
                          <StatusBadge status={p.status} />
                        </div>
                        <h4 className="font-bold text-[#021C2F] dark:text-white text-sm">{p.title}</h4>
                        <p className="text-slate-400 text-xs line-clamp-2">{p.summary}</p>
                        <div className="pt-2 flex justify-end items-center gap-1.5">
                          <button
                            onClick={() => setEditingPage(p)}
                            className="p-2 rounded-lg bg-[#000B13] text-[#80B7DF] hover:text-white border border-[#0e304b] hover:border-[#508EBC] hover:bg-[#021C2F] transition-colors"
                            title="Editar página"
                            aria-label="Editar página"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTarget({
                                type: 'Página',
                                id: p.id,
                                title: p.title,
                                onConfirm: () => {
                                  cms.deletePage(p.id, user.email);
                                  showToast('Página excluída com sucesso.');
                                },
                              });
                            }}
                            className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 dark:hover:text-white transition-colors cursor-pointer"
                            title="Excluir página"
                            aria-label="Excluir página"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: MENTORIAS (/admin/mentorships) */}
          {/* ========================================================================= */}
          {currentView === 'mentorships' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {editingMentorship ? (
                <div className="space-y-4 p-5 bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] rounded-2xl text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#0e304b]">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingMentorship(null)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] text-slate-700 dark:text-slate-300 hover:text-[#021C2F] dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#021C2F] transition-colors cursor-pointer">
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div>
                        <h3 className="font-bold text-base text-[#021C2F] dark:text-white">{editingMentorship.title}</h3>
                        <span className="text-slate-400 text-[11px] font-mono">{editingMentorship.duration} · {editingMentorship.workloadHours}h</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          cms.saveMentorship(editingMentorship, user.email);
                          showToast('Mentoria salva com sucesso.');
                          setEditingMentorship(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#508EBC] text-white font-bold text-xs"
                      >
                        Salvar Mentoria
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteTarget({
                            type: 'Mentoria',
                            id: editingMentorship.id,
                            title: editingMentorship.title,
                            onConfirm: () => {
                              cms.deleteMentorship(editingMentorship.id, user.email);
                              setEditingMentorship(null);
                              showToast('Mentoria excluída com sucesso.');
                            },
                          });
                        }}
                        className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 hover:text-rose-700 dark:hover:text-white border border-rose-200 dark:border-rose-500/40 transition-colors cursor-pointer"
                        title="Excluir mentoria permanentemente"
                        aria-label="Excluir mentoria"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Título da Mentoria</label>
                      <input
                        type="text"
                        value={editingMentorship.title}
                        onChange={(e) => setEditingMentorship({ ...editingMentorship, title: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Mentor Responsável</label>
                      <select
                        value={editingMentorship.mentorId}
                        onChange={(e) => setEditingMentorship({ ...editingMentorship, mentorId: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      >
                        <option value="">Selecione um mentor...</option>
                        {cms.people.map((p) => (
                          <option key={p.id} value={p.id}>{p.name} ({p.title})</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Carga Horária (h)</label>
                      <input
                        type="number"
                        value={editingMentorship.workloadHours}
                        onChange={(e) => setEditingMentorship({ ...editingMentorship, workloadHours: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Duração</label>
                      <input
                        type="text"
                        value={editingMentorship.duration}
                        onChange={(e) => setEditingMentorship({ ...editingMentorship, duration: e.target.value })}
                        placeholder="Ex: 8 semanas"
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Link do Edital</label>
                      <input
                        type="url"
                        value={editingMentorship.noticeUrl || ''}
                        onChange={(e) => setEditingMentorship({ ...editingMentorship, noticeUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Status</label>
                      <select
                        value={editingMentorship.status}
                        onChange={(e) => setEditingMentorship({ ...editingMentorship, status: e.target.value as any })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      >
                        <option value="draft">Rascunho</option>
                        <option value="published">Publicado</option>
                        <option value="archived">Arquivado</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Resumo da Mentoria</label>
                    <textarea
                      rows={2}
                      value={editingMentorship.summary}
                      onChange={(e) => setEditingMentorship({ ...editingMentorship, summary: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Descrição Detalhada & Metodologia</label>
                    <textarea
                      rows={4}
                      value={editingMentorship.description}
                      onChange={(e) => setEditingMentorship({ ...editingMentorship, description: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                    />
                  </div>

                  <ScheduleLineEditor
                    items={editingMentorship.schedule || []}
                    onChange={(newSch) => {
                      setEditingMentorship({ ...editingMentorship, schedule: newSch });
                    }}
                    title="Cronograma de Sessões da Mentoria"
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h2 className="font-display font-bold text-xl text-[#021C2F] dark:text-white">Mentorias</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Programas de mentoria técnica e executiva</p>
                    </div>
                    <button
                      onClick={() => {
                        const newM = cms.saveMentorship({ title: 'Novo Programa de Mentoria' }, user.email);
                        setEditingMentorship(newM);
                        showToast('Mentoria criada.');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#508EBC] text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nova Mentoria</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cms.mentorships.map((m) => {
                      const mentor = cms.people.find((p) => p.id === m.mentorId);
                      return (
                        <div key={m.id} className="p-5 rounded-2xl bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] space-y-3 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-[#80B7DF] text-[11px] font-bold">{m.duration} · {m.workloadHours}h</span>
                            <div className="flex items-center gap-1.5">
                              <StatusBadge status={m.status} />
                              <button
                                onClick={() => setEditingMentorship(m)}
                                className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#000B13] text-[#508EBC] dark:text-[#80B7DF] hover:text-[#021C2F] dark:hover:text-white border border-slate-200 dark:border-[#0e304b] hover:border-[#508EBC] hover:bg-slate-200 dark:hover:bg-[#021C2F] transition-colors cursor-pointer"
                                title="Editar mentoria"
                                aria-label="Editar mentoria"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setDeleteTarget({
                                    type: 'Mentoria',
                                    id: m.id,
                                    title: m.title,
                                    onConfirm: () => {
                                      cms.deleteMentorship(m.id, user.email);
                                      showToast('Mentoria excluída com sucesso.');
                                    },
                                  });
                                }}
                                className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 dark:hover:text-white transition-colors cursor-pointer"
                                title="Excluir mentoria"
                                aria-label="Excluir mentoria"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <h4 className="font-bold text-[#021C2F] dark:text-white text-sm">{m.title}</h4>
                          <p className="text-slate-500 dark:text-slate-400 text-xs">{m.summary}</p>
                          <p className="text-slate-700 dark:text-slate-300 font-medium text-[11px]">Mentor: {mentor?.name || 'A definir'}</p>

                          <ScheduleLineEditor
                            items={m.schedule || []}
                            onChange={(newSch) => {
                              cms.saveMentorship({ ...m, schedule: newSch }, user.email);
                            }}
                            title="Cronograma da Mentoria"
                          />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: PARCEIROS (/admin/partners) */}
          {/* ========================================================================= */}
          {currentView === 'partners' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {editingPartner ? (
                <div className="space-y-4 p-5 bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] rounded-2xl text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#0e304b]">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditingPartner(null)} className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] text-slate-700 dark:text-slate-300 hover:text-[#021C2F] dark:hover:text-white hover:bg-slate-200 dark:hover:bg-[#021C2F] transition-colors cursor-pointer">
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <h3 className="font-bold text-base text-[#021C2F] dark:text-white">{editingPartner.name || 'Novo Parceiro'}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          cms.savePartner(editingPartner, user.email);
                          showToast('Parceiro salvo com sucesso.');
                          setEditingPartner(null);
                        }}
                        className="px-4 py-2 rounded-xl bg-[#508EBC] text-white font-bold text-xs"
                      >
                        Salvar Parceiro
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteTarget({
                            type: 'Parceiro',
                            id: editingPartner.id,
                            title: editingPartner.name,
                            onConfirm: () => {
                              cms.deletePartner(editingPartner.id, user.email);
                              setEditingPartner(null);
                              showToast('Parceiro removido com sucesso.');
                            },
                          });
                        }}
                        className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-300 hover:text-rose-700 dark:hover:text-white border border-rose-200 dark:border-rose-500/40 transition-colors cursor-pointer"
                        title="Excluir parceiro permanentemente"
                        aria-label="Excluir parceiro"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Nome do Parceiro</label>
                      <input
                        type="text"
                        value={editingPartner.name}
                        onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Ordem de Exibição</label>
                      <input
                        type="number"
                        value={editingPartner.order}
                        onChange={(e) => setEditingPartner({ ...editingPartner, order: Number(e.target.value) })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Logo URL</label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={editingPartner.logoUrl}
                          onChange={(e) => setEditingPartner({ ...editingPartner, logoUrl: e.target.value })}
                          className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                        />
                        <button
                          type="button"
                          onClick={() => openMediaPickerFor((url) => setEditingPartner({ ...editingPartner, logoUrl: url }))}
                          className="px-2.5 rounded-xl bg-[#508EBC]/20 text-[#80B7DF] shrink-0"
                        >
                          Acervo
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Website</label>
                      <input
                        type="url"
                        value={editingPartner.websiteUrl || ''}
                        onChange={(e) => setEditingPartner({ ...editingPartner, websiteUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Representante</label>
                      <select
                        value={editingPartner.representativeId || ''}
                        onChange={(e) => setEditingPartner({ ...editingPartner, representativeId: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      >
                        <option value="">Selecione um representante...</option>
                        {cms.people.map((p) => (
                          <option key={p.id} value={p.id}>{p.name} ({p.title})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Status</label>
                      <select
                        value={editingPartner.status}
                        onChange={(e) => setEditingPartner({ ...editingPartner, status: e.target.value as any })}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                      >
                        <option value="draft">Rascunho</option>
                        <option value="published">Publicado</option>
                        <option value="archived">Arquivado</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Descrição Institucional</label>
                    <textarea
                      rows={2}
                      value={editingPartner.description}
                      onChange={(e) => setEditingPartner({ ...editingPartner, description: e.target.value })}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Depoimento da Parceria</label>
                    <textarea
                      rows={3}
                      value={editingPartner.testimonial || ''}
                      onChange={(e) => setEditingPartner({ ...editingPartner, testimonial: e.target.value })}
                      placeholder="Depoimento sobre a parceria com o CEIC..."
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <h2 className="font-display font-bold text-xl text-[#021C2F] dark:text-white">Parceiros Institucionais</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Logos, representantes e depoimentos de empresas e órgãos parceiros</p>
                    </div>
                    <button
                      onClick={() => {
                        const newP = cms.savePartner({ name: 'Novo Parceiro', order: cms.partners.length + 1 }, user.email);
                        setEditingPartner(newP);
                      }}
                      className="px-4 py-2 rounded-xl bg-[#508EBC] text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Novo Parceiro</span>
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    {cms.partners.map((prt) => (
                      <div key={prt.id} className="p-4 rounded-2xl bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="font-mono text-slate-500 font-bold shrink-0">#{prt.order}</span>
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-white p-1 shrink-0">
                            <img src={prt.logoUrl} alt={prt.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-[#021C2F] dark:text-white truncate">{prt.name}</p>
                            <p className="text-slate-400 text-[11px] truncate">{prt.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => setEditingPartner(prt)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#000B13] border border-slate-200 dark:border-[#0e304b] text-[#508EBC] dark:text-[#80B7DF] hover:text-[#021C2F] dark:hover:text-white hover:border-[#508EBC] hover:bg-slate-200 dark:hover:bg-[#021C2F] transition-colors cursor-pointer"
                            title="Editar parceiro"
                            aria-label="Editar parceiro"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTarget({
                                type: 'Parceiro',
                                id: prt.id,
                                title: prt.name,
                                onConfirm: () => {
                                  cms.deletePartner(prt.id, user.email);
                                  showToast('Parceiro removido com sucesso.');
                                },
                              });
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 dark:hover:text-white transition-colors cursor-pointer"
                            title="Excluir parceiro"
                            aria-label="Excluir parceiro"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: MÍDIA (/admin/media) */}
          {/* ========================================================================= */}
          {currentView === 'media' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="font-display font-bold text-xl text-[#021C2F] dark:text-white">Biblioteca de Mídia</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Acervo institucional de imagens, fotos de laboratório e assets</p>
                </div>
                <button
                  onClick={() => openMediaPickerFor(() => {})}
                  className="px-4 py-2 rounded-xl bg-[#508EBC] text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload de Arquivo</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
                {cms.media.map((item) => (
                  <div key={item.id} className="rounded-2xl overflow-hidden bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] flex flex-col justify-between">
                    <div>
                      <div className="aspect-video w-full bg-black/60 overflow-hidden relative group">
                        <img src={item.url} alt={item.altText} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3">
                        <p className="font-bold text-[#021C2F] dark:text-white truncate">{item.title}</p>
                        <p className="text-slate-400 text-[11px] truncate mt-0.5">{item.altText}</p>
                      </div>
                    </div>

                    <div className="p-3 pt-0 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>{item.fileSize}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(item.url);
                            showToast('URL copiada para a área de transferência.');
                          }}
                          className="text-[#80B7DF] hover:underline"
                        >
                          Copiar URL
                        </button>
                        <button
                          onClick={() => {
                            setDeleteTarget({
                              type: 'Mídia',
                              id: item.id,
                              title: item.title,
                              onConfirm: () => {
                                cms.deleteMediaItem(item.id, user.email);
                                showToast('Arquivo removido do acervo.');
                              },
                            });
                          }}
                          className="p-1 rounded-lg text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors"
                          title="Excluir mídia"
                          aria-label="Excluir mídia"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: USUÁRIOS (/admin/users) */}
          {/* ========================================================================= */}
          {currentView === 'users' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="font-display font-bold text-xl text-[#021C2F] dark:text-white">Usuários & Sessões</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Administração de contas e atribuição de papéis Better Auth</p>
                </div>
              </div>

              <div className="bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] rounded-2xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-[#000B13] text-slate-600 dark:text-slate-400 font-mono text-[10px] uppercase border-b border-slate-200 dark:border-[#0e304b]">
                    <tr>
                      <th className="py-3 px-4">Nome</th>
                      <th className="py-3 px-4">E-mail</th>
                      <th className="py-3 px-4">Role Atual</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Alterar Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#0e304b]/60">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-[#000B13]/50 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">{u.name}</td>
                        <td className="py-3 px-4 font-mono text-slate-300">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`font-mono text-[11px] font-bold uppercase ${
                            u.role === 'admin' ? 'text-purple-400' : u.role === 'editor' ? 'text-blue-400' : 'text-emerald-400'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            Ativo
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <div className="flex items-center gap-1">
                              {(['admin', 'editor', 'author'] as Role[]).map((r) => (
                                <button
                                  key={r}
                                  onClick={() => {
                                    updateUserRole(u.id, r);
                                    showToast(`Papel de ${u.name} alterado para ${r.toUpperCase()}.`);
                                  }}
                                  disabled={u.role === r}
                                  className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold transition-colors ${
                                    u.role === r
                                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                      : 'bg-slate-100 dark:bg-[#000B13] text-slate-700 dark:text-slate-300 hover:bg-[#508EBC] hover:text-white border border-slate-200 dark:border-[#0e304b]'
                                  }`}
                                >
                                  {r}
                                </button>
                              ))}
                            </div>
                            {user.role === 'admin' && (
                              <button
                                onClick={() => {
                                  setDeleteTarget({
                                    type: 'Usuário',
                                    id: u.id,
                                    title: u.name,
                                    onConfirm: () => {
                                      deleteUser(u.id);
                                      showToast('Usuário removido.');
                                    },
                                  });
                                }}
                                className="p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:text-rose-700 dark:hover:text-white transition-colors cursor-pointer"
                                title="Excluir usuário"
                                aria-label="Excluir usuário"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: CONFIGURAÇÕES (/admin/settings) */}
          {/* ========================================================================= */}
          {currentView === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-150 text-xs">
              <div>
                <h2 className="font-display font-bold text-xl text-[#021C2F] dark:text-white">Configurações do Site</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Parâmetros institucionais, Hero, Contatos e Redes Sociais</p>
              </div>

              <div className="p-6 bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] rounded-2xl space-y-4">
                <h3 className="font-bold text-sm text-[#021C2F] dark:text-white border-b border-slate-200 dark:border-[#0e304b] pb-2">Institucional</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">Nome da Marca</label>
                    <input
                      type="text"
                      value={cms.settings.institutional.brandName}
                      onChange={(e) => cms.updateSiteSettings({ institutional: { ...cms.settings.institutional, brandName: e.target.value } }, user.email)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">Portaria MEC / Homologação</label>
                    <input
                      type="text"
                      value={cms.settings.institutional.ordinance}
                      onChange={(e) => cms.updateSiteSettings({ institutional: { ...cms.settings.institutional, ordinance: e.target.value } }, user.email)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                    />
                  </div>
                </div>

                <h3 className="font-bold text-sm text-[#021C2F] dark:text-white border-b border-slate-200 dark:border-[#0e304b] pb-2 pt-4">Contato & Suporte</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">E-mail de Contato</label>
                    <input
                      type="email"
                      value={cms.settings.contact.email}
                      onChange={(e) => cms.updateSiteSettings({ contact: { ...cms.settings.contact, email: e.target.value } }, user.email)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1">Telefone</label>
                    <input
                      type="text"
                      value={cms.settings.contact.phone}
                      onChange={(e) => cms.updateSiteSettings({ contact: { ...cms.settings.contact, phone: e.target.value } }, user.email)}
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-[#021C2F] dark:text-white focus:outline-none focus:border-[#508EBC]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-[#0e304b] flex justify-between items-center">
                  <button
                    onClick={() => {
                      if (confirm('Restaurar dados de demonstração originais?')) {
                        cms.resetToDefaults();
                        showToast('Configurações e dados restaurados aos padrões originais.');
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 bg-rose-950/20 border border-rose-900/40 hover:bg-rose-950/40"
                  >
                    Restaurar Padrões Originais
                  </button>
                  <button
                    onClick={() => showToast('Configurações salvas e aplicadas.')}
                    className="px-5 py-2 rounded-xl bg-[#508EBC] text-white font-bold"
                  >
                    Salvar Configurações
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: AUDITORIA (/admin/audit) - Somente Admin */}
          {/* ========================================================================= */}
          {currentView === 'audit' && user.role === 'admin' && (
            <div className="space-y-4 animate-in fade-in duration-150 text-xs">
              <div>
                <h2 className="font-display font-bold text-xl text-[#021C2F] dark:text-white">Auditoria do Sistema</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Trilha imutável de ações, alterações e publicações</p>
              </div>

              <div className="bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-[#000B13] text-slate-600 dark:text-slate-400 font-mono text-[10px] uppercase border-b border-slate-200 dark:border-[#0e304b]">
                    <tr>
                      <th className="py-3 px-4">Data / Hora</th>
                      <th className="py-3 px-4">Usuário</th>
                      <th className="py-3 px-4">Ação</th>
                      <th className="py-3 px-4">Tipo</th>
                      <th className="py-3 px-4">Conteúdo</th>
                      <th className="py-3 px-4 text-right">Detalhe</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#0e304b]/60">
                    {cms.auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-[#000B13]/50 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">{log.date}</td>
                        <td className="py-3 px-4 font-mono text-slate-300">{log.userEmail}</td>
                        <td className="py-3 px-4">
                          <span className={`font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            log.action === 'CREATE' ? 'bg-emerald-500/15 text-emerald-400' :
                            log.action === 'PUBLISH' ? 'bg-blue-500/15 text-blue-400' :
                            log.action === 'DELETE' ? 'bg-rose-500/15 text-rose-400' :
                            'bg-slate-500/15 text-slate-300'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-white font-medium">{log.entityType}</td>
                        <td className="py-3 px-4 text-slate-300 truncate max-w-xs">{log.entityTitle}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedAuditLog(log)}
                            className="text-[#80B7DF] hover:underline font-mono text-[11px]"
                          >
                            Antes/Depois
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Audit Detail Modal */}
              {selectedAuditLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
                  <div className="max-w-lg w-full bg-white dark:bg-[#011424] border border-slate-200 dark:border-[#0e304b] rounded-2xl p-6 text-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#0e304b]">
                      <div>
                        <span className="font-mono text-[10px] text-[#80B7DF]">{selectedAuditLog.action} · {selectedAuditLog.entityType}</span>
                        <h4 className="font-bold text-base text-[#021C2F] dark:text-white">{selectedAuditLog.entityTitle}</h4>
                      </div>
                      <button onClick={() => setSelectedAuditLog(null)} className="p-1 text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-slate-300 leading-relaxed">{selectedAuditLog.details}</p>

                    <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-[#000B13] rounded-xl border border-slate-200 dark:border-[#0e304b]">
                      <div>
                        <p className="font-mono text-[10px] text-slate-500 uppercase">Estado Anterior</p>
                        <p className="text-slate-400 mt-1">{selectedAuditLog.beforeState || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] text-slate-500 uppercase">Estado Posterior</p>
                        <p className="text-emerald-400 mt-1">{selectedAuditLog.afterState || 'Atualizado'}</p>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => setSelectedAuditLog(null)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-white font-semibold"
                      >
                        Fechar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
