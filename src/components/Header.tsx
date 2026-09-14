import React from 'react';
import { 
  Search, 
  X, 
  Moon, 
  Sun, 
  LayoutGrid, 
  Table as TableIcon, 
  Star, 
  FileText, 
  Pill,
  Sparkles
} from 'lucide-react';
import { FilterState } from '../types';

interface HeaderProps {
  filter: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  viewMode: 'cards' | 'table';
  onViewModeChange: (mode: 'cards' | 'table') => void;
  favoritesCount: number;
  totalMedications: number;
  filteredCount: number;
  onOpenGuideModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  filter,
  onFilterChange,
  darkMode,
  onToggleDarkMode,
  viewMode,
  onViewModeChange,
  favoritesCount,
  totalMedications,
  filteredCount,
  onOpenGuideModal,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#e0e0e0] dark:border-[#2a2a2c] bg-white/90 dark:bg-[#121214]/90 backdrop-blur-md transition-colors duration-200">
      {/* Top minimal status bar */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0066cc]/10 dark:bg-[#2997ff]/15 flex items-center justify-center text-[#0066cc] dark:text-[#2997ff] shrink-0">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
                    Psicofármacos
                  </h1>
                  <span className="hidden xs:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium tracking-wide bg-[#f5f5f7] dark:bg-[#272729] text-[#1d1d1f] dark:text-[#cccccc] border border-[#e0e0e0]/70 dark:border-[#333333]">
                    Guia Prático
                  </span>
                </div>
                <p className="text-xs text-[#7a7a7a] dark:text-[#cccccc] hidden sm:block">
                  Doses terapêuticas, posologias, apresentações e alertas clínicos
                </p>
              </div>
            </div>

            {/* Mobile action icons */}
            <div className="flex items-center gap-1.5 sm:hidden">
              <button
                id="header-fav-btn-mobile"
                onClick={() => onFilterChange({ onlyFavorites: !filter.onlyFavorites })}
                className={`p-2 rounded-full transition-colors ${
                  filter.onlyFavorites 
                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400' 
                    : 'text-[#7a7a7a] hover:bg-[#f5f5f7] dark:hover:bg-[#272729] dark:text-[#cccccc]'
                }`}
                title="Ver Favoritos"
                aria-label="Ver Favoritos"
              >
                <Star className={`w-5 h-5 ${filter.onlyFavorites ? 'fill-current' : ''}`} />
              </button>
              <button
                id="header-theme-toggle-mobile"
                onClick={onToggleDarkMode}
                className="p-2 rounded-full text-[#1d1d1f] dark:text-white bg-[#f5f5f7] dark:bg-[#272729] border border-[#e0e0e0]/70 dark:border-[#333333] transition-all active:scale-95 shadow-xs"
                title={darkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
                aria-label="Alternar tema"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>
            </div>
          </div>

          {/* Search bar & Controls */}
          <div className="flex items-center gap-2.5 flex-1 max-w-xl">
            {/* Pill Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7a7a7a]">
                <Search className="w-4 h-4" />
              </div>
              <input
                id="search-medication-input"
                type="text"
                value={filter.search}
                onChange={(e) => onFilterChange({ search: e.target.value })}
                placeholder="Buscar por fármaco, marca (ex: Zoloft, Rivotril), indicação..."
                className="w-full pl-10 pr-9 py-2 text-[14px] sm:text-[15px] bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white rounded-full border border-transparent focus:border-[#0066cc] dark:focus:border-[#2997ff] focus:bg-white dark:focus:bg-[#272729] focus:outline-none transition-all placeholder:text-[#7a7a7a]"
              />
              {filter.search && (
                <button
                  id="search-clear-btn"
                  onClick={() => onFilterChange({ search: '' })}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#7a7a7a] hover:text-[#1d1d1f] dark:hover:text-white"
                  aria-label="Limpar busca"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Desktop Action Controls */}
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              {/* Favorites toggle */}
              <button
                id="header-fav-btn"
                onClick={() => onFilterChange({ onlyFavorites: !filter.onlyFavorites })}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-all ${
                  filter.onlyFavorites
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                    : 'bg-[#f5f5f7] dark:bg-[#272729] text-[#1d1d1f] dark:text-white hover:bg-[#e0e0e0] dark:hover:bg-[#333333]'
                }`}
                title="Filtrar por medicamentos favoritados"
              >
                <Star className={`w-3.5 h-3.5 ${filter.onlyFavorites ? 'fill-amber-500 text-amber-500' : 'text-[#7a7a7a]'}`} />
                <span>Favoritos</span>
                {favoritesCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] flex items-center justify-center font-semibold">
                    {favoritesCount}
                  </span>
                )}
              </button>

              {/* View toggle (Cards vs Table) */}
              <div className="flex items-center p-0.5 rounded-full bg-[#f5f5f7] dark:bg-[#272729] border border-[#e0e0e0]/60 dark:border-[#333333]">
                <button
                  id="view-mode-cards-btn"
                  onClick={() => onViewModeChange('cards')}
                  className={`p-1.5 rounded-full transition-all ${
                    viewMode === 'cards'
                      ? 'bg-white dark:bg-[#121214] text-[#0066cc] dark:text-[#2997ff] shadow-xs'
                      : 'text-[#7a7a7a] hover:text-[#1d1d1f] dark:hover:text-white'
                  }`}
                  title="Modo Cards"
                  aria-label="Modo Cards"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  id="view-mode-table-btn"
                  onClick={() => onViewModeChange('table')}
                  className={`p-1.5 rounded-full transition-all ${
                    viewMode === 'table'
                      ? 'bg-white dark:bg-[#121214] text-[#0066cc] dark:text-[#2997ff] shadow-xs'
                      : 'text-[#7a7a7a] hover:text-[#1d1d1f] dark:hover:text-white'
                  }`}
                  title="Modo Tabela Clínica"
                  aria-label="Modo Tabela"
                >
                  <TableIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Info & Prescriptions Guide */}
              <button
                id="header-prescription-guide-btn"
                onClick={onOpenGuideModal}
                className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-medium bg-[#f5f5f7] dark:bg-[#272729] text-[#1d1d1f] dark:text-white hover:bg-[#e0e0e0] dark:hover:bg-[#333333] transition-colors"
                title="Guia de Receituários & Equivalências"
              >
                <FileText className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />
                <span className="hidden md:inline">Receituários</span>
              </button>

              {/* Theme toggle */}
              <button
                id="header-theme-toggle"
                onClick={onToggleDarkMode}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#f5f5f7] dark:bg-[#272729] text-[#1d1d1f] dark:text-white hover:bg-[#e8e8ed] dark:hover:bg-[#333333] border border-[#e0e0e0]/70 dark:border-[#333333] transition-all cursor-pointer shadow-xs active:scale-95"
                title={darkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
                aria-label={darkMode ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
              >
                {darkMode ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-xs font-medium text-amber-300">Escuro</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-700" />
                    <span className="text-xs font-medium text-[#1d1d1f]">Claro</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar inside header: quick counts */}
        <div className="flex items-center justify-between pt-2.5 text-xs text-[#7a7a7a] dark:text-[#cccccc]">
          <div className="flex items-center gap-2">
            <span>
              Mostrando <strong className="text-[#1d1d1f] dark:text-white font-semibold">{filteredCount}</strong> de {totalMedications} fármacos
            </span>
            {filter.search && (
              <span className="inline-flex items-center gap-1 text-[#0066cc] dark:text-[#2997ff]">
                <Sparkles className="w-3 h-3" /> Termo: "{filter.search}"
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 sm:hidden">
            {/* View Mode Toggle for mobile */}
            <button
              id="mobile-view-toggle"
              onClick={() => onViewModeChange(viewMode === 'cards' ? 'table' : 'cards')}
              className="flex items-center gap-1 text-xs font-medium text-[#0066cc] dark:text-[#2997ff]"
            >
              {viewMode === 'cards' ? (
                <>
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Ver Tabela</span>
                </>
              ) : (
                <>
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Ver Cards</span>
                </>
              )}
            </button>

            <button
              id="mobile-guide-btn"
              onClick={onOpenGuideModal}
              className="text-xs text-[#0066cc] dark:text-[#2997ff] flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Receituários</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
