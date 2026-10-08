import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  CmsCourseItem, 
  CmsCohort, 
  CmsDiscipline, 
  CmsPerson, 
  CmsMentorship, 
  CmsNews, 
  CmsPartner, 
  CmsPage, 
  CmsMediaItem, 
  SiteSettings, 
  AuditLog,
  ContentStatus,
  DisciplineOffer
} from '../types/cms';
import { 
  initialCmsCourses, 
  initialCmsCohorts, 
  initialCmsDisciplines, 
  initialCmsPeople, 
  initialCmsMentorships, 
  initialCmsNews, 
  initialCmsPartners, 
  initialCmsPages, 
  initialCmsMedia, 
  initialSiteSettings, 
  initialAuditLogs 
} from '../data/initialCmsData';

export type EnrollmentStatus = 'pendente' | 'aprovado' | 'matriculado' | 'indeferido';

export interface CandidateEnrollment {
  id: string;
  name: string;
  email: string;
  phone: string;
  graduationArea: string;
  experienceYears: string;
  lattesLinkedin?: string;
  status: EnrollmentStatus;
  submissionDate: string;
  notes?: string;
}

interface CmsContextType {
  // Collections
  courses: CmsCourseItem[];
  cohorts: CmsCohort[];
  disciplines: CmsDiscipline[];
  people: CmsPerson[];
  mentorships: CmsMentorship[];
  news: CmsNews[];
  partners: CmsPartner[];
  pages: CmsPage[];
  media: CmsMediaItem[];
  settings: SiteSettings;
  auditLogs: AuditLog[];
  enrollments: CandidateEnrollment[];

  // Courses
  saveCourse: (course: Partial<CmsCourseItem>, userEmail?: string) => CmsCourseItem;
  setCourseStatus: (id: string, status: ContentStatus, userEmail?: string) => void;
  deleteCourse: (id: string, userEmail?: string) => void;

  // Cohorts
  saveCohort: (cohort: Partial<CmsCohort>, userEmail?: string) => CmsCohort;
  setCohortStatus: (id: string, status: ContentStatus, userEmail?: string) => void;
  deleteCohort: (id: string, userEmail?: string) => void;
  saveCohortDisciplineOffer: (cohortId: string, offer: DisciplineOffer, userEmail?: string) => void;
  removeCohortDisciplineOffer: (cohortId: string, offerId: string, userEmail?: string) => void;

  // Disciplines
  saveDiscipline: (discipline: Partial<CmsDiscipline>, userEmail?: string) => CmsDiscipline;
  setDisciplineStatus: (id: string, status: ContentStatus, userEmail?: string) => void;
  deleteDiscipline: (id: string, userEmail?: string) => void;

  // People
  savePerson: (person: Partial<CmsPerson>, userEmail?: string) => CmsPerson;
  deletePerson: (id: string, userEmail?: string) => void;

  // Mentorships
  saveMentorship: (mentorship: Partial<CmsMentorship>, userEmail?: string) => CmsMentorship;
  setMentorshipStatus: (id: string, status: ContentStatus, userEmail?: string) => void;
  deleteMentorship: (id: string, userEmail?: string) => void;

  // News
  saveNews: (item: Partial<CmsNews>, userEmail?: string) => CmsNews;
  setNewsStatus: (id: string, status: ContentStatus, userEmail?: string) => void;
  deleteNews: (id: string, userEmail?: string) => void;

  // Partners
  savePartner: (partner: Partial<CmsPartner>, userEmail?: string) => CmsPartner;
  deletePartner: (id: string, userEmail?: string) => void;
  reorderPartners: (partnerIds: string[]) => void;

  // Pages
  savePage: (page: Partial<CmsPage>, userEmail?: string) => CmsPage;
  setPageStatus: (id: string, status: ContentStatus, userEmail?: string) => void;
  deletePage: (id: string, userEmail?: string) => void;

