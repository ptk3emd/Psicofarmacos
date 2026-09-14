import React from 'react';
import { Filter, RotateCcw, Baby, FileCheck, AlertCircle } from 'lucide-react';
import { FilterState, PrescriptionType } from '../types';

interface FilterBarProps {
  filter: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  availableSubclasses: string[];
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filter,
  onFilterChange,
  availableSubclasses,
  hasActiveFilters,
  onResetFilters,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs bg-white dark:bg-[#18181a] p-3 rounded-2xl border border-[#e0e0e0] dark:border-[#2a2a2c] shadow-xs">
        
        {/* Subclass dropdown */}
        <div className="flex items-center gap-1.5 min-w-[170px] flex-1 sm:flex-initial">
          <Filter className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff] shrink-0" />
          <select
            id="filter-subclass-select"
            value={filter.subClass}
            onChange={(e) => onFilterChange({ subClass: e.target.value })}
            className="w-full bg-[#f5f5f7] dark:bg-[#272729] text-[#1d1d1f] dark:text-white rounded-lg px-2.5 py-1.5 border border-[#e0e0e0]/70 dark:border-[#333333] focus:outline-none focus:ring-1 focus:ring-[#0066cc] dark:focus:ring-[#2997ff]"
          >
            <option value="all">Todas as Subclasses / Mecanismos</option>
            {availableSubclasses.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

        {/* Prescription Type Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[#7a7a7a] dark:text-[#cccccc] font-medium flex items-center gap-1">
            <FileCheck className="w-3.5 h-3.5 text-[#7a7a7a]" /> Receita:
          </span>
          <button
            id="filter-rx-all"
            onClick={() => onFilterChange({ prescriptionType: 'all' })}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              filter.prescriptionType === 'all'
                ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f]'
                : 'bg-[#f5f5f7] dark:bg-[#272729] text-[#7a7a7a] hover:text-[#1d1d1f] dark:hover:text-white'
            }`}
          >
            Todas
          </button>
          <button
            id="filter-rx-especial"
            onClick={() => onFilterChange({ prescriptionType: 'receita_especial_branca' })}
            className={`px-2.5 py-1 rounded-full font-medium transition-all border ${
              filter.prescriptionType === 'receita_especial_branca'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
            }`}
          >
            2 Vias Branca
          </button>
          <button
            id="filter-rx-b"
            onClick={() => onFilterChange({ prescriptionType: 'receita_b_azul' })}
            className={`px-2.5 py-1 rounded-full font-medium transition-all border ${
              filter.prescriptionType === 'receita_b_azul'
                ? 'bg-[#0066cc] text-white border-[#0066cc]'
                : 'bg-sky-50 text-[#0066cc] border-sky-200 dark:bg-sky-950/40 dark:text-[#2997ff] dark:border-sky-800/60'
            }`}
          >
            Receita B (Azul)
          </button>
        </div>

        {/* Pregnancy Safety Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#7a7a7a] dark:text-[#cccccc] font-medium flex items-center gap-1">
            <Baby className="w-3.5 h-3.5 text-[#7a7a7a]" /> Gestação:
          </span>
          <select
            id="filter-pregnancy-select"
            value={filter.pregnancySafety}
            onChange={(e) => onFilterChange({ pregnancySafety: e.target.value as 'all' | 'segura' | 'contraindicada' })}
            className="bg-[#f5f5f7] dark:bg-[#272729] text-[#1d1d1f] dark:text-white rounded-lg px-2 py-1.5 border border-[#e0e0e0]/70 dark:border-[#333333] focus:outline-none focus:ring-1 focus:ring-[#0066cc]"
          >
            <option value="all">Todas as faixas</option>
            <option value="segura">Segura / Preferencial</option>
            <option value="contraindicada">Contraindicada</option>
          </select>
        </div>

        {/* Discontinued toggle */}
        <label className="flex items-center gap-1.5 cursor-pointer ml-auto text-[#7a7a7a] dark:text-[#cccccc] hover:text-[#1d1d1f] dark:hover:text-white select-none">
          <input
            id="filter-discontinued-checkbox"
            type="checkbox"
            checked={filter.showDiscontinued}
            onChange={(e) => onFilterChange({ showDiscontinued: e.target.checked })}
            className="w-3.5 h-3.5 text-[#0066cc] rounded focus:ring-0 cursor-pointer"
          />
          <span>Exibir descontinuados</span>
        </label>

        {/* Reset button */}
        {hasActiveFilters && (
          <button
            id="filter-reset-btn"
            onClick={onResetFilters}
            className="flex items-center gap-1 px-2.5 py-1 text-[#0066cc] dark:text-[#2997ff] hover:bg-[#f5f5f7] dark:hover:bg-[#272729] rounded-full transition-colors"
            title="Restaurar todos os filtros"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpar filtros</span>
          </button>
        )}
      </div>
    </div>
  );
};
