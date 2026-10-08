/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { WindowHeader } from './components/WindowHeader';
import { Header, PageId } from './components/Header';
import { Hero } from './components/Hero';
import { AboutProgramSection } from './components/AboutProgramSection';
import { KeyHighlights } from './components/KeyHighlights';
import { PageNavigationCards } from './components/PageNavigationCards';
import { ContactLocationSection } from './components/ContactLocationSection';
import { CurriculumSection } from './components/CurriculumSection';
import { CyberRangeSection } from './components/CyberRangeSection';
import { ProgramGallerySection } from './components/ProgramGallerySection';
import { MarkdownContentSection } from './components/MarkdownContentSection';
import { FacultySection } from './components/FacultySection';
import { CertificationSection } from './components/CertificationSection';
import { AdmissionSection } from './components/AdmissionSection';
import { FaqSection } from './components/FaqSection';
import { NoticiasMediaSection } from './components/NoticiasMediaSection';
import { ManualDocenteSection } from './components/ManualDocenteSection';
import { Footer } from './components/Footer';
import { EnrollmentModal } from './components/EnrollmentModal';
import { BrochureModal } from './components/BrochureModal';
import { Taskbar } from './components/Taskbar';
import { Desktop } from './components/Desktop';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CmsProvider } from './context/CmsContext';
import { AuthModal } from './components/AuthModal';
import { CmsSection } from './components/CmsSection';
import { ChevronLeft, Home, Sparkles, ArrowRight, FileText, Shield, Laptop, Lock } from 'lucide-react';

