import React from 'react';
import { 
  Pill, 
  Brain, 
  ShieldCheck, 
  Moon, 
  Sparkles, 
  Zap, 
  Syringe, 
  Layers 
} from 'lucide-react';
import { MedicationCategory } from '../types';
import { CATEGORIES_CONFIG } from '../data/medications';

interface CategoryNavProps {
  selectedCategory: MedicationCategory;
  onSelectCategory: (cat: MedicationCategory) => void;
  counts: Record<MedicationCategory, number>;
}

const ICONS_MAP: Record<string, React.ReactNode> = {
  Pill: <Pill className="w-3.5 h-3.5" />,
  Brain: <Brain className="w-3.5 h-3.5" />,
  ShieldCheck: <ShieldCheck className="w-3.5 h-3.5" />,
  Moon: <Moon className="w-3.5 h-3.5" />,
  Sparkles: <Sparkles className="w-3.5 h-3.5" />,
  Zap: <Zap className="w-3.5 h-3.5" />,
  Syringe: <Syringe className="w-3.5 h-3.5" />,
  Layers: <Layers className="w-3.5 h-3.5" />,
};

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
  counts,
}) => {
  return (
    <nav aria-label="Navegação por categorias" className="w-full overflow-x-auto py-2.5 no-scrollbar">
      <div className="flex items-center gap-2 min-w-max px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {CATEGORIES_CONFIG.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = counts[cat.id as MedicationCategory] || 0;

          return (
            <button
              key={cat.id}
              id={`cat-nav-btn-${cat.id}`}
              onClick={() => onSelectCategory(cat.id as MedicationCategory)}
              className={`group flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 active:scale-95 ${
                isSelected
                  ? 'bg-[#0066cc] text-white shadow-sm shadow-[#0066cc]/25 dark:bg-[#2997ff] dark:text-[#1d1d1f]'
                  : 'bg-[#f5f5f7] dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-[#cccccc] hover:bg-[#e8e8ed] dark:hover:bg-[#272729] border border-transparent dark:border-[#2a2a2c]'
              }`}
            >
              <span className={`${isSelected ? 'text-white dark:text-[#1d1d1f]' : 'text-[#0066cc] dark:text-[#2997ff]'}`}>
                {ICONS_MAP[cat.icon]}
              </span>
              <span>{cat.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-semibold ${
                  isSelected
                    ? 'bg-white/25 text-white dark:bg-black/15 dark:text-[#1d1d1f]'
                    : 'bg-[#e0e0e0] dark:bg-[#2a2a2c] text-[#7a7a7a] dark:text-[#cccccc]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
