import React from 'react';
import { ArrowLeftRight, X, Sparkles, Check } from 'lucide-react';
import { Medication } from '../types';

interface CompareBarProps {
  selectedIds: string[];
  medications: Medication[];
  onOpenModal: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export const CompareBar: React.FC<CompareBarProps> = ({
  selectedIds,
  medications,
  onOpenModal,
  onRemove,
  onClear,
}) => {
  if (selectedIds.length === 0) return null;

  const selectedMeds = selectedIds
    .map((id) => medications.find((m) => m.id === id))
    .filter((m): m is Medication => Boolean(m));

  return (
    <div 
      id="compare-floating-bar"
      role="region"
      aria-label="Barra de comparação de fármacos"
      className="fixed bottom-5 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 max-w-2xl w-full mx-auto animate-in slide-in-from-bottom-5 duration-200"
    >
      <div className="bg-[#1d1d1f] dark:bg-[#202022] text-white rounded-2xl sm:rounded-full px-4 sm:px-6 py-3 shadow-2xl border border-white/10 dark:border-white/10 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Left: Indicator & Selected Pills */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto overflow-x-auto py-0.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold shrink-0 text-[#2997ff]">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Comparar ({selectedMeds.length}/2):</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {selectedMeds.map((med) => (
              <span
                key={med.id}
                className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-medium bg-white/15 dark:bg-white/10 text-white shrink-0"
              >
                <span className="truncate max-w-[120px]">{med.name}</span>
                <button
                  onClick={() => onRemove(med.id)}
                  className="p-0.5 rounded-full hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                  title={`Remover ${med.name} da comparação`}
                  aria-label={`Remover ${med.name} da comparação`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {selectedMeds.length === 1 && (
              <span className="text-[11px] text-white/50 italic shrink-0 hidden sm:inline">
                + Selecione o 2º fármaco
              </span>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-end gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10">
          <button
            onClick={onClear}
            className="px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            Limpar
          </button>
          <button
            id="open-compare-modal-btn"
            onClick={onOpenModal}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-[#0066cc] dark:bg-[#2997ff] text-white dark:text-[#121214] hover:opacity-90 transition-all active:scale-95 shadow-xs"
          >
            <span>Comparar agora</span>
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