  // Media
  uploadMediaItem: (item: Omit<CmsMediaItem, 'id' | 'uploadedAt'>, userEmail?: string) => CmsMediaItem;
  updateMediaAltText: (id: string, altText: string) => void;
  deleteMediaItem: (id: string, userEmail?: string) => void;

  // Settings
  updateSiteSettings: (newSettings: Partial<SiteSettings>, userEmail?: string) => void;

  // Enrollments
  addEnrollment: (data: Omit<CandidateEnrollment, 'id' | 'status' | 'submissionDate'>) => void;
  updateEnrollmentStatus: (id: string, status: EnrollmentStatus) => void;
  deleteEnrollment: (id: string) => void;
  exportEnrollmentsCSV: () => void;

  // General
  resetToDefaults: () => void;
}

const STORAGE_KEY = 'ceic_sdd_cms_store_v1';

function generateId(prefix = 'item'): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

const CmsContext = createContext<CmsContextType | undefined>(undefined);

export const CmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<CmsCourseItem[]>(() => {
    try {
      const s = localStorage.getItem(`${STORAGE_KEY}_courses`);
      return s ? JSON.parse(s) : initialCmsCourses;
    } catch {
      return initialCmsCourses;
    }
  });

  const [cohorts, setCohorts] = useState<CmsCohort[]>(() => {
    try {
      const s = localStorage.getItem(`${STORAGE_KEY}_cohorts`);
      return s ? JSON.parse(s) : initialCmsCohorts;
    } catch {
      return initialCmsCohorts;
    }
  });

  const [disciplines, setDisciplines] = useState<CmsDiscipline[]>(() => {
    try {
      const s = localStorage.getItem(`${STORAGE_KEY}_disciplines`);
      return s ? JSON.parse(s) : initialCmsDisciplines;
    } catch {
      return initialCmsDisciplines;
    }
  });

  const [people, setPeople] = useState<CmsPerson[]>(() => {
    try {
      const s = localStorage.getItem(`${STORAGE_KEY}_people`);
      return s ? JSON.parse(s) : initialCmsPeople;
    } catch {
      return initialCmsPeople;
    }
  });

  const [mentorships, setMentorships] = useState<CmsMentorship[]>(() => {
    try {
      const s = localStorage.getItem(`${STORAGE_KEY}_mentorships`);
      return s ? JSON.parse(s) : initialCmsMentorships;
    } catch {
      return initialCmsMentorships;
    }
  });

  const [news, setNews] = useState<CmsNews[]>(() => {
    try {
      const s = localStorage.getItem(`${STORAGE_KEY}_news`);
      return s ? JSON.parse(s) : initialCmsNews;
    } catch {
      return initialCmsNews;
    }
  });

  const [partners, setPartners] = useState<CmsPartner[]>(() => {
    try {
      const s = localStorage.getItem(`${STORAGE_KEY}_partners`);
      return s ? JSON.parse(s) : initialCmsPartners;
    } catch {
      return initialCmsPartners;
    }
  });

  const [pages, setPages] = useState<CmsPage[]>(() => {
    try {
      const s = localStorage.getItem(`${STORAGE_KEY}_pages`);
      return s ? JSON.parse(s) : initialCmsPages;
    } catch {
      return initialCmsPages;
    }
  });

  const [media, setMedia] = useState<CmsMediaItem[]>(() => {
    try {
      const s = localStorage.getItem(`${STORAGE_KEY}_media`);
      return s ? JSON.parse(s) : initialCmsMedia;
    } catch {
      return initialCmsMedia;
    }
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const s = localStorage.getItem(`${STORAGE_KEY}_settings`);
      return s ? JSON.parse(s) : initialSiteSettings;
    } catch {
      return initialSiteSettings;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const s = localStorage.getItem(`${STORAGE_KEY}_audit`);
      return s ? JSON.parse(s) : initialAuditLogs;
    } catch {
      return initialAuditLogs;
    }
  });

  const [enrollments, setEnrollments] = useState<CandidateEnrollment[]>(() => {
    try {
      const s = localStorage.getItem(`${STORAGE_KEY}_enrollments`);
      return s ? JSON.parse(s) : [];
    } catch {
      return [];
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_courses`, JSON.stringify(courses));
      localStorage.setItem(`${STORAGE_KEY}_cohorts`, JSON.stringify(cohorts));
      localStorage.setItem(`${STORAGE_KEY}_disciplines`, JSON.stringify(disciplines));
      localStorage.setItem(`${STORAGE_KEY}_people`, JSON.stringify(people));
      localStorage.setItem(`${STORAGE_KEY}_mentorships`, JSON.stringify(mentorships));
      localStorage.setItem(`${STORAGE_KEY}_news`, JSON.stringify(news));
      localStorage.setItem(`${STORAGE_KEY}_partners`, JSON.stringify(partners));
      localStorage.setItem(`${STORAGE_KEY}_pages`, JSON.stringify(pages));
      localStorage.setItem(`${STORAGE_KEY}_media`, JSON.stringify(media));
      localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
      localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
      localStorage.setItem(`${STORAGE_KEY}_enrollments`, JSON.stringify(enrollments));
    } catch {
      // Ignore quota
    }
  }, [courses, cohorts, disciplines, people, mentorships, news, partners, pages, media, settings, auditLogs, enrollments]);

  const addAuditLog = (
    action: AuditLog['action'], 
    entityType: AuditLog['entityType'], 
    entityTitle: string, 
    details: string,
    userEmail = 'admin@ceic.tec.br',
    beforeState?: string,
    afterState?: string
  ) => {
    const newLog: AuditLog = {
      id: generateId('aud'),
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      userEmail,
      action,
      entityType,
      entityTitle,
      details,
      beforeState,
      afterState,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // --- Courses ---
  const saveCourse = (courseData: Partial<CmsCourseItem>, userEmail?: string) => {
    const isNew = !courseData.id;
    const now = new Date().toISOString();
    let saved: CmsCourseItem;

    if (isNew) {
      saved = {
        id: generateId('crs'),
        title: courseData.title || 'Novo Curso',
        slug: courseData.slug || 'novo-curso',
        summary: courseData.summary || '',
        description: courseData.description || '',
        coverImage: courseData.coverImage || '',
        status: courseData.status || 'draft',
        authorId: 'usr-author',
        authorName: userEmail || 'Equipe Editorial',
        createdAt: now,
        updatedAt: now,
      };
      setCourses((prev) => [saved, ...prev]);
      addAuditLog('CREATE', 'Curso', saved.title, 'Curso criado no sistema.', userEmail);
    } else {
      saved = {
        ...courses.find((c) => c.id === courseData.id)!,
        ...courseData,
        updatedAt: now,
      };
      setCourses((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
      addAuditLog('UPDATE', 'Curso', saved.title, 'Dados do curso atualizados.', userEmail);
    }
    return saved;
  };

  const setCourseStatus = (id: string, status: ContentStatus, userEmail?: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const action = status === 'published' ? 'PUBLISH' : status === 'archived' ? 'ARCHIVE' : 'UPDATE';
        addAuditLog(action, 'Curso', c.title, `Status alterado para ${status}.`, userEmail, `Status: ${c.status}`, `Status: ${status}`);
        return { ...c, status, updatedAt: new Date().toISOString() };
      })
    );
  };

  const deleteCourse = (id: string, userEmail?: string) => {
    const course = courses.find((c) => c.id === id);
    if (course) {
      addAuditLog('DELETE', 'Curso', course.title, 'Curso excluído do catálogo.', userEmail);
    }
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  // --- Cohorts ---
  const saveCohort = (cohortData: Partial<CmsCohort>, userEmail?: string) => {
    const isNew = !cohortData.id;
    const now = new Date().toISOString();
    let saved: CmsCohort;

    if (isNew) {
      saved = {
        id: generateId('coh'),
        courseId: cohortData.courseId || (courses[0]?.id || ''),
        name: cohortData.name || 'Nova Turma',
        startDate: cohortData.startDate || '',
        endDate: cohortData.endDate || '',
        enrollmentStart: cohortData.enrollmentStart || '',
        enrollmentEnd: cohortData.enrollmentEnd || '',
        enrollmentStatus: cohortData.enrollmentStatus || 'upcoming',
        classHours: cohortData.classHours || 360,
        practicalHours: cohortData.practicalHours || 120,
        vacancies: cohortData.vacancies || 40,
        price: cohortData.price || '18x de R$ 750,00',
        enrollmentUrl: cohortData.enrollmentUrl || '',
        noticeUrl: cohortData.noticeUrl || '',
        status: cohortData.status || 'draft',
        disciplines: cohortData.disciplines || [],
        createdAt: now,
        updatedAt: now,
      };
      setCohorts((prev) => [saved, ...prev]);
      addAuditLog('CREATE', 'Turma', saved.name, 'Turma registrada para o curso.', userEmail);
    } else {
      saved = {
        ...cohorts.find((c) => c.id === cohortData.id)!,
        ...cohortData,
        updatedAt: now,
      };
      setCohorts((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
      addAuditLog('UPDATE', 'Turma', saved.name, 'Dados da turma atualizados.', userEmail);
    }
    return saved;
  };

  const setCohortStatus = (id: string, status: ContentStatus, userEmail?: string) => {
    setCohorts((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        addAuditLog('UPDATE', 'Turma', c.name, `Status da turma alterado para ${status}.`, userEmail);
        return { ...c, status, updatedAt: new Date().toISOString() };
      })
    );
  };

  const deleteCohort = (id: string, userEmail?: string) => {
    const cohort = cohorts.find((c) => c.id === id);
    if (cohort) {
      addAuditLog('DELETE', 'Turma', cohort.name, 'Turma excluída.', userEmail);
    }
    setCohorts((prev) => prev.filter((c) => c.id !== id));
  };

  const saveCohortDisciplineOffer = (cohortId: string, offer: DisciplineOffer, userEmail?: string) => {
    setCohorts((prev) =>
      prev.map((c) => {
        if (c.id !== cohortId) return c;
        const exists = c.disciplines.some((d) => d.id === offer.id);
        const updatedDisciplines = exists
          ? c.disciplines.map((d) => (d.id === offer.id ? offer : d))
          : [...c.disciplines, offer];
        addAuditLog('UPDATE', 'Turma', c.name, 'Oferta de disciplina configurada na turma.', userEmail);
        return { ...c, disciplines: updatedDisciplines, updatedAt: new Date().toISOString() };
      })
    );
  };

  const removeCohortDisciplineOffer = (cohortId: string, offerId: string, userEmail?: string) => {
    setCohorts((prev) =>
      prev.map((c) => {
        if (c.id !== cohortId) return c;
        addAuditLog('UPDATE', 'Turma', c.name, 'Disciplina removida da grade da turma.', userEmail);
        return {
          ...c,
          disciplines: c.disciplines.filter((d) => d.id !== offerId),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  // --- Disciplines ---
  const saveDiscipline = (discData: Partial<CmsDiscipline>, userEmail?: string) => {
    const isNew = !discData.id;
    const now = new Date().toISOString();
    let saved: CmsDiscipline;

    if (isNew) {
      saved = {
        id: generateId('disc'),
        name: discData.name || 'Nova Disciplina',
        slug: discData.slug || 'nova-disciplina',
        syllabus: discData.syllabus || '',
        bibliography: discData.bibliography || '',
        credits: discData.credits || 4,
        workloadHours: discData.workloadHours || 48,
        status: discData.status || 'published',
        createdAt: now,
        updatedAt: now,
      };
      setDisciplines((prev) => [saved, ...prev]);
      addAuditLog('CREATE', 'Disciplina', saved.name, 'Disciplina cadastrada no catálogo.', userEmail);
    } else {
      saved = {
        ...disciplines.find((d) => d.id === discData.id)!,
        ...discData,
        updatedAt: now,
      };
      setDisciplines((prev) => prev.map((d) => (d.id === saved.id ? saved : d)));
      addAuditLog('UPDATE', 'Disciplina', saved.name, 'Ementa e dados da disciplina atualizados.', userEmail);
    }
    return saved;
  };

  const setDisciplineStatus = (id: string, status: ContentStatus, userEmail?: string) => {
    setDisciplines((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        addAuditLog('UPDATE', 'Disciplina', d.name, `Status alterado para ${status}.`, userEmail);
        return { ...d, status, updatedAt: new Date().toISOString() };
      })
    );
  };

  const deleteDiscipline = (id: string, userEmail?: string) => {
    const disc = disciplines.find((d) => d.id === id);
    if (disc) {
      addAuditLog('DELETE', 'Disciplina', disc.name, 'Disciplina removida.', userEmail);
    }
    setDisciplines((prev) => prev.filter((d) => d.id !== id));
  };

  // --- People ---
  const savePerson = (personData: Partial<CmsPerson>, userEmail?: string) => {
    const isNew = !personData.id;
    const now = new Date().toISOString();
    let saved: CmsPerson;

    if (isNew) {
      saved = {
        id: generateId('ppl'),
        name: personData.name || 'Novo Perfil',
        title: personData.title || 'Docente / Pesquisador',
        organization: personData.organization || 'CIn/UFPE',
        bio: personData.bio || '',
        photoUrl: personData.photoUrl || '',
        email: personData.email || '',
        linkedinUrl: personData.linkedinUrl || '',
        websiteUrl: personData.websiteUrl || '',
        roleTags: personData.roleTags || ['docente'],
        createdAt: now,
        updatedAt: now,
      };
      setPeople((prev) => [saved, ...prev]);
      addAuditLog('CREATE', 'Pessoa', saved.name, 'Perfil cadastrado na base de pessoas.', userEmail);
    } else {
      saved = {
        ...people.find((p) => p.id === personData.id)!,
        ...personData,
        updatedAt: now,
      };
      setPeople((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      addAuditLog('UPDATE', 'Pessoa', saved.name, 'Perfil atualizado.', userEmail);
    }
    return saved;
  };

  const deletePerson = (id: string, userEmail?: string) => {
    const p = people.find((item) => item.id === id);
    if (p) {
      addAuditLog('DELETE', 'Pessoa', p.name, 'Perfil removido da base de pessoas.', userEmail);
    }
    setPeople((prev) => prev.filter((item) => item.id !== id));
  };

  // --- Mentorships ---
  const saveMentorship = (mentorshipData: Partial<CmsMentorship>, userEmail?: string) => {
    const isNew = !mentorshipData.id;
    const now = new Date().toISOString();
    let saved: CmsMentorship;

    if (isNew) {
      saved = {
        id: generateId('mnt'),
        title: mentorshipData.title || 'Nova Mentoria',
        mentorId: mentorshipData.mentorId || (people[0]?.id || ''),
        summary: mentorshipData.summary || '',
        description: mentorshipData.description || '',
        workloadHours: mentorshipData.workloadHours || 20,
        duration: mentorshipData.duration || '2 meses',
        noticeUrl: mentorshipData.noticeUrl || '',
        enrollmentUrl: mentorshipData.enrollmentUrl || '',
        status: mentorshipData.status || 'draft',
        schedule: mentorshipData.schedule || [],
        createdAt: now,
        updatedAt: now,
      };
      setMentorships((prev) => [saved, ...prev]);
      addAuditLog('CREATE', 'Mentoria', saved.title, 'Programa de mentoria criado.', userEmail);
    } else {
      saved = {
        ...mentorships.find((m) => m.id === mentorshipData.id)!,
        ...mentorshipData,
        updatedAt: now,
      };
      setMentorships((prev) => prev.map((m) => (m.id === saved.id ? saved : m)));
      addAuditLog('UPDATE', 'Mentoria', saved.title, 'Mentoria atualizada.', userEmail);
    }
    return saved;
  };

  const setMentorshipStatus = (id: string, status: ContentStatus, userEmail?: string) => {
    setMentorships((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        addAuditLog('UPDATE', 'Mentoria', m.title, `Status alterado para ${status}.`, userEmail);
        return { ...m, status, updatedAt: new Date().toISOString() };
      })
    );
  };

  const deleteMentorship = (id: string, userEmail?: string) => {
    const m = mentorships.find((item) => item.id === id);
    if (m) {
      addAuditLog('DELETE', 'Mentoria', m.title, 'Mentoria excluída.', userEmail);
    }
    setMentorships((prev) => prev.filter((item) => item.id !== id));
  };

  // --- News ---
  const saveNews = (newsData: Partial<CmsNews>, userEmail?: string) => {
    const isNew = !newsData.id;
    const now = new Date().toISOString();
    let saved: CmsNews;

    if (isNew) {
      saved = {
        id: generateId('news'),
        title: newsData.title || 'Nova Notícia',
        slug: newsData.slug || 'nova-noticia',
        summary: newsData.summary || '',
        coverImage: newsData.coverImage || '',
        content: newsData.content || '',
        relatedPeopleIds: newsData.relatedPeopleIds || [],
        status: newsData.status || 'draft',
        authorId: 'usr-author',
        authorName: userEmail || 'Equipe Editorial',
        publishedAt: newsData.status === 'published' ? now.slice(0, 10) : undefined,
        createdAt: now,
        updatedAt: now,
      };
      setNews((prev) => [saved, ...prev]);
      addAuditLog('CREATE', 'Notícia', saved.title, 'Notícia redigida no CMS.', userEmail);
    } else {
      saved = {
        ...news.find((n) => n.id === newsData.id)!,
        ...newsData,
        updatedAt: now,
      };
      setNews((prev) => prev.map((n) => (n.id === saved.id ? saved : n)));
      addAuditLog('UPDATE', 'Notícia', saved.title, 'Conteúdo da notícia atualizado.', userEmail);
    }
    return saved;
  };

  const setNewsStatus = (id: string, status: ContentStatus, userEmail?: string) => {
    setNews((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        addAuditLog('UPDATE', 'Notícia', n.title, `Status alterado para ${status}.`, userEmail);
        return { 
          ...n, 
          status, 
          publishedAt: status === 'published' && !n.publishedAt ? new Date().toISOString().slice(0, 10) : n.publishedAt,
          updatedAt: new Date().toISOString() 
        };
      })
    );
  };

  const deleteNews = (id: string, userEmail?: string) => {
    const n = news.find((item) => item.id === id);
    if (n) {
      addAuditLog('DELETE', 'Notícia', n.title, 'Notícia excluída.', userEmail);
    }
    setNews((prev) => prev.filter((item) => item.id !== id));
  };

  // --- Partners ---
  const savePartner = (partnerData: Partial<CmsPartner>, userEmail?: string) => {
    const isNew = !partnerData.id;
    const now = new Date().toISOString();
    let saved: CmsPartner;

    if (isNew) {
      saved = {
        id: generateId('prt'),
        name: partnerData.name || 'Novo Parceiro',
        logoUrl: partnerData.logoUrl || '',
        description: partnerData.description || '',
        websiteUrl: partnerData.websiteUrl || '',
        representativeId: partnerData.representativeId || '',
        testimonial: partnerData.testimonial || '',
        order: partners.length + 1,
        status: partnerData.status || 'published',
        createdAt: now,
        updatedAt: now,
      };
      setPartners((prev) => [...prev, saved]);
      addAuditLog('CREATE', 'Parceiro', saved.name, 'Parceiro institucional cadastrado.', userEmail);
    } else {
      saved = {
        ...partners.find((p) => p.id === partnerData.id)!,
        ...partnerData,
        updatedAt: now,
      };
      setPartners((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      addAuditLog('UPDATE', 'Parceiro', saved.name, 'Dados do parceiro atualizados.', userEmail);
    }
    return saved;
  };

  const deletePartner = (id: string, userEmail?: string) => {
    const p = partners.find((item) => item.id === id);
    if (p) {
      addAuditLog('DELETE', 'Parceiro', p.name, 'Parceiro removido.', userEmail);
    }
    setPartners((prev) => prev.filter((item) => item.id !== id));
  };

  const reorderPartners = (partnerIds: string[]) => {
    setPartners((prev) => {
      const map = new Map(prev.map((p) => [p.id, p]));
      return partnerIds.map((id, index) => ({
        ...map.get(id)!,
        order: index + 1,
      }));
    });
  };

  // --- Pages ---
  const savePage = (pageData: Partial<CmsPage>, userEmail?: string) => {
    const isNew = !pageData.id;
    const now = new Date().toISOString();
    let saved: CmsPage;

    if (isNew) {
      saved = {
        id: generateId('pg'),
        title: pageData.title || 'Nova Página',
        slug: pageData.slug || 'nova-pagina',
        summary: pageData.summary || '',
        content: pageData.content || '',
        status: pageData.status || 'published',
        systemKey: pageData.systemKey || 'custom',
        createdAt: now,
        updatedAt: now,
      };
      setPages((prev) => [saved, ...prev]);
      addAuditLog('CREATE', 'Página', saved.title, 'Página institucional criada.', userEmail);
    } else {
      saved = {
        ...pages.find((p) => p.id === pageData.id)!,
        ...pageData,
        updatedAt: now,
      };
      setPages((prev) => prev.map((p) => (p.id === saved.id ? saved : p)));
      addAuditLog('UPDATE', 'Página', saved.title, 'Conteúdo da página institucional atualizado.', userEmail);
    }
    return saved;
  };

  const setPageStatus = (id: string, status: ContentStatus, userEmail?: string) => {
    setPages((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        addAuditLog('UPDATE', 'Página', p.title, `Status alterado para ${status}.`, userEmail);
        return { ...p, status, updatedAt: new Date().toISOString() };
      })
    );
  };

  const deletePage = (id: string, userEmail?: string) => {
    const page = pages.find((p) => p.id === id);
    setPages((prev) => prev.filter((p) => p.id !== id));
    addAuditLog('DELETE', 'Página', page?.title || id, 'Página institucional removida.', userEmail);
  };

  // --- Media ---
  const uploadMediaItem = (itemData: Omit<CmsMediaItem, 'id' | 'uploadedAt'>, userEmail?: string) => {
    const newItem: CmsMediaItem = {
      ...itemData,
      id: generateId('med'),
      uploadedAt: new Date().toISOString().slice(0, 10),
    };
    setMedia((prev) => [newItem, ...prev]);
    addAuditLog('CREATE', 'Mídia', newItem.title, 'Arquivo de mídia carregado no acervo.', userEmail);
    return newItem;
  };

  const updateMediaAltText = (id: string, altText: string) => {
    setMedia((prev) => prev.map((m) => (m.id === id ? { ...m, altText } : m)));
  };

  const deleteMediaItem = (id: string, userEmail?: string) => {
    const m = media.find((item) => item.id === id);
    if (m) {
      addAuditLog('DELETE', 'Mídia', m.title, 'Arquivo de mídia removido.', userEmail);
    }
    setMedia((prev) => prev.filter((item) => item.id !== id));
  };

  // --- Settings ---
  const updateSiteSettings = (newSettings: Partial<SiteSettings>, userEmail?: string) => {
    setSettings((prev) => {
      const merged: SiteSettings = {
        institutional: { ...prev.institutional, ...newSettings.institutional },
        hero: { ...prev.hero, ...newSettings.hero },
        contact: { ...prev.contact, ...newSettings.contact },
        social: { ...prev.social, ...newSettings.social },
      };
      addAuditLog('UPDATE', 'Configurações', 'Configurações Globais do Site', 'Parâmetros institucionais e de contato atualizados.', userEmail);
      return merged;
    });
  };

  // --- Enrollments ---
  const addEnrollment = (data: Omit<CandidateEnrollment, 'id' | 'status' | 'submissionDate'>) => {
    const newCand: CandidateEnrollment = {
      ...data,
      id: generateId('cand'),
      status: 'pendente',
      submissionDate: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };
    setEnrollments((prev) => [newCand, ...prev]);
  };

  const updateEnrollmentStatus = (id: string, status: EnrollmentStatus) => {
    setEnrollments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  };

  const deleteEnrollment = (id: string) => {
    setEnrollments((prev) => prev.filter((c) => c.id !== id));
  };

  const exportEnrollmentsCSV = () => {
    if (typeof window === 'undefined') return;
    const headers = 'ID,Nome,E-mail,Telefone,Área de Graduação,Experiência,Status,Data de Inscrição\n';
    const rows = enrollments
      .map(
        (c) =>
          `"${c.id}","${c.name}","${c.email}","${c.phone}","${c.graduationArea}","${c.experienceYears}","${c.status.toUpperCase()}","${c.submissionDate}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `candidatos-pos-defesa-ceic-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetToDefaults = () => {
    setCourses(initialCmsCourses);
    setCohorts(initialCmsCohorts);
    setDisciplines(initialCmsDisciplines);
    setPeople(initialCmsPeople);
    setMentorships(initialCmsMentorships);
    setNews(initialCmsNews);
    setPartners(initialCmsPartners);
    setPages(initialCmsPages);
    setMedia(initialCmsMedia);
    setSettings(initialSiteSettings);
    setAuditLogs(initialAuditLogs);
    setEnrollments([]);

    try {
      localStorage.removeItem(`${STORAGE_KEY}_courses`);
      localStorage.removeItem(`${STORAGE_KEY}_cohorts`);
      localStorage.removeItem(`${STORAGE_KEY}_disciplines`);
      localStorage.removeItem(`${STORAGE_KEY}_people`);
      localStorage.removeItem(`${STORAGE_KEY}_mentorships`);
      localStorage.removeItem(`${STORAGE_KEY}_news`);
      localStorage.removeItem(`${STORAGE_KEY}_partners`);
      localStorage.removeItem(`${STORAGE_KEY}_pages`);
      localStorage.removeItem(`${STORAGE_KEY}_media`);
      localStorage.removeItem(`${STORAGE_KEY}_settings`);
      localStorage.removeItem(`${STORAGE_KEY}_audit`);
      localStorage.removeItem(`${STORAGE_KEY}_enrollments`);
    } catch {
      // Ignore
    }
  };

  return (
    <CmsContext.Provider
      value={{
        courses,
        cohorts,
        disciplines,
        people,
        mentorships,
        news,
        partners,
        pages,
        media,
        settings,
        auditLogs,
        enrollments,
        saveCourse,
        setCourseStatus,
        deleteCourse,
        saveCohort,
        setCohortStatus,
        deleteCohort,
        saveCohortDisciplineOffer,
        removeCohortDisciplineOffer,
        saveDiscipline,
        setDisciplineStatus,
        deleteDiscipline,
        savePerson,
        deletePerson,
        saveMentorship,
        setMentorshipStatus,
        deleteMentorship,
        saveNews,
        setNewsStatus,
        deleteNews,
        savePartner,
        deletePartner,
        reorderPartners,
        savePage,
        setPageStatus,
        deletePage,
        uploadMediaItem,
        updateMediaAltText,
        deleteMediaItem,
        updateSiteSettings,
        addEnrollment,
        updateEnrollmentStatus,
        deleteEnrollment,
        exportEnrollmentsCSV,
        resetToDefaults,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  const context = useContext(CmsContext);
  if (!context) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return context;
};
