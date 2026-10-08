import React, { useState } from 'react';
import { facultyData as initialFacultyData } from '../data/facultyData';
import { FacultyMember } from '../types/course';
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  ExternalLink, 
  Camera, 
  Upload, 
  Plus, 
  X, 
  Check, 
  User, 
  Image as ImageIcon 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const FacultySection: React.FC = () => {
  const { t } = useLanguage();
  const [facultyList, setFacultyList] = useState<FacultyMember[]>(initialFacultyData);
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);
  
  // State for changing a member's photo
  const [editingPhotoMember, setEditingPhotoMember] = useState<FacultyMember | null>(null);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // State for adding a new faculty member
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberData, setNewMemberData] = useState({
    name: '',
    title: '',
    institutionRole: '',
    academicBackground: '',
    bio: '',
    areasOfExpertise: '',
    badge: 'Docente Convidado',
    avatarUrl: '',
  });

  const handleOpenPhotoEditor = (member: FacultyMember) => {
    setEditingPhotoMember(member);
    setPhotoUrlInput(member.avatarUrl || '');
    setPhotoPreview(member.avatarUrl || null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPhotoPreview(result);
      setPhotoUrlInput(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhotoMember) return;

    setFacultyList((prev) =>
      prev.map((m) =>
        m.id === editingPhotoMember.id
          ? { ...m, avatarUrl: photoPreview || photoUrlInput }
          : m
      )
    );

    setEditingPhotoMember(null);
    setPhotoPreview(null);
    setPhotoUrlInput('');
  };

  const handleAddNewMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberData.name || !newMemberData.title) return;

    const newMember: FacultyMember = {
      id: `member-${Date.now()}`,
      name: newMemberData.name,
      title: newMemberData.title,
      institutionRole: newMemberData.institutionRole || 'Docente Especialista',
      academicBackground: newMemberData.academicBackground || 'Formação em Segurança da Informação e Computação.',
      bio: newMemberData.bio || 'Pesquisador e profissional atuante na área de inteligência e defesa cibernética.',
      areasOfExpertise: newMemberData.areasOfExpertise
        ? newMemberData.areasOfExpertise.split(',').map((s) => s.trim())
        : ['Defesa Cibernética', 'Segurança Ofensiva'],
      badge: newMemberData.badge,
      avatarUrl: newMemberData.avatarUrl || undefined,
    };

    setFacultyList((prev) => [newMember, ...prev]);
    setIsAddingMember(false);
    setNewMemberData({
      name: '',
      title: '',
      institutionRole: '',
      academicBackground: '',
      bio: '',
      areasOfExpertise: '',
      badge: 'Docente Convidado',
      avatarUrl: '',
    });
  };

  return (
    <section id="docentes" className="py-16 md:py-24 bg-[#F7F9FB] dark:bg-[#000B13] border-b border-[#D5D8DC] dark:border-[#0e304b] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section lead */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-[#508EBC] dark:text-[#80B7DF] font-semibold">
              {t.faculty.kicker}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#021C2F] dark:text-white tracking-tight">
              {t.faculty.title}
            </h2>
            <p className="text-sm sm:text-base text-[#26292D] dark:text-slate-300 leading-relaxed">
              {t.faculty.subtitle}
            </p>
          </div>

          <button
            onClick={() => setIsAddingMember(true)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#021C2F] dark:text-white hover:text-[#000B13] dark:hover:text-[#80B7DF] bg-[#FFFFFF] dark:bg-[#021C2F] hover:bg-[#F3F3F3] dark:hover:bg-[#052136] border border-[#D5D8DC] dark:border-[#0e304b] rounded-md transition-colors shrink-0 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#508EBC]" />
            <span>Adicionar Novo Membro</span>
          </button>
        </div>

        {/* Faculty Grid with Photo Slots */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facultyList.map((member) => (
            <div
              key={member.id}
              className="rounded-lg bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] hover:border-[#508EBC]/60 transition-colors p-6 flex flex-col justify-between shadow-sm"
            >
              <div>
                {/* Member Header: Photo + Badge */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  {/* Photo Slot */}
                  <div className="relative group">
                    <div className="w-16 h-16 rounded-lg bg-[#F7F9FB] dark:bg-[#001726] border border-[#D5D8DC] dark:border-[#0e304b] overflow-hidden flex items-center justify-center text-slate-400 shrink-0">
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-[#508EBC] dark:text-[#80B7DF] font-mono text-sm font-bold">
                          {member.name
                            .split(' ')
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join('')}
                        </div>
                      )}
                    </div>

                    {/* Camera Button to edit/add photo */}
                    <button
                      onClick={() => handleOpenPhotoEditor(member)}
                      title="Adicionar ou alterar foto"
                      className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-[#FFFFFF] dark:bg-[#021C2F] border border-[#D5D8DC] dark:border-[#0e304b] text-[#508EBC] hover:text-[#021C2F] dark:hover:text-white flex items-center justify-center shadow transition-colors"
                      aria-label={`Alterar foto de ${member.name}`}
                    >
                      <Camera className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Clean unboxed role kicker */}
                  <div className="text-right">
                    <span className="text-xs font-mono text-[#508EBC] dark:text-[#80B7DF] font-semibold block">
                      {member.badge}
                    </span>
                    <span className="text-[#26292D]/70 dark:text-slate-400 text-[11px] font-mono">
                      CEIC · UFPE
                    </span>
                  </div>
                </div>

                <h3 className="font-display text-lg font-bold text-[#021C2F] dark:text-white tracking-tight">
                  {member.name}
                </h3>
                
                <div className="text-xs font-medium text-[#508EBC] dark:text-[#80B7DF] mt-1 mb-3">
                  {member.title}
                </div>

                <div className="text-xs text-[#26292D]/70 dark:text-slate-400 mb-4 pb-3 border-b border-[#D5D8DC] dark:border-[#0e304b]">
                  {member.academicBackground}
                </div>

                <p className="text-xs text-[#26292D]/85 dark:text-slate-300 leading-relaxed line-clamp-3 mb-4">
                  {member.bio}
                </p>
              </div>

              <div>
                <div className="text-[11px] font-mono text-[#021C2F] dark:text-white mb-2 uppercase tracking-wider font-semibold">
                  Áreas de Atuação:
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {member.areasOfExpertise.map((area, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-mono text-[#26292D] dark:text-slate-200 bg-[#F3F3F3] dark:bg-[#001726] px-2 py-0.5 rounded border border-[#D5D8DC] dark:border-[#0e304b]"
                    >
                      {area}
                    </span>
                  ))}
                </div>

                <div className="pt-3 border-t border-[#D5D8DC] dark:border-[#0e304b] flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleOpenPhotoEditor(member)}
                    className="text-[11px] text-[#26292D]/70 dark:text-slate-400 hover:text-[#021C2F] dark:hover:text-white flex items-center gap-1 font-mono"
                  >
                    <Camera className="w-3 h-3 text-[#508EBC]" />
                    <span>{member.avatarUrl ? 'Alterar Foto' : 'Adicionar Foto'}</span>
                  </button>

                  <button
                    onClick={() => setSelectedFaculty(member)}
                    className="text-xs font-medium text-[#508EBC] dark:text-[#80B7DF] hover:text-[#021C2F] dark:hover:text-white flex items-center gap-1 focus:outline-none"
                  >
                    <span>Ver Perfil</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal: Adicionar / Alterar Foto do Docente */}
        {editingPhotoMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="max-w-md w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-2xl p-6 relative text-slate-800 dark:text-slate-200">
              <button
                onClick={() => setEditingPhotoMember(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1 font-semibold">
                    Gestão de Foto de Docente
                  </span>
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                    {editingPhotoMember.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Faça upload de uma foto ou insira a URL da imagem.
                  </p>
                </div>

                {/* Preview Box */}
                <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                  <div className="w-16 h-16 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 overflow-hidden flex items-center justify-center text-slate-400 shrink-0">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <User className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <span className="text-slate-900 dark:text-white font-medium block">Foto Selecionada</span>
                    <span>Formatos suportados: PNG, JPG, WEBP</span>
                  </div>
                </div>

                <form onSubmit={handleSavePhoto} className="space-y-3.5 text-xs">
                  {/* File Upload Option */}
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Enviar Foto do Computador:
                    </label>
                    <label className="flex items-center justify-center gap-2 w-full p-2.5 rounded-md border border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500/60 bg-slate-50 dark:bg-slate-950/80 cursor-pointer transition-colors text-slate-600 dark:text-slate-300">
                      <Upload className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Selecionar Arquivo de Imagem</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Or URL Input */}
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Ou Insira a URL da Foto:
                    </label>
                    <input
                      type="url"
                      value={photoUrlInput}
                      onChange={(e) => {
                        setPhotoUrlInput(e.target.value);
                        setPhotoPreview(e.target.value);
                      }}
                      placeholder="https://exemplo.com/foto-professor.jpg"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingPhotoMember(null)}
                      className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-md"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs font-semibold text-white dark:text-slate-950 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-400 dark:hover:bg-emerald-300 rounded-md transition-colors"
                    >
                      Salvar Foto
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Adicionar Novo Membro Docente */}
        {isAddingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="max-w-lg w-full rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-2xl p-6 sm:p-7 relative text-slate-800 dark:text-slate-200 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setIsAddingMember(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1 font-semibold">
                    Cadastro Acadêmico
                  </span>
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                    Adicionar Membro ao Corpo Docente
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Cadastre novos professores, instrutores ou pesquisadores do CEIC.
                  </p>
                </div>

                <form onSubmit={handleAddNewMember} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Nome Completo do Docente:
                    </label>
                    <input
                      type="text"
                      required
                      value={newMemberData.name}
                      onChange={(e) => setNewMemberData({ ...newMemberData, name: e.target.value })}
                      placeholder="Ex: Dra. Mariana Costa"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Titulação Acadêmica:
                      </label>
                      <input
                        type="text"
                        required
                        value={newMemberData.title}
                        onChange={(e) => setNewMemberData({ ...newMemberData, title: e.target.value })}
                        placeholder="Ex: Doutora em Ciência da Computação"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Papel no Programa:
                      </label>
                      <input
                        type="text"
                        value={newMemberData.badge}
                        onChange={(e) => setNewMemberData({ ...newMemberData, badge: e.target.value })}
                        placeholder="Ex: Docente Titular"
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      URL da Foto (opcional):
                    </label>
                    <input
                      type="url"
                      value={newMemberData.avatarUrl}
                      onChange={(e) => setNewMemberData({ ...newMemberData, avatarUrl: e.target.value })}
                      placeholder="https://exemplo.com/foto.jpg"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Formação e Histórico Acadêmico:
                    </label>
                    <input
                      type="text"
                      value={newMemberData.academicBackground}
                      onChange={(e) => setNewMemberData({ ...newMemberData, academicBackground: e.target.value })}
                      placeholder="Ex: Doutorado pela UFPE com pesquisas em Forense Digital."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Biografia Resumida:
                    </label>
                    <textarea
                      rows={3}
                      value={newMemberData.bio}
                      onChange={(e) => setNewMemberData({ ...newMemberData, bio: e.target.value })}
                      placeholder="Descreva a atuação profissional, pesquisas e projetos..."
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Áreas de Atuação (separadas por vírgula):
                    </label>
                    <input
                      type="text"
                      value={newMemberData.areasOfExpertise}
                      onChange={(e) => setNewMemberData({ ...newMemberData, areasOfExpertise: e.target.value })}
                      placeholder="Ex: Forense de Redes, Malware Analysis, Threat Intelligence"
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-md text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingMember(false)}
                      className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-md"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold text-white dark:text-slate-950 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-400 dark:hover:bg-emerald-300 rounded-md transition-colors"
                    >
                      Cadastrar Docente
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Perfil Detalhado */}
        {selectedFaculty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="max-w-xl w-full rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-2xl p-6 sm:p-8 space-y-5 text-slate-800 dark:text-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  {selectedFaculty.avatarUrl && (
                    <img
                      src={selectedFaculty.avatarUrl}
                      alt={selectedFaculty.name}
                      className="w-16 h-16 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                  )}
                  <div>
                    <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1 font-semibold">
                      {selectedFaculty.badge}
                    </span>
                    <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">
                      {selectedFaculty.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {selectedFaculty.title}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFaculty(null)}
                  className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800">
                  <strong className="text-slate-900 dark:text-white block mb-1">Formação Acadêmica:</strong>
                  {selectedFaculty.academicBackground}
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white block mb-1">Trajetória Profissional:</strong>
                  {selectedFaculty.bio}
                </div>
              </div>

              <div>
                <strong className="text-xs text-slate-900 dark:text-white block mb-2 font-mono uppercase tracking-wider">
                  Disciplinas & Especialidades:
                </strong>
                <div className="flex flex-wrap gap-1.5">
                  {selectedFaculty.areasOfExpertise.map((item, idx) => (
                    <span key={idx} className="text-xs font-mono bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedFaculty(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
