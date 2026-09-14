import React, { useState } from 'react';
import { 
  ArrowUpDown, 
  ChevronRight, 
  Star, 
  Baby, 
  Copy, 
  AlertTriangle,
  Layers,
  ArrowLeftRight
} from 'lucide-react';
import { Medication } from '../types';
import { PRESCRIPTION_TYPES_INFO } from '../data/medications';

interface TableViewProps {
  medications: Medication[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelect: (medication: Medication) => void;
  onCopyPrescription: (text: string, drugName: string) => void;
  compareIds?: string[];
  onToggleCompare?: (id: string) => void;
}

type SortField = 'name' | 'category' | 'subClass' | 'prescriptionType';

export const TableView: React.FC<TableViewProps> = ({
  medications,
  favorites,
  onToggleFavorite,
  onSelect,
  onCopyPrescription,
  compareIds = [],
  onToggleCompare,
}) => {
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedMedications = [...medications].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'name') cmp = a.name.localeCompare(b.name);
    else if (sortField === 'category') cmp = a.categoryName.localeCompare(b.categoryName);
    else if (sortField === 'subClass') cmp = a.subClass.localeCompare(b.subClass);
    else if (sortField === 'prescriptionType') cmp = a.prescriptionType.localeCompare(b.prescriptionType);

    return sortAsc ? cmp : -cmp;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-white dark:bg-[#1c1c1e] rounded-[20px] border border-[#e0e0e0] dark:border-[#2a2a2c] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#fafafc] dark:bg-[#252527] border-b border-[#e0e0e0] dark:border-[#2a2a2c] text-[#7a7a7a] dark:text-[#cccccc] font-medium text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4 w-10 text-center">Fav</th>
                <th className="py-3 px-4 cursor-pointer hover:text-[#1d1d1f] dark:hover:text-white" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1.5">
                    <span>Fármaco / Referências</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-[#1d1d1f] dark:hover:text-white" onClick={() => handleSort('subClass')}>
                  <div className="flex items-center gap-1.5">
                    <span>Classe Farmacológica</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Intervalo Terapêutico</th>
                <th className="py-3 px-4">Apresentações</th>
                <th className="py-3 px-4">Gestação</th>
                <th className="py-3 px-4" onClick={() => handleSort('prescriptionType')}>
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#1d1d1f] dark:hover:text-white">
                    <span>Receituário</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e0e0]/70 dark:divide-[#2a2a2c]">
              {sortedMedications.map((med) => {
                const isFav = favorites.includes(med.id);
                const isCompared = compareIds.includes(med.id);
                const rxInfo = PRESCRIPTION_TYPES_INFO[med.prescriptionType];

                return (
                  <tr
                    key={med.id}
                    id={`table-row-${med.id}`}
                    onClick={() => onSelect(med)}
                    className={`transition-colors cursor-pointer group ${
                      isCompared 
                        ? 'bg-[#0066cc]/10 dark:bg-[#2997ff]/15' 
                        : 'hover:bg-[#f5f5f7]/80 dark:hover:bg-[#252527]/80'
                    }`}
                  >
                    {/* Favorite cell */}
                    <td 
                      className="py-3.5 px-4 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(med.id);
                      }}
                    >
                      <button
                        className="p-1 rounded-full text-[#7a7a7a] hover:text-amber-500 transition-colors"
                        title={isFav ? 'Remover favorito' : 'Favoritar'}
                        aria-label={`Favoritar ${med.name}`}
                      >
                        <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
                      </button>
                    </td>

                    {/* Name & Brands */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#1d1d1f] dark:text-white group-hover:text-[#0066cc] dark:group-hover:text-[#2997ff] flex items-center gap-2">
                        <span>{med.name}</span>
                        {med.isDiscontinued && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded-full font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300">
                            Descontinuado
                          </span>
                        )}
                      </div>
                      {med.composition ? (
                        <div className="text-[11px] text-[#0066cc] dark:text-[#2997ff] flex items-center gap-1 mt-0.5">
                          <Layers className="w-3 h-3" />
                          <span>{med.composition}</span>
                        </div>
                      ) : (
                        <div className="text-[11px] text-[#7a7a7a] dark:text-[#cccccc] truncate max-w-[220px]">
                          {med.commercialNames.slice(0, 3).join(', ')}
                          {med.commercialNames.length > 3 && ` +${med.commercialNames.length - 3}`}
                        </div>
                      )}
                    </td>

                    {/* Subclass */}
                    <td className="py-3.5 px-4 text-xs text-[#333333] dark:text-[#cccccc]">
                      <span className="inline-block max-w-[180px] truncate" title={med.subClass}>
                        {med.subClass}
                      </span>
                    </td>

                    {/* Therapeutic Range */}
                    <td className="py-3.5 px-4 font-medium text-xs text-[#1d1d1f] dark:text-white whitespace-nowrap">
                      {med.therapeuticRange}
                    </td>

                    {/* Presentations */}
                    <td className="py-3.5 px-4 text-xs text-[#7a7a7a] dark:text-[#cccccc] max-w-[180px] truncate">
                      {med.presentations.join(', ')}
                    </td>

                    {/* Pregnancy */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                          med.pregnancy.level === 'segura'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                            : med.pregnancy.level === 'relativamente_segura'
                            ? 'bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300'
                            : med.pregnancy.level === 'contraindicada'
                            ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        <Baby className="w-3 h-3" />
                        <span>
                          {med.pregnancy.level === 'segura'
                            ? 'Segura'
                            : med.pregnancy.level === 'relativamente_segura'
                            ? 'Relat. Segura'
                            : med.pregnancy.level === 'contraindicada'
                            ? 'Contraind.'
                            : 'Cautela'}
                        </span>
                      </span>
                    </td>

                    {/* Prescription Type */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${rxInfo.badgeColor}`}>
                        {rxInfo.short}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {onToggleCompare && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleCompare(med.id);
                            }}
                            className={`p-1.5 rounded-full transition-colors ${
                              isCompared
                                ? 'bg-[#0066cc] text-white dark:bg-[#2997ff] dark:text-[#1d1d1f]'
                                : 'text-[#7a7a7a] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-white dark:hover:bg-[#333333]'
                            }`}
                            title={isCompared ? 'Remover da comparação' : 'Comparar fármaco'}
                            aria-label={`Comparar ${med.name}`}
                          >
                            <ArrowLeftRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCopyPrescription(
                              `${med.name}\nPosologia: ${med.idealPrescription}`,
                              med.name
                            );
                          }}
                          className="p-1.5 rounded-full text-[#7a7a7a] hover:text-[#1d1d1f] dark:hover:text-white hover:bg-white dark:hover:bg-[#333333] transition-colors"
                          title="Copiar posologia"
                          aria-label="Copiar posologia"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onSelect(med)}
                          className="p-1.5 rounded-full text-[#0066cc] dark:text-[#2997ff] hover:bg-[#0066cc]/10 dark:hover:bg-[#2997ff]/20 transition-colors"
                          title="Ver detalhes"
                          aria-label="Ver detalhes"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
