import React, { useState, useEffect, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  RotateCcw, 
  Pill, 
  Info, 
  BookOpen, 
  ShieldCheck, 
  FileText, 
  ArrowUp,
  Sparkles,
  Heart
} from 'lucide-react';
import { Medication, FilterState, MedicationCategory } from './types';
import { MEDICATIONS, CATEGORIES_CONFIG } from './data/medications';
import { Header } from './components/Header';
import { CategoryNav } from './components/CategoryNav';
import { FilterBar } from './components/FilterBar';
import { MedicationCard } from './components/MedicationCard';
import { MedicationModal } from './components/MedicationModal';
import { TableView } from './components/TableView';
import { GuideModal } from './components/GuideModal';
import { CompareBar } from './components/CompareBar';
import { CompareModal } from './components/CompareModal';
import { Toast } from './components/Toast';

const INITIAL_FILTER: FilterState = {
  search: '',
  category: 'todos',
  subClass: 'all',
  prescriptionType: 'all',
  pregnancySafety: 'all',
  showDiscontinued: false,
  onlyFavorites: false,
};

export default function App() {
  // Dark mode state with localStorage persistence
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('psico_dark_mode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Filter state
  const [filter, setFilter] = useState<FilterState>(INITIAL_FILTER);

  // View mode (cards or dense table)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Favorites state with localStorage persistence
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('psico_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Selected medication for details modal
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

  // Compare state (up to 2 medications)
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(false);

  // Guide modal state
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Scroll to top button visibility
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // Sync dark mode class on HTML document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('psico_dark_mode', String(darkMode));
  }, [darkMode]);

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('psico_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Scroll listener for back-to-top
  useEffect(() => {
    const checkScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      showToast(next ? 'Modo escuro ativado' : 'Modo claro ativado', 'info');
      return next;
    });
  };

  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilter((prev) => ({
      ...prev,
      ...updates,
      // If category changes, reset subclass unless specified
      ...(updates.category && !updates.subClass ? { subClass: 'all' } : {}),
    }));
  };

  const handleResetFilters = () => {
    setFilter(INITIAL_FILTER);
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      showToast(exists ? 'Removido dos favoritos' : 'Adicionado aos favoritos!', 'info');
      return updated;
    });
  };

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((curr) => (curr?.message === message ? null : curr));
    }, 3200);
  };

  const handleCopyPrescription = async (text: string, drugName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`Posologia de ${drugName} copiada para a área de transferência!`, 'success');
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      showToast(`Posologia de ${drugName} copiada!`, 'success');
    }
  };

  const handleToggleCompare = (id: string) => {
    setCompareIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast('Fármaco removido da comparação', 'info');
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 2) {
        showToast('Limite de 2 fármacos atingido. Substituindo o segundo fármaco.', 'info');
        return [prev[0], id];
      }
      const updated = [...prev, id];
      if (updated.length === 1) {
        showToast('1 fármaco selecionado. Selecione o segundo para comparar lado a lado.', 'info');
      } else {
        showToast('2 fármacos selecionados! Pronto para comparar.', 'info');
      }
      return updated;
    });
  };

  const handleSelectCompareSlot = (slot: 0 | 1, med: Medication | null) => {
    setCompareIds((prev) => {
      const slot0 = prev[0] || null;
      const slot1 = prev[1] || null;
      if (slot === 0) {
        if (!med) return slot1 ? [slot1] : [];
        return slot1 ? [med.id, slot1] : [med.id];
      } else {
        if (!med) return slot0 ? [slot0] : [];
        return slot0 ? [slot0, med.id] : [med.id];
      }
    });
  };

  const handleSwapCompareSlots = () => {
    setCompareIds((prev) => {
      if (prev.length < 2) return prev;
      return [prev[1], prev[0]];
    });
  };

  const handleClearCompare = () => {
    setCompareIds([]);
    showToast('Seleção de comparação limpa', 'info');
  };

  // Compute available subclasses for the current category
  const availableSubclasses = useMemo(() => {
    const medsToScan = filter.category === 'todos' 
      ? MEDICATIONS 
      : MEDICATIONS.filter((m) => m.category === filter.category);
    
    const set = new Set<string>();
    medsToScan.forEach((m) => {
      if (m.subClass) set.add(m.subClass);
    });
    return Array.from(set).sort();
  }, [filter.category]);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<MedicationCategory, number> = {
      todos: 0,
      antidepressivos: 0,
      ansioliticos_outros: 0,
      benzodiazepinicos: 0,
      zdrugs: 0,
      antipsicoticos: 0,
      antipsicoticos_deposito: 0,
      associacoes: 0,
    };

    MEDICATIONS.forEach((med) => {
      // If user is searching or favorites filter is active, respect that in counts
      if (filter.onlyFavorites && !favorites.includes(med.id)) return;
      if (!filter.showDiscontinued && med.isDiscontinued) return;

      counts.todos++;
      if (counts[med.category] !== undefined) {
        counts[med.category]++;
      }
    });

    return counts;
  }, [favorites, filter.onlyFavorites, filter.showDiscontinued]);

  // Filtered medications list
  const filteredMedications = useMemo(() => {
    const searchTrimmed = filter.search.toLowerCase().trim();

    return MEDICATIONS.filter((med) => {
      // Discontinued filter
      if (!filter.showDiscontinued && med.isDiscontinued) {
        return false;
      }

      // Favorites filter
      if (filter.onlyFavorites && !favorites.includes(med.id)) {
        return false;
      }

      // Category filter
      if (filter.category !== 'todos' && med.category !== filter.category) {
        return false;
      }

      // Subclass filter
      if (filter.subClass !== 'all' && med.subClass !== filter.subClass) {
        return false;
      }

      // Prescription type filter
      if (filter.prescriptionType !== 'all' && med.prescriptionType !== filter.prescriptionType) {
        return false;
      }

      // Pregnancy safety filter
      if (filter.pregnancySafety === 'segura') {
        if (med.pregnancy.level !== 'segura' && med.pregnancy.level !== 'relativamente_segura') {
          return false;
        }
      } else if (filter.pregnancySafety === 'contraindicada') {
        if (med.pregnancy.level !== 'contraindicada') {
          return false;
        }
      }

      // Search text filter across name, trade brands, subclass, presentations, composition, ideal prescription
      if (searchTrimmed) {
        const matchesName = med.name.toLowerCase().includes(searchTrimmed);
        const matchesCommercial = med.commercialNames.some((c) => c.toLowerCase().includes(searchTrimmed));
        const matchesSubClass = med.subClass.toLowerCase().includes(searchTrimmed);
        const matchesPres = med.presentations.some((p) => p.toLowerCase().includes(searchTrimmed));
        const matchesComposition = med.composition?.toLowerCase().includes(searchTrimmed);
        const matchesPrescription = med.idealPrescription.toLowerCase().includes(searchTrimmed);

        if (!matchesName && !matchesCommercial && !matchesSubClass && !matchesPres && !matchesComposition && !matchesPrescription) {
          return false;
        }
      }

      return true;
    });
  }, [filter, favorites]);

  const hasActiveFilters = 
    filter.search !== '' ||
    filter.category !== 'todos' ||
    filter.subClass !== 'all' ||
    filter.prescriptionType !== 'all' ||
    filter.pregnancySafety !== 'all' ||
    filter.showDiscontinued ||
    filter.onlyFavorites;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f7] dark:bg-[#121214] text-[#1d1d1f] dark:text-white transition-colors duration-200">
      
      {/* Frosted Global Top Header */}
      <Header
        filter={filter}
        onFilterChange={handleFilterChange}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        favoritesCount={favorites.length}
        totalMedications={MEDICATIONS.length}
        filteredCount={filteredMedications.length}
        onOpenGuideModal={() => setIsGuideOpen(true)}
      />

      {/* Category Nav Bar */}
      <div className="bg-white/70 dark:bg-[#18181a]/70 border-b border-[#e0e0e0]/70 dark:border-[#2a2a2c] backdrop-blur-xs">
        <CategoryNav
          selectedCategory={filter.category}
          onSelectCategory={(cat) => handleFilterChange({ category: cat })}
          counts={categoryCounts}
        />
      </div>

      {/* Detailed Filters Bar */}
      <FilterBar
        filter={filter}
        onFilterChange={handleFilterChange}
        availableSubclasses={availableSubclasses}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Active category banner / title */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] dark:text-white">
              {filter.category === 'todos' 
                ? 'Todos os Psicofármacos' 
                : CATEGORIES_CONFIG.find((c) => c.id === filter.category)?.label}
            </h2>
            <p className="text-xs text-[#7a7a7a] dark:text-[#cccccc] mt-0.5">
              {filter.category === 'todos'
                ? 'Catálogo completo ordenado por classes clínicas, intervalos terapêuticos e apresentações'
                : `Filtro ativo: ${CATEGORIES_CONFIG.find((c) => c.id === filter.category)?.label} (${filteredMedications.length} fármacos)`}
            </p>
          </div>

          {/* Quick link buttons for high-yield classes */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs">
            <span className="text-[#7a7a7a] dark:text-[#cccccc]">Atalhos:</span>
            <button
              onClick={() => handleFilterChange({ category: 'antidepressivos', subClass: 'ISRS (Inib. Selet. Recap. Serotonina)' })}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-[#252527] border border-[#e0e0e0] dark:border-[#333333] hover:border-[#0066cc] dark:hover:border-[#2997ff] text-[#1d1d1f] dark:text-white transition-colors"
            >
              ISRS
            </button>
            <button
              onClick={() => handleFilterChange({ category: 'benzodiazepinicos' })}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-[#252527] border border-[#e0e0e0] dark:border-[#333333] hover:border-[#0066cc] dark:hover:border-[#2997ff] text-[#1d1d1f] dark:text-white transition-colors"
            >
              Benzodiazepínicos
            </button>
            <button
              onClick={() => handleFilterChange({ category: 'zdrugs' })}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-[#252527] border border-[#e0e0e0] dark:border-[#333333] hover:border-[#0066cc] dark:hover:border-[#2997ff] text-[#1d1d1f] dark:text-white transition-colors"
            >
              Z-Drugs
            </button>
            <button
              onClick={() => handleFilterChange({ category: 'antipsicoticos_deposito' })}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-[#252527] border border-[#e0e0e0] dark:border-[#333333] hover:border-[#0066cc] dark:hover:border-[#2997ff] text-[#1d1d1f] dark:text-white transition-colors"
            >
              Depósito (IM)
            </button>
          </div>
        </div>

        {/* Results view: Cards vs Table */}
        {filteredMedications.length > 0 ? (
          viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredMedications.map((med) => (
                <MedicationCard
                  key={med.id}
                  medication={med}
                  isFavorite={favorites.includes(med.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onSelect={setSelectedMedication}
                  onCopyPrescription={handleCopyPrescription}
                  searchQuery={filter.search}
                  isSelectedForCompare={compareIds.includes(med.id)}
                  onToggleCompare={handleToggleCompare}
                />
              ))}
            </div>
          ) : (
            <TableView
              medications={filteredMedications}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelect={setSelectedMedication}
              onCopyPrescription={handleCopyPrescription}
              compareIds={compareIds}
              onToggleCompare={handleToggleCompare}
            />
          )
        ) : (
          /* Empty state */
          <div className="py-16 px-4 text-center bg-white dark:bg-[#1c1c1e] rounded-[24px] border border-[#e0e0e0] dark:border-[#2a2a2c] my-4">
            <div className="w-14 h-14 rounded-full bg-[#f5f5f7] dark:bg-[#272729] text-[#7a7a7a] dark:text-[#cccccc] flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-[#1d1d1f] dark:text-white mb-1">
              Nenhum fármaco encontrado
            </h3>
            <p className="text-sm text-[#7a7a7a] dark:text-[#cccccc] max-w-md mx-auto mb-6">
              Nenhum resultado corresponde aos critérios de busca ou filtros selecionados. Tente ajustar o termo de pesquisa ou limpar os filtros.
            </p>
            <button
              id="empty-state-reset-btn"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#0066cc] text-white hover:bg-[#0071e3] dark:bg-[#2997ff] dark:text-[#1d1d1f] transition-all active:scale-95 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar filtros e busca</span>
            </button>
          </div>
        )}

      </main>

      {/* Floating back-to-top button */}
      {showScrollTop && (
        <button
          id="scroll-to-top-btn"
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-40 p-3 rounded-full bg-white dark:bg-[#272729] text-[#1d1d1f] dark:text-white border border-[#e0e0e0] dark:border-[#333333] shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
          title="Voltar ao topo"
          aria-label="Voltar ao topo"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Minimal Footer */}
      <footer className="mt-auto border-t border-[#e0e0e0] dark:border-[#2a2a2c] bg-[#fafafc] dark:bg-[#18181a] py-8 text-xs text-[#7a7a7a] dark:text-[#cccccc]">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Pill className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff]" />
            <span className="font-semibold text-[#1d1d1f] dark:text-white">
              Guia Prático de Psicofármacos
            </span>
            <span>• Base de consulta rápida</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-[#0066cc] dark:hover:text-[#2997ff] underline-offset-4 hover:underline transition-colors"
            >
              Regras de Receituário
            </button>
            <span>•</span>
            <span className="text-[11px]">
              Uso acadêmico e profissional de referência
            </span>
          </div>
        </div>
      </footer>

      {/* Floating Compare Bar */}
      <CompareBar
        selectedIds={compareIds}
        medications={MEDICATIONS}
        onOpenModal={() => setIsCompareModalOpen(true)}
        onRemove={handleToggleCompare}
        onClear={handleClearCompare}
      />

      {/* Side-by-side Compare Modal */}
      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        selectedMedications={[
          MEDICATIONS.find((m) => m.id === compareIds[0]) || null,
          MEDICATIONS.find((m) => m.id === compareIds[1]) || null,
        ]}
        allMedications={MEDICATIONS}
        onSelectSlot={handleSelectCompareSlot}
        onSwapSlots={handleSwapCompareSlots}
        onCopyPrescription={handleCopyPrescription}
      />

      {/* Detail Modal */}
      <MedicationModal
        medication={selectedMedication}
        onClose={() => setSelectedMedication(null)}
        isFavorite={selectedMedication ? favorites.includes(selectedMedication.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onCopyPrescription={handleCopyPrescription}
      />

      {/* Prescription & Conversion Reference Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}
