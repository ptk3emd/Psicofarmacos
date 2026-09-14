import React from 'react';
import { 
  Star, 
  Copy, 
  ChevronRight, 
  AlertTriangle, 
  Baby, 
  ShieldAlert, 
  Check, 
  Layers,
  Sparkles,
  ArrowLeftRight
} from 'lucide-react';
import { Medication } from '../types';
import { PRESCRIPTION_TYPES_INFO } from '../data/medications';

interface MedicationCardProps {
  medication: Medication;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (medication: Medication) => void;
  onCopyPrescription: (text: string, drugName: string) => void;
  searchQuery?: string;
  isSelectedForCompare?: boolean;
  onToggleCompare?: (id: string) => void;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  isFavorite,
  onToggleFavorite,
  onSelect,
  onCopyPrescription,
  searchQuery,
  isSelectedForCompare = false,
  onToggleCompare,
}) => {
  const rxInfo = PRESCRIPTION_TYPES_INFO[medication.prescriptionType];

  // Highlight search term in text if present
  const renderHighlighted = (text: string) => {
    if (!searchQuery || !searchQuery.trim()) return text;
    const query = searchQuery.trim();
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={i} className="bg-amber-200 dark:bg-amber-800/80 text-inherit rounded-xs px-0.5">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getPregnancyBadge = () => {
    switch (medication.pregnancy.level) {
      case 'segura':
        return {
          dot: 'bg-emerald-500',
          text: 'Segura / Preferencial',
          badge: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50',
        };
      case 'relativamente_segura':
        return {
          dot: 'bg-teal-500',
          text: 'Relat. Segura',
          badge: 'bg-teal-50 text-teal-800 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200 dark:border-teal-800/50',
        };
      case 'pouco_recomendada':
        return {
          dot: 'bg-amber-500',
          text: 'Pouco recomendada',
          badge: 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800/50',
        };
      case 'contraindicada':
        return {
          dot: 'bg-rose-500',
          text: 'Contraindicada',
          badge: 'bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800/50',
        };
      default:
        return {
          dot: 'bg-slate-400',
          text: 'Uso Cauteloso',
          badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
        };
    }
  };

  const pregBadge = getPregnancyBadge();

  return (
    <div
      id={`medication-card-${medication.id}`}
      className={`group relative flex flex-col justify-between bg-white dark:bg-[#1c1c1e] rounded-[18px] border transition-all duration-200 hover:border-[#0066cc]/40 dark:hover:border-[#2997ff]/40 hover:shadow-md hover:shadow-black/5 ${
        isSelectedForCompare
          ? 'ring-2 ring-[#0066cc] dark:ring-[#2997ff] border-transparent shadow-md'
          : medication.isDiscontinued
          ? 'opacity-75 border-dashed border-[#e0e0e0] dark:border-[#333333]'
          : 'border-[#e0e0e0] dark:border-[#2a2a2c]'
      }`}
    >
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        {/* Top badges & Favorite */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-[#f5f5f7] dark:bg-[#272729] text-[#1d1d1f] dark:text-[#cccccc] border border-[#e0e0e0]/70 dark:border-[#333333]">
              {medication.subClass}
            </span>

            {/* Prescription type badge */}
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${rxInfo.badgeColor}`}>
              {rxInfo.short}
            </span>

            {medication.isDiscontinued && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                Descontinuado
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {onToggleCompare && (
              <button
                id={`compare-toggle-btn-${medication.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCompare(medication.id);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                  isSelectedForCompare
                    ? 'bg-[#0066cc] text-white dark:bg-[#2997ff] dark:text-[#1d1d1f] shadow-xs'
                    : 'text-[#7a7a7a] hover:text-[#1d1d1f] dark:text-[#cccccc] dark:hover:text-white bg-[#f5f5f7] dark:bg-[#272729] border border-[#e0e0e0]/70 dark:border-[#333333]'
                }`}
                title={isSelectedForCompare ? 'Remover da comparação' : 'Marcar para comparar'}
                aria-label={`Comparar ${medication.name}`}
              >
                <ArrowLeftRight className="w-3 h-3" />
                <span className="hidden sm:inline">{isSelectedForCompare ? 'Comparando' : 'Comparar'}</span>
              </button>
            )}

            {/* Favorite button */}
            <button
              id={`fav-btn-${medication.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(medication.id);
              }}
              className="p-1.5 rounded-full hover:bg-[#f5f5f7] dark:hover:bg-[#272729] transition-colors text-[#7a7a7a] hover:text-amber-500"
              title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              aria-label={`Favoritar ${medication.name}`}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Medication Name */}
        <div className="mb-2">
          <h2 className="text-xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white group-hover:text-[#0066cc] dark:group-hover:text-[#2997ff] transition-colors">
            {renderHighlighted(medication.name)}
          </h2>
          {medication.composition && (
            <div className="flex items-center gap-1 mt-1 text-xs text-[#0066cc] dark:text-[#2997ff] font-medium">
              <Layers className="w-3.5 h-3.5" />
              <span>{medication.composition}</span>
            </div>
          )}
        </div>

        {/* Commercial Names */}
        {medication.commercialNames.length > 0 && (
          <div className="mb-4">
            <span className="text-[11px] font-medium text-[#7a7a7a] dark:text-[#cccccc] uppercase tracking-wider block mb-1">
              Nomes Comerciais
            </span>
            <div className="flex flex-wrap gap-1">
              {medication.commercialNames.slice(0, 4).map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-[#fafafc] dark:bg-[#252527] text-[#1d1d1f] dark:text-white border border-[#f0f0f0] dark:border-[#333333]"
                >
                  {renderHighlighted(name)}
                </span>
              ))}
              {medication.commercialNames.length > 4 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] text-[#7a7a7a] dark:text-[#cccccc] bg-transparent">
                  +{medication.commercialNames.length - 4} mais
                </span>
              )}
            </div>
          </div>
        )}

        {/* Therapeutic Range Highlight */}
        <div className="mb-3.5 p-3 rounded-xl bg-[#f5f5f7] dark:bg-[#252527] border border-[#e0e0e0]/60 dark:border-[#333333]">
          <div className="text-[11px] font-medium text-[#7a7a7a] dark:text-[#cccccc] uppercase tracking-wider mb-0.5">
            Intervalo Terapêutico
          </div>
          <div className="text-sm font-semibold text-[#1d1d1f] dark:text-white">
            {medication.therapeuticRange}
          </div>
          {medication.extremeDose && (
            <div className="text-[11px] text-[#7a7a7a] dark:text-[#cccccc] mt-1 flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{medication.extremeDose}</span>
            </div>
          )}
        </div>

        {/* Presentations Summary */}
        <div className="mb-3.5">
          <div className="text-[11px] font-medium text-[#7a7a7a] dark:text-[#cccccc] uppercase tracking-wider mb-1">
            Apresentações
          </div>
          <p className="text-xs text-[#333333] dark:text-[#cccccc] line-clamp-2">
            {medication.presentations.join(' • ')}
          </p>
        </div>

        {/* Pregnancy indicator */}
        <div className="mb-3 flex items-center justify-between text-xs">
          <span className="text-[#7a7a7a] dark:text-[#cccccc] flex items-center gap-1">
            <Baby className="w-3.5 h-3.5" /> Gestação:
          </span>
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium border ${pregBadge.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${pregBadge.dot}`} />
            {pregBadge.text}
          </span>
        </div>

        {/* Critical Alert Banner if drug has special warning */}
        {medication.warnings && medication.warnings.length > 0 && (
          <div className="mt-auto mb-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2 text-[11px] leading-tight">
              {medication.warnings[0]}
            </span>
          </div>
        )}
      </div>

      {/* Card Action Footer */}
      <div className="px-5 sm:px-6 py-3.5 bg-[#fafafc] dark:bg-[#222224] rounded-b-[18px] border-t border-[#e0e0e0]/70 dark:border-[#2a2a2c] flex items-center justify-between gap-2">
        <button
          id={`copy-dose-btn-${medication.id}`}
          onClick={() => onCopyPrescription(
            `${medication.name}\nPosologia: ${medication.idealPrescription}\nApresentações: ${medication.presentations.join(', ')}`,
            medication.name
          )}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#7a7a7a] hover:text-[#1d1d1f] dark:text-[#cccccc] dark:hover:text-white hover:bg-white dark:hover:bg-[#2c2c2e] transition-all active:scale-95"
          title="Copiar esquema posológico"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copiar dose</span>
        </button>

        <button
          id={`details-btn-${medication.id}`}
          onClick={() => onSelect(medication)}
          className="flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#0066cc] text-white hover:bg-[#0071e3] dark:bg-[#2997ff] dark:text-[#1d1d1f] dark:hover:bg-sky-400 transition-all active:scale-95 shadow-xs"
        >
          <span>Guia Completo</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