function PageBreadcrumb({
  title,
  subtitle,
  onBack,
  onOpenEnrollment,
  onOpenBrochure,
}: {
  title: string;
  subtitle: string;
  onBack: () => void;
  onOpenEnrollment: () => void;
  onOpenBrochure: () => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="bg-[#FFFFFF] dark:bg-[#021C2F] border-b border-[#D5D8DC] dark:border-[#0e304b] py-3.5 px-4 sm:px-6 lg:px-8 shadow-xs select-none transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#021C2F] dark:text-[#E6F1FA] hover:text-[#000B13] dark:hover:text-white bg-[#F3F3F3] dark:bg-[#001726] hover:bg-[#FFFFFF] dark:hover:bg-[#041d33] border border-[#D5D8DC] dark:border-[#0e304b] transition-colors shrink-0"
            title={t.common.backToHome}
          >
            <ChevronLeft className="w-3.5 h-3.5 text-[#508EBC]" />
            <span>{t.common.backToHome}</span>
          </button>

          <span className="text-[#D5D8DC] dark:text-[#0e304b] hidden sm:inline">|</span>

          <div>
            <h1 className="text-xs sm:text-sm font-bold text-[#021C2F] dark:text-[#E6F1FA] font-display">
              {title}
            </h1>
            <p className="text-[11px] text-[#26292D]/70 dark:text-[#80B7DF] font-mono hidden sm:block">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={onOpenBrochure}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-[#021C2F] dark:text-[#E6F1FA] hover:bg-[#F3F3F3] dark:hover:bg-[#001726] rounded transition-colors"
          >
            <FileText className="w-3 h-3 text-[#508EBC]" />
            <span className="hidden md:inline">{t.common.brochure}</span>
            <span className="md:hidden">PPC</span>
          </button>

          <button
            onClick={onOpenEnrollment}
            className="flex items-center gap-1 px-3 py-1 text-[11px] font-semibold text-white bg-[#508EBC] hover:bg-[#417fae] rounded-md transition-colors shadow-sm"
          >
            <span>{t.common.enroll}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

type WindowTarget = 'portal' | 'cms';
type InteractionMode = 'drag' | 'n' | 's' | 'w' | 'e' | 'nw' | 'ne' | 'sw' | 'se';

interface ActiveInteraction {
  target: WindowTarget;
  mode: InteractionMode;
}

const getInitialMetrics = (offset = 0) => {
  if (typeof window === 'undefined') {
    return {
      size: { width: 1100, height: 720 },
      pos: { x: 30 + offset, y: 20 + offset },
    };
  }
  const availW = window.innerWidth;
  const availH = window.innerHeight - 44; // exclude taskbar
  const width = Math.min(1150, Math.max(380, Math.round(availW * 0.88)));
  const height = Math.min(740, Math.max(360, Math.round(availH * 0.86)));
  const x = Math.max(10, Math.round((availW - width) / 2) + offset);
  const y = Math.max(10, Math.round((availH - height) / 2) + offset);
  return { size: { width, height }, pos: { x, y } };
};

function MainApp() {
  const { t } = useLanguage();
  const { isAuthModalOpen, closeAuthModal } = useAuth();
  const [activePage, setActivePage] = useState<PageId>('home');
  
  // Public Portal Window State
  const [isAppOpen, setIsAppOpen] = useState(true);
  const [isMaximized, setIsMaximized] = useState(true);
  const [windowPos, setWindowPos] = useState(() => getInitialMetrics(0).pos);
  const [windowSize, setWindowSize] = useState(() => getInitialMetrics(0).size);

  // Dedicated CMS Application Window State (Separated on Desktop and Taskbar)
  const [isCmsOpen, setIsCmsOpen] = useState(false);
  const [isCmsMaximized, setIsCmsMaximized] = useState(true);
  const [cmsPos, setCmsPos] = useState(() => getInitialMetrics(24).pos);
  const [cmsSize, setCmsSize] = useState(() => getInitialMetrics(24).size);

  // Active focused window ('portal' or 'cms')
  const [activeWindow, setActiveWindow] = useState<'portal' | 'cms'>('portal');

  const [isEnrollmentOpen, setIsEnrollmentOpen] = useState(false);
  const [isBrochureOpen, setIsBrochureOpen] = useState(false);

  const [activeInteraction, setActiveInteraction] = useState<ActiveInteraction | null>(null);

  const contentScrollRef = useRef<HTMLDivElement>(null);
  const interactionRef = useRef<{
    target: WindowTarget | null;
    mode: InteractionMode | null;
    startPointer: { x: number; y: number };
    startPos: { x: number; y: number };
    startSize: { width: number; height: number };
  }>({
    target: null,
    mode: null,
    startPointer: { x: 0, y: 0 },
    startPos: { x: 0, y: 0 },
    startSize: { width: 0, height: 0 },
  });

  // Keep windows inside view boundaries when viewport resizes
  useEffect(() => {
    const handleViewportResize = () => {
      const maxX = Math.max(0, window.innerWidth - 100);
      const maxY = Math.max(0, window.innerHeight - 44 - 36);
      const maxW = Math.max(360, window.innerWidth);
      const maxH = Math.max(260, window.innerHeight - 44);

      setWindowPos((prev) => ({
        x: Math.min(prev.x, maxX),
        y: Math.min(prev.y, maxY),
      }));
      setWindowSize((prev) => ({
        width: Math.min(prev.width, maxW),
        height: Math.min(prev.height, maxH),
      }));

      setCmsPos((prev) => ({
        x: Math.min(prev.x, maxX),
        y: Math.min(prev.y, maxY),
      }));
      setCmsSize((prev) => ({
        width: Math.min(prev.width, maxW),
        height: Math.min(prev.height, maxH),
      }));
    };

    window.addEventListener('resize', handleViewportResize);
    return () => window.removeEventListener('resize', handleViewportResize);
  }, []);

  const startInteraction = (target: WindowTarget, mode: InteractionMode, e: React.PointerEvent) => {
    setActiveWindow(target);
    const startPos = target === 'portal' ? { ...windowPos } : { ...cmsPos };
    const startSize = target === 'portal' ? { ...windowSize } : { ...cmsSize };

    interactionRef.current = {
      target,
      mode,
      startPointer: { x: e.clientX, y: e.clientY },
      startPos,
      startSize,
    };
    setActiveInteraction({ target, mode });

    const originalUserSelect = document.body.style.userSelect;
    document.body.style.userSelect = 'none';

    const onPointerMove = (ev: PointerEvent) => {
      const { target, mode, startPointer, startPos, startSize } = interactionRef.current;
      if (!mode || !target) return;

      const deltaX = ev.clientX - startPointer.x;
      const deltaY = ev.clientY - startPointer.y;

      const minW = Math.min(360, window.innerWidth - 20);
      const minH = 260;
      const maxW = window.innerWidth;
      const maxH = window.innerHeight - 44;

      const setPos = target === 'portal' ? setWindowPos : setCmsPos;
      const setSize = target === 'portal' ? setWindowSize : setCmsSize;

      if (mode === 'drag') {
        const newX = Math.max(-startSize.width + 100, Math.min(window.innerWidth - 100, startPos.x + deltaX));
        const newY = Math.max(0, Math.min(window.innerHeight - 44 - 36, startPos.y + deltaY));
        setPos({ x: newX, y: newY });
      } else {
        let newWidth = startSize.width;
        let newHeight = startSize.height;
        let newPosX = startPos.x;
        let newPosY = startPos.y;

        // East / West resizing
        if (mode === 'e' || mode === 'ne' || mode === 'se') {
          newWidth = Math.min(maxW - startPos.x, Math.max(minW, startSize.width + deltaX));
        } else if (mode === 'w' || mode === 'nw' || mode === 'sw') {
          let desiredW = startSize.width - deltaX;
          if (desiredW < minW) desiredW = minW;
          if (startPos.x + (startSize.width - desiredW) < 0) {
            desiredW = startPos.x + startSize.width;
          }
          newPosX = startPos.x + (startSize.width - desiredW);
          newWidth = desiredW;
        }

        // North / South resizing
        if (mode === 's' || mode === 'se' || mode === 'sw') {
          newHeight = Math.min(maxH - startPos.y, Math.max(minH, startSize.height + deltaY));
        } else if (mode === 'n' || mode === 'ne' || mode === 'nw') {
          let desiredH = startSize.height - deltaY;
          if (desiredH < minH) desiredH = minH;
          if (startPos.y + (startSize.height - desiredH) < 0) {
            desiredH = startPos.y + startSize.height;
          }
          newPosY = startPos.y + (startSize.height - desiredH);
          newHeight = desiredH;
        }

        setPos({ x: newPosX, y: newPosY });
        setSize({ width: newWidth, height: newHeight });
      }
    };

    const onPointerUp = () => {
      interactionRef.current.target = null;
      interactionRef.current.mode = null;
      setActiveInteraction(null);
      document.body.style.userSelect = originalUserSelect;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  };

  const handleStartDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isMaximized) return;
    startInteraction('portal', 'drag', e);
  };

  const handleStartResize = (mode: InteractionMode, e: React.PointerEvent) => {
    if (isMaximized || !mode) return;
    e.preventDefault();
    e.stopPropagation();
    startInteraction('portal', mode, e);
  };

  const handleStartDragCms = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isCmsMaximized) return;
    startInteraction('cms', 'drag', e);
  };

  const handleStartResizeCms = (mode: InteractionMode, e: React.PointerEvent) => {
    if (isCmsMaximized || !mode) return;
    e.preventDefault();
    e.stopPropagation();
    startInteraction('cms', mode, e);
  };

  // Portal window controls
  const handleOpenApp = () => {
    setIsAppOpen(true);
    setActiveWindow('portal');
  };

  const handleToggleApp = () => {
    if (!isAppOpen) {
      setIsAppOpen(true);
      setActiveWindow('portal');
    } else if (activeWindow === 'portal' && isCmsOpen) {
      setIsAppOpen(false);
      setActiveWindow('cms');
    } else if (activeWindow !== 'portal') {
      setActiveWindow('portal');
    } else {
      setIsAppOpen(false);
    }
  };

  const handleCloseApp = () => {
    setIsAppOpen(false);
  };

  const handleMinimizeApp = () => {
    setIsAppOpen(false);
    if (isCmsOpen) setActiveWindow('cms');
  };

  const handleToggleMaximize = () => {
    setIsMaximized((prev) => !prev);
  };

  // CMS window controls
  const handleOpenCms = () => {
    setIsCmsOpen(true);
    setActiveWindow('cms');
  };

  const handleToggleCms = () => {
    if (!isCmsOpen) {
      setIsCmsOpen(true);
      setActiveWindow('cms');
    } else if (activeWindow === 'cms' && isAppOpen) {
      setIsCmsOpen(false);
      setActiveWindow('portal');
    } else if (activeWindow !== 'cms') {
      setActiveWindow('cms');
    } else {
      setIsCmsOpen(false);
    }
  };

  const handleCloseCms = () => {
    setIsCmsOpen(false);
  };

  const handleMinimizeCms = () => {
    setIsCmsOpen(false);
    if (isAppOpen) setActiveWindow('portal');
  };

  const handleToggleMaximizeCms = () => {
    setIsCmsMaximized((prev) => !prev);
  };

  const handleOpenEnrollment = () => {
    setIsEnrollmentOpen(true);
  };

  const handleCloseEnrollment = () => {
    setIsEnrollmentOpen(false);
  };

  const handleOpenBrochure = () => {
    setIsBrochureOpen(true);
  };

  const handleCloseBrochure = () => {
    setIsBrochureOpen(false);
  };

  const handleNavigatePage = (page: PageId) => {
    if (page === 'cms') {
      handleOpenCms();
      return;
    }
    setIsAppOpen(true);
    setActiveWindow('portal');
    setActivePage(page);
    contentScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine cursor for interaction overlay
  const getInteractionOverlayCursor = () => {
    if (!activeInteraction) return '';
    const { mode } = activeInteraction;
    if (mode === 'drag') return 'cursor-grabbing';
    if (mode === 'n' || mode === 's') return 'cursor-ns-resize';
    if (mode === 'w' || mode === 'e') return 'cursor-ew-resize';
    if (mode === 'nw' || mode === 'se') return 'cursor-nwse-resize';
    if (mode === 'ne' || mode === 'sw') return 'cursor-nesw-resize';
    return '';
  };

  return (
    <div className="min-h-screen bg-[#000B13] text-[#26292D] dark:text-[#F7F9FB] font-sans flex flex-col selection:bg-[#508EBC]/20 selection:text-[#021C2F] dark:selection:text-[#80B7DF] transition-colors duration-200 relative pb-11 overflow-hidden">
      {/* 
        Base OS Layer: Desktop with shortcuts and wallpaper.
        Always rendered underneath so user can see it when the window is restored or minimized!
      */}
      <Desktop
        onOpenApp={handleOpenApp}
        onOpenCms={handleOpenCms}
        onOpenEnrollment={handleOpenEnrollment}
        onOpenBrochure={handleOpenBrochure}
        onNavigateSection={(section) => handleNavigatePage(section as PageId)}
      />

      {/* Global transparent overlay to protect drag/resize from iframe pointer capture */}
      {activeInteraction && (
        <div 
          className={`fixed inset-0 z-[100] ${getInteractionOverlayCursor()} select-none`} 
          style={{ touchAction: 'none' }}
        />
      )}

      {/* 
        Software Window Container: Public Portal
        - When isMaximized: covers full screen from top: 0 to bottom: 44px
        - When !isMaximized: floating window moveable and resizable across the screen
      */}
      {isAppOpen && (
        <div 
          onPointerDown={() => setActiveWindow('portal')}
          style={
            !isMaximized
              ? {
                  left: `${windowPos.x}px`,
                  top: `${windowPos.y}px`,
                  width: `${windowSize.width}px`,
                  height: `${windowSize.height}px`,
                }
              : undefined
          }
          className={`flex flex-col bg-[#F7F9FB] dark:bg-[#000B13] shadow-2xl transition-none ${
            activeWindow === 'portal' ? 'z-30' : 'z-20'
          } ${
            isMaximized
              ? 'fixed inset-x-0 top-0 bottom-11 overflow-hidden'
              : 'fixed rounded-xl border border-[#508EBC]/40 dark:border-[#0e304b] ring-1 ring-black/40'
          }`}
        >
          {/* Inner Content Wrapper: clips child elements with rounded corners */}
          <div className={`w-full h-full flex flex-col overflow-hidden ${!isMaximized ? 'rounded-xl' : ''}`}>
            {/* Software Window Titlebar with Dragging, Close, Minimize & Maximize buttons */}
            <WindowHeader
              title={t.brand.windowTitle}
              badge={`${t.brand.institution} · Lato Sensu`}
              icon={<Laptop className="w-3.5 h-3.5 text-[#80B7DF]" />}
              onMinimize={handleMinimizeApp}
              onClose={handleCloseApp}
              isMaximized={isMaximized}
              onToggleMaximize={handleToggleMaximize}
              onStartDrag={handleStartDrag}
              isDragging={activeInteraction?.target === 'portal' && activeInteraction?.mode === 'drag'}
            />

            {/* Software Scrollable Content Container */}
            <div 
              ref={contentScrollRef}
              className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col bg-[#F7F9FB] dark:bg-[#000B13] text-[#26292D] dark:text-[#F7F9FB] transition-colors min-h-0"
            >
              {/* Header / Main Portal Navigation with active page tabs */}
              <Header 
                activePage={activePage}
                onNavigatePage={handleNavigatePage}
                onOpenCms={handleOpenCms}
                onOpenEnrollment={handleOpenEnrollment} 
                onOpenBrochure={handleOpenBrochure} 
              />

            <main className="flex-1">
              {/* PAGE 1: HOME (Informativo, Sobre o Programa, Destaques, Atalhos & Geolocalização/Mapa/Contato) */}
              {activePage === 'home' && (
                <div className="animate-in fade-in duration-150">
                  <Hero 
                    onOpenEnrollment={handleOpenEnrollment}
                    onExploreCurriculum={() => handleNavigatePage('curriculo')}
                  />

                  <AboutProgramSection 
                    onExploreCurriculum={() => handleNavigatePage('curriculo')}
                    onOpenBrochure={handleOpenBrochure}
                  />

                  <KeyHighlights />

                  <PageNavigationCards 
                    onNavigatePage={(pageId) => handleNavigatePage(pageId as PageId)} 
                  />

                  <ContactLocationSection />
                </div>
              )}

              {/* PAGE 2: CURRÍCULO (Matriz Curricular de 10 Módulos) */}
              {activePage === 'curriculo' && (
                <div className="animate-in fade-in duration-150">
                  <PageBreadcrumb 
                    title={t.nav.curriculum}
                    subtitle={t.curriculum.subtitle}
                    onBack={() => handleNavigatePage('home')}
                    onOpenEnrollment={handleOpenEnrollment}
                    onOpenBrochure={handleOpenBrochure}
                  />
                  <CurriculumSection onOpenBrochure={handleOpenBrochure} />
                </div>
              )}

              {/* PAGE 3: CYBER RANGE (Laboratório & Simulação de Incidentes) */}
              {activePage === 'cyber-range' && (
                <div className="animate-in fade-in duration-150">
                  <PageBreadcrumb 
                    title={t.nav.cyberRange}
                    subtitle={t.cyberRange.subtitle}
                    onBack={() => handleNavigatePage('home')}
                    onOpenEnrollment={handleOpenEnrollment}
                    onOpenBrochure={handleOpenBrochure}
                  />
                  <CyberRangeSection />
                </div>
              )}

              {/* PAGE 4: GALERIA (Instalações, Salas SOC e Laboratórios) */}
              {activePage === 'galeria' && (
                <div className="animate-in fade-in duration-150">
                  <PageBreadcrumb 
                    title={t.nav.gallery}
                    subtitle={t.gallery.subtitle}
                    onBack={() => handleNavigatePage('home')}
                    onOpenEnrollment={handleOpenEnrollment}
                    onOpenBrochure={handleOpenBrochure}
                  />
                  <ProgramGallerySection />
                </div>
              )}

              {/* PAGE 5: ARTIGOS & PESQUISA (Cadernos Técnicos e Leitor Markdown) */}
              {activePage === 'artigos' && (
                <div className="animate-in fade-in duration-150">
                  <PageBreadcrumb 
                    title={t.nav.articles}
                    subtitle={t.articles.subtitle}
                    onBack={() => handleNavigatePage('home')}
                    onOpenEnrollment={handleOpenEnrollment}
                    onOpenBrochure={handleOpenBrochure}
                  />
                  <MarkdownContentSection />
                </div>
              )}

              {/* PAGE 6: CORPO DOCENTE (Professores e Coordenadores) */}
              {activePage === 'docentes' && (
                <div className="animate-in fade-in duration-150">
                  <PageBreadcrumb 
                    title={t.nav.faculty}
                    subtitle={t.faculty.subtitle}
                    onBack={() => handleNavigatePage('home')}
                    onOpenEnrollment={handleOpenEnrollment}
                    onOpenBrochure={handleOpenBrochure}
                  />
                  <FacultySection />
                </div>
              )}

              {/* PAGE 7: CERTIFICAÇÃO (Autenticidade e Validador) */}
              {activePage === 'certificacao' && (
                <div className="animate-in fade-in duration-150">
                  <PageBreadcrumb 
                    title={t.nav.certification}
                    subtitle={t.certification.subtitle}
                    onBack={() => handleNavigatePage('home')}
                    onOpenEnrollment={handleOpenEnrollment}
                    onOpenBrochure={handleOpenBrochure}
                  />
                  <CertificationSection />
                </div>
              )}

              {/* PAGE 8: ADMISSÃO & PROCESSO SELETIVO (Calculadora + FAQ) */}
              {activePage === 'admissao' && (
                <div className="animate-in fade-in duration-150">
                  <PageBreadcrumb 
                    title={t.nav.admission}
                    subtitle={t.admission.subtitle}
                    onBack={() => handleNavigatePage('home')}
                    onOpenEnrollment={handleOpenEnrollment}
                    onOpenBrochure={handleOpenBrochure}
                  />
                  <AdmissionSection onOpenEnrollment={handleOpenEnrollment} />
                  <FaqSection />
                </div>
              )}

              {/* PAGE 9: CONTATO & GEOLOCALIZACAO */}
              {activePage === 'contato' && (
                <div className="animate-in fade-in duration-150">
                  <PageBreadcrumb 
                    title={t.nav.contact}
                    subtitle={t.contact.subtitle}
                    onBack={() => handleNavigatePage('home')}
                    onOpenEnrollment={handleOpenEnrollment}
                    onOpenBrochure={handleOpenBrochure}
                  />
                  <ContactLocationSection />
                </div>
              )}

              {/* PAGE 10: NOTICIAS & MIDIA */}
              {activePage === 'noticias' && (
                <div className="animate-in fade-in duration-150">
                  <PageBreadcrumb 
                    title={t.nav.news}
                    subtitle="Cobertura de imprensa, reportagens e artigos de docentes"
                    onBack={() => handleNavigatePage('home')}
                    onOpenEnrollment={handleOpenEnrollment}
                    onOpenBrochure={handleOpenBrochure}
                  />
                  <NoticiasMediaSection />
                </div>
              )}

              {/* PAGE 11: MANUAL DO DOCENTE */}
              {activePage === 'manual-docente' && (
                <div className="animate-in fade-in duration-150">
                  <PageBreadcrumb 
                    title={t.nav.manualDocente}
                    subtitle="Fluxo de contratacao, instrucoes de embarque e documentos operacionais"
                    onBack={() => handleNavigatePage('home')}
                    onOpenEnrollment={handleOpenEnrollment}
                    onOpenBrochure={handleOpenBrochure}
                  />
                  <ManualDocenteSection />
                </div>
              )}

              {/* PAGE 12: FAQ */}
              {activePage === 'faq' && (
                <div className="animate-in fade-in duration-150">
                  <PageBreadcrumb 
                    title={t.nav.faq}
                    subtitle="Perguntas frequentes sobre o programa, matricula e requisitos"
                    onBack={() => handleNavigatePage('home')}
                    onOpenEnrollment={handleOpenEnrollment}
                    onOpenBrochure={handleOpenBrochure}
                  />
                  <FaqSection />
                </div>
              )}

              {/* PAGE 13: CMS (Aplicação Dedicada na Barra de Tarefas) */}
              {activePage === 'cms' && (
                <div className="py-12 px-4 max-w-xl mx-auto text-center space-y-4 animate-in fade-in duration-150">
                  <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mx-auto shadow-lg">
                    <Shield className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-[#021C2F] dark:text-white font-display">
                    CEIC CMS — Aplicação na Barra de Tarefas
                  </h2>
                  <p className="text-xs text-[#26292D]/70 dark:text-slate-300 leading-relaxed">
                    O painel de gestão administrativa agora funciona como uma aplicação independente do sistema operacional, acessível na barra de tarefas inferior e no desktop.
                  </p>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      onClick={handleOpenCms}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Trazer CMS para Primeiro Plano</span>
                    </button>
                    <button
                      onClick={() => handleNavigatePage('home')}
                      className="px-4 py-2 rounded-xl bg-[#FFFFFF] dark:bg-[#000B13] hover:bg-[#F3F3F3] dark:hover:bg-[#041d33] border border-[#D5D8DC] dark:border-[#0e304b] text-xs transition-colors cursor-pointer"
                    >
                      Voltar ao Início
                    </button>
                  </div>
                </div>
              )}
            </main>

            {/* Institutional Footer with Page Navigators */}
            <Footer 
              onNavigatePage={handleNavigatePage}
              onOpenEnrollment={handleOpenEnrollment}
              onOpenBrochure={handleOpenBrochure}
            />
          </div>
        </div>

        {/* Resize Handles (Active only when !isMaximized) */}
        {!isMaximized && (
          <>
            {/* North Edge Handle */}
            <div
              onPointerDown={(e) => handleStartResize('n', e)}
              style={{ touchAction: 'none' }}
              className="absolute -top-2 left-6 right-6 h-3.5 cursor-ns-resize z-[55] hover:bg-[#508EBC]/25 active:bg-[#508EBC]/40 transition-colors"
              title="Redimensionar superior"
            />
            {/* South Edge Handle */}
            <div
              onPointerDown={(e) => handleStartResize('s', e)}
              style={{ touchAction: 'none' }}
              className="absolute -bottom-2 left-6 right-6 h-3.5 cursor-ns-resize z-[55] hover:bg-[#508EBC]/25 active:bg-[#508EBC]/40 transition-colors"
              title="Redimensionar inferior"
            />
            {/* West Edge Handle */}
            <div
              onPointerDown={(e) => handleStartResize('w', e)}
              style={{ touchAction: 'none' }}
              className="absolute top-6 bottom-6 -left-2 w-3.5 cursor-ew-resize z-[55] hover:bg-[#508EBC]/25 active:bg-[#508EBC]/40 transition-colors"
              title="Redimensionar esquerda"
            />
            {/* East Edge Handle */}
            <div
              onPointerDown={(e) => handleStartResize('e', e)}
              style={{ touchAction: 'none' }}
              className="absolute top-6 bottom-6 -right-2 w-3.5 cursor-ew-resize z-[55] hover:bg-[#508EBC]/25 active:bg-[#508EBC]/40 transition-colors"
              title="Redimensionar direita"
            />

            {/* Corner Handles (Diagonals) - z-[60] so corners sit above WindowHeader and borders */}
            {/* Northwest Handle (Canto superior esquerdo) */}
            <div
              onPointerDown={(e) => handleStartResize('nw', e)}
              style={{ touchAction: 'none' }}
              className="absolute -top-2.5 -left-2.5 w-6 h-6 cursor-nwse-resize z-[60] rounded-tl-lg hover:bg-[#508EBC]/30 active:bg-[#508EBC]/50 transition-colors"
              title="Redimensionar canto superior esquerdo (diagonal)"
            />
            {/* Northeast Handle (Canto superior direito) */}
            <div
              onPointerDown={(e) => handleStartResize('ne', e)}
              style={{ touchAction: 'none' }}
              className="absolute -top-2.5 -right-2.5 w-6 h-6 cursor-nesw-resize z-[60] rounded-tr-lg hover:bg-[#508EBC]/30 active:bg-[#508EBC]/50 transition-colors"
              title="Redimensionar canto superior direito (diagonal)"
            />
            {/* Southwest Handle (Canto inferior esquerdo) */}
            <div
              onPointerDown={(e) => handleStartResize('sw', e)}
              style={{ touchAction: 'none' }}
              className="absolute -bottom-2.5 -left-2.5 w-6 h-6 cursor-nesw-resize z-[60] rounded-bl-lg hover:bg-[#508EBC]/30 active:bg-[#508EBC]/50 transition-colors"
              title="Redimensionar canto inferior esquerdo (diagonal)"
            />
            {/* Southeast Handle (Canto inferior direito) */}
            <div
              onPointerDown={(e) => handleStartResize('se', e)}
              style={{ touchAction: 'none' }}
              className="absolute -bottom-2.5 -right-2.5 w-7 h-7 cursor-nwse-resize z-[60] group flex items-end justify-end p-1 rounded-br-lg hover:bg-[#508EBC]/30 active:bg-[#508EBC]/50 transition-colors"
              title="Redimensionar canto inferior direito (diagonal)"
            >
              {/* Visual OS resize grip dots */}
              <div className="w-2.5 h-2.5 opacity-50 text-slate-400 group-hover:text-[#508EBC] group-hover:opacity-100 transition-all flex flex-col items-end justify-end gap-0.5 pointer-events-none">
                <div className="w-0.5 h-0.5 bg-current rounded-full" />
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-0.5 bg-current rounded-full" />
                  <div className="w-0.5 h-0.5 bg-current rounded-full" />
                </div>
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-0.5 bg-current rounded-full" />
                  <div className="w-0.5 h-0.5 bg-current rounded-full" />
                  <div className="w-0.5 h-0.5 bg-current rounded-full" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      )}

      {/* 
        Dedicated CMS Application Window
        Runs as an independent OS application that lives on the desktop and taskbar.
      */}
      {isCmsOpen && (
        <div 
          onPointerDown={() => setActiveWindow('cms')}
          style={
            !isCmsMaximized
              ? {
                  left: `${cmsPos.x}px`,
                  top: `${cmsPos.y}px`,
                  width: `${cmsSize.width}px`,
                  height: `${cmsSize.height}px`,
                }
              : undefined
          }
          className={`flex flex-col bg-[#F7F9FB] dark:bg-[#000B13] text-[#26292D] dark:text-[#F7F9FB] shadow-2xl transition-none ${
            activeWindow === 'cms' ? 'z-30' : 'z-20'
          } ${
            isCmsMaximized
              ? 'fixed inset-x-0 top-0 bottom-11 overflow-hidden'
              : 'fixed rounded-xl border border-purple-500/50 dark:border-purple-500/40 ring-1 ring-purple-900/30 dark:ring-purple-900/60'
          }`}
        >
          {/* Inner Content Wrapper */}
          <div className={`w-full h-full flex flex-col overflow-hidden ${!isCmsMaximized ? 'rounded-xl' : ''}`}>
            {/* CMS Window Titlebar */}
            <WindowHeader
              title="CEIC Cyber CMS - Painel de Gestão e Administração"
              badge="Admin · Coordenação"
              icon={<Shield className="w-3.5 h-3.5 text-purple-400" />}
              onMinimize={handleMinimizeCms}
              onClose={handleCloseCms}
              isMaximized={isCmsMaximized}
              onToggleMaximize={handleToggleMaximizeCms}
              onStartDrag={handleStartDragCms}
              isDragging={activeInteraction?.target === 'cms' && activeInteraction?.mode === 'drag'}
            />

            {/* CMS Window Body */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col bg-[#F7F9FB] dark:bg-[#000B13] min-h-0 text-[#26292D] dark:text-[#F7F9FB] transition-colors">
              <CmsSection 
                onBackToPortal={() => {
                  setIsAppOpen(true);
                  setActiveWindow('portal');
                }} 
              />
            </div>
          </div>

          {/* Resize Handles (Active only when !isCmsMaximized) */}
          {!isCmsMaximized && (
            <>
              {/* North Edge Handle */}
              <div
                onPointerDown={(e) => handleStartResizeCms('n', e)}
                style={{ touchAction: 'none' }}
                className="absolute -top-2 left-6 right-6 h-3.5 cursor-ns-resize z-[55] hover:bg-purple-500/25 active:bg-purple-500/40 transition-colors"
                title="Redimensionar superior"
              />
              {/* South Edge Handle */}
              <div
                onPointerDown={(e) => handleStartResizeCms('s', e)}
                style={{ touchAction: 'none' }}
                className="absolute -bottom-2 left-6 right-6 h-3.5 cursor-ns-resize z-[55] hover:bg-purple-500/25 active:bg-purple-500/40 transition-colors"
                title="Redimensionar inferior"
              />
              {/* West Edge Handle */}
              <div
                onPointerDown={(e) => handleStartResizeCms('w', e)}
                style={{ touchAction: 'none' }}
                className="absolute top-6 bottom-6 -left-2 w-3.5 cursor-ew-resize z-[55] hover:bg-purple-500/25 active:bg-purple-500/40 transition-colors"
                title="Redimensionar esquerda"
              />
              {/* East Edge Handle */}
              <div
                onPointerDown={(e) => handleStartResizeCms('e', e)}
                style={{ touchAction: 'none' }}
                className="absolute top-6 bottom-6 -right-2 w-3.5 cursor-ew-resize z-[55] hover:bg-purple-500/25 active:bg-purple-500/40 transition-colors"
                title="Redimensionar direita"
              />

              {/* Corner Handles (Diagonals) */}
              <div
                onPointerDown={(e) => handleStartResizeCms('nw', e)}
                style={{ touchAction: 'none' }}
                className="absolute -top-2.5 -left-2.5 w-6 h-6 cursor-nwse-resize z-[60] rounded-tl-lg hover:bg-purple-500/30 active:bg-purple-500/50 transition-colors"
                title="Redimensionar canto superior esquerdo"
              />
              <div
                onPointerDown={(e) => handleStartResizeCms('ne', e)}
                style={{ touchAction: 'none' }}
                className="absolute -top-2.5 -right-2.5 w-6 h-6 cursor-nesw-resize z-[60] rounded-tr-lg hover:bg-purple-500/30 active:bg-purple-500/50 transition-colors"
                title="Redimensionar canto superior direito"
              />
              <div
                onPointerDown={(e) => handleStartResizeCms('sw', e)}
                style={{ touchAction: 'none' }}
                className="absolute -bottom-2.5 -left-2.5 w-6 h-6 cursor-nesw-resize z-[60] rounded-bl-lg hover:bg-purple-500/30 active:bg-purple-500/50 transition-colors"
                title="Redimensionar canto inferior esquerdo"
              />
              <div
                onPointerDown={(e) => handleStartResizeCms('se', e)}
                style={{ touchAction: 'none' }}
                className="absolute -bottom-2.5 -right-2.5 w-7 h-7 cursor-nwse-resize z-[60] group flex items-end justify-end p-1 rounded-br-lg hover:bg-purple-500/30 active:bg-purple-500/50 transition-colors"
                title="Redimensionar canto inferior direito"
              >
                <div className="w-2.5 h-2.5 opacity-50 text-slate-400 group-hover:text-purple-400 group-hover:opacity-100 transition-all flex flex-col items-end justify-end gap-0.5 pointer-events-none">
                  <div className="w-0.5 h-0.5 bg-current rounded-full" />
                  <div className="flex gap-0.5">
                    <div className="w-0.5 h-0.5 bg-current rounded-full" />
                    <div className="w-0.5 h-0.5 bg-current rounded-full" />
                  </div>
                  <div className="flex gap-0.5">
                    <div className="w-0.5 h-0.5 bg-current rounded-full" />
                    <div className="w-0.5 h-0.5 bg-current rounded-full" />
                    <div className="w-0.5 h-0.5 bg-current rounded-full" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* OS Taskbar with Start Menu at the bottom */}
      <Taskbar
        isAppOpen={isAppOpen}
        onToggleApp={handleToggleApp}
        isCmsOpen={isCmsOpen}
        onToggleCms={handleToggleCms}
        activeWindow={activeWindow}
        onOpenCms={handleOpenCms}
        onOpenEnrollment={handleOpenEnrollment}
        onOpenBrochure={handleOpenBrochure}
        onNavigateSection={(section) => handleNavigatePage(section as PageId)}
      />

      {/* Interactive Modals */}
      <EnrollmentModal 
        isOpen={isEnrollmentOpen} 
        onClose={handleCloseEnrollment} 
      />

      <BrochureModal 
        isOpen={isBrochureOpen} 
        onClose={handleCloseBrochure} 
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onSuccessRedirect={() => handleNavigatePage('cms')}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CmsProvider>
            <MainApp />
          </CmsProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
