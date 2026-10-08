import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, Calendar, Clock, Edit2, Check } from 'lucide-react';
import { ScheduleItem } from '../../types/cms';

interface ScheduleLineEditorProps {
  items: ScheduleItem[];
  onChange: (items: ScheduleItem[]) => void;
  title?: string;
}

export const ScheduleLineEditor: React.FC<ScheduleLineEditorProps> = ({
  items,
  onChange,
  title = 'Cronograma de Atividades',
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formLine, setFormLine] = useState<ScheduleItem>({
    id: '',
    date: '',
    startTime: '08:30',
    endTime: '12:30',
    modality: 'Online Síncrono',
    activity: '',
  });

  const handleAdd = () => {
    const newItem: ScheduleItem = {
      id: `sch-${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      startTime: '08:30',
      endTime: '12:30',
      modality: 'Online Síncrono',
      activity: 'Nova atividade ou aula prática',
    };
    onChange([...items, newItem]);
    setEditingId(newItem.id);
    setFormLine(newItem);
  };

  const handleStartEdit = (item: ScheduleItem) => {
    setEditingId(item.id);
    setFormLine(item);
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    onChange(items.map((it) => (it.id === editingId ? formLine : it)));
    setEditingId(null);
  };

  const handleRemove = (id: string) => {
    onChange(items.filter((it) => it.id !== id));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const newItems = [...items];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);
    onChange(newItems);
  };

  return (
    <div className="space-y-3 p-4 bg-slate-50 dark:bg-[#000B13] rounded-2xl border border-slate-200 dark:border-[#0e304b] text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#508EBC]" />
            <span>{title}</span>
          </h4>
          <p className="text-[11px] text-slate-500">
            {items.length} {items.length === 1 ? 'atividade configurada' : 'atividades configuradas'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="px-3 py-1.5 rounded-lg bg-[#508EBC] hover:bg-[#417fae] text-white font-semibold flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Adicionar atividade</span>
        </button>
      </div>

      {/* Editing Line Box */}
      {editingId && (
        <div className="p-3 bg-white dark:bg-[#021C2F] rounded-xl border-2 border-[#508EBC]/60 space-y-2 shadow-xs">
          <p className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">Editar Linha de Atividade</p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <div>
              <label className="block text-[10px] text-slate-500 font-mono">Data</label>
              <input
                type="date"
                value={formLine.date}
                onChange={(e) => setFormLine({ ...formLine, date: e.target.value })}
                className="w-full p-1.5 rounded bg-slate-50 dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-mono">Horário Início / Fim</label>
              <div className="flex items-center gap-1">
                <input
                  type="time"
                  value={formLine.startTime}
                  onChange={(e) => setFormLine({ ...formLine, startTime: e.target.value })}
                  className="w-1/2 p-1.5 rounded bg-slate-50 dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-xs font-mono"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="time"
                  value={formLine.endTime}
                  onChange={(e) => setFormLine({ ...formLine, endTime: e.target.value })}
                  className="w-1/2 p-1.5 rounded bg-slate-50 dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-xs font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 font-mono">Formato</label>
              <select
                value={formLine.modality}
                onChange={(e) => setFormLine({ ...formLine, modality: e.target.value as any })}
                className="w-full p-1.5 rounded bg-slate-50 dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-xs"
              >
                <option value="Online Síncrono">Online Síncrono</option>
                <option value="Cyber Range">Cyber Range</option>
                <option value="Presencial">Presencial</option>
              </select>
            </div>
            <div className="sm:col-span-1 flex items-end">
              <button
                type="button"
                onClick={handleSaveEdit}
                className="w-full py-1.5 px-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirmar Linha</span>
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 font-mono">Descrição / Tópico da Atividade</label>
            <input
              type="text"
              value={formLine.activity}
              onChange={(e) => setFormLine({ ...formLine, activity: e.target.value })}
              placeholder="Ex: Laboratório: Ingestão de Telemetria e Regras Sigma"
              className="w-full p-1.5 rounded bg-slate-50 dark:bg-[#000B13] border border-slate-300 dark:border-[#0e304b] text-xs"
            />
          </div>
        </div>
      )}

      {/* Schedule Items List */}
      <div className="space-y-1.5">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="p-2.5 rounded-xl bg-white dark:bg-[#021C2F] border border-slate-200 dark:border-[#0e304b] flex items-center justify-between gap-3 hover:border-[#508EBC]/40 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-[#000B13] text-slate-500 font-mono text-[10px] flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {item.date ? item.date.split('-').reverse().join('/') : 'Data a definir'}
                  </span>
                  <span className="text-slate-400 text-[10px] font-mono">
                    {item.startTime} - {item.endTime}
                  </span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-[#508EBC]/15 text-[#508EBC] dark:text-[#80B7DF]">
                    {item.modality}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs truncate mt-0.5 font-medium">
                  {item.activity}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => handleMove(idx, 'up')}
                disabled={idx === 0}
                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                title="Mover para cima"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleMove(idx, 'down')}
                disabled={idx === items.length - 1}
                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                title="Mover para baixo"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleStartEdit(item)}
                className="p-1 text-slate-400 hover:text-[#508EBC]"
                title="Editar linha"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="p-1 text-slate-400 hover:text-rose-500"
                title="Remover linha"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="p-4 text-center text-slate-400 text-xs italic">
            Nenhuma atividade cadastrada no cronograma. Clique em "+ Adicionar atividade".
          </div>
        )}
      </div>
    </div>
  );
};
