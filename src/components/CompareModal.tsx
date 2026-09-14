import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  ArrowLeftRight, 
  Copy, 
  Baby, 
  AlertTriangle, 
  ShieldAlert, 
  Pill, 
  Check, 
  Search, 
  Layers, 
  FileText,
  Calendar,
  Info
} from 'lucide-react';
import { Medication } from '../types';
import { PRESCRIPTION_TYPES_INFO } from '../data/medications';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMedications: [Medication | null, Medication | null];
  allMedications: Medication[];
  onSelectSlot: (slot: 0 | 1, med: Medication | null) => void;
  onSwapSlots: () => void;
  onCopyPrescription: (text: string, drugName: string) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  selectedMedications,
  allMedications,
  onSelectSlot,
  onSwapSlots,
  onCopyPrescription,
}) => {
  const [slot0, slot1] = selectedMedications;

  // Active search query if user is picking for a slot
  const [searchSlot, setSearchSlot] = useState<0 | 1 | null>(null);
  const [pickerQuery, setPickerQuery] = useState<string>('');

  // Mobile active tab when on small screens
  const [mobileActiveSlot, setMobileActiveSlot] = useState<0 | 1>(0);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (searchSlot !== null) {
          setSearchSlot(null);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, searchSlot]);

  // Reset search when modal opens
  useEffect(() => {
    if (!isOpen) {
      setSearchSlot(null);
      setPickerQuery('');
    }
  }, [isOpen]);

  // Filtered list for the picker
  const filteredPickerMedications = useMemo(() => {
    const q = pickerQuery.toLowerCase().trim();
    if (!q) return allMedications;

    return allMedications.filter((m) => {
      const matchName = m.name.toLowerCase().includes(q);
      const matchCommercial = m.commercialNames.some((c) => c.toLowerCase().includes(q));
      const matchSubclass = m.subClass.toLowerCase().includes(q);
      const matchCategory = m.categoryName.toLowerCase().includes(q);
      return matchName || matchCommercial || matchSubclass || matchCategory;
    });
  }, [allMedications, pickerQuery]);

  if (!isOpen) return null;

  const handlePickForSlot = (slot: 0 | 1, med: Medication) => {
    onSelectSlot(slot, med);
    setSearchSlot(null);
    setPickerQuery('');
  };

  const renderSafetyBadge = (level: string) => {
    switch (level) {
      case 'segura':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
            <Check className="w-3 h-3" />
            <span>Segura</span>
          </span>
        );
      case 'relativamente_segura':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60">
            <Check className="w-3 h-3" />
            <span>Relativamente Segura</span>
          </span>
        );
      case 'contraindicada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
            <AlertTriangle className="w-3 h-3" />
            <span>Contraindicada</span>
          </span>
        );
      case 'pouco_recomendada':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
            <AlertTriangle className="w-3 h-3" />
            <span>Pouco Recomendada</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            <Info className="w-3 h-3" />
            <span>Cautela / Individualizar</span>
          </span>
        );
    }
  };

  return (
    <div
      id="compare-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="compare-modal-content"
        role="dialog"
        aria-modal="true"
        aria-label="Comparativo Clínico de Psicofármacos"
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white rounded-[24px] shadow-2xl border border-[#e0e0e0] dark:border-[#2a2a2c] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#e0e0e0] dark:border-[#2a2a2c] bg-[#fafafc] dark:bg-[#222224] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0066cc]/10 dark:bg-[#2997ff]/20 text-[#0066cc] dark:text-[#2997ff] flex items-center justify-center shrink-0">
              <ArrowLeftRight className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#1d1d1f] dark:text-white">
                Comparativo Clínico Farmacológico
              </h2>
              <p className="text-xs text-[#7a7a7a] dark:text-[#cccccc]">
                Comparação lado a lado de dosagens, titulações, receituário e segurança
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {slot0 && slot1 && (
              <button
                id="compare-swap-slots-btn"
                onClick={onSwapSlots}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white border border-[#e0e0e0] dark:border-[#3a3a3c] hover:border-[#0066cc] dark:hover:border-[#2997ff] transition-colors"
                title="Inverter lados do comparativo"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>Inverter</span>
              </button>
            )}

            <button
              id="compare-modal-close-btn"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white dark:hover:bg-[#2c2c2e] text-[#7a7a7a] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
              aria-label="Fechar comparativo"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher (Visible on < 640px) */}
        <div className="flex sm:hidden border-b border-[#e0e0e0] dark:border-[#2a2a2c] bg-[#f5f5f7] dark:bg-[#252527]">
          <button
            onClick={() => setMobileActiveSlot(0)}
            className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition-colors ${
              mobileActiveSlot === 0
                ? 'border-[#0066cc] text-[#0066cc] dark:border-[#2997ff] dark:text-[#2997ff] bg-white dark:bg-[#1c1c1e]'
                : 'border-transparent text-[#7a7a7a] dark:text-[#cccccc]'
            }`}
          >
            {slot0 ? slot0.name : '1º Fármaco'}
          </button>
          <button
            onClick={() => setMobileActiveSlot(1)}
            className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition-colors ${
              mobileActiveSlot === 1
                ? 'border-[#0066cc] text-[#0066cc] dark:border-[#2997ff] dark:text-[#2997ff] bg-white dark:bg-[#1c1c1e]'
                : 'border-transparent text-[#7a7a7a] dark:text-[#cccccc]'
            }`}
          >
            {slot1 ? slot1.name : '2º Fármaco'}
          </button>
        </div>

        {/* Modal Body / Comparison Matrix */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* Drug Selection / Header Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Slot 0 Card */}
            <div className={`p-4 rounded-2xl border transition-all ${
              mobileActiveSlot === 0 ? 'block' : 'hidden sm:block'
            } ${
              slot0 
                ? 'bg-[#fafafc] dark:bg-[#222225] border-[#e0e0e0] dark:border-[#333336]' 
                : 'bg-[#f5f5f7] dark:bg-[#1c1c1e] border-dashed border-[#cccccc] dark:border-[#3a3a3c]'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#0066cc] dark:text-[#2997ff] uppercase tracking-wider">
                  Fármaco 1
                </span>
                {slot0 && (
                  <button
                    onClick={() => setSearchSlot(0)}
                    className="text-xs text-[#7a7a7a] hover:text-[#1d1d1f] dark:text-[#cccccc] dark:hover:text-white underline-offset-4 hover:underline"
                  >
                    Trocar fármaco
                  </button>
                )}
              </div>

              {slot0 ? (
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white">
                      {slot0.name}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${PRESCRIPTION_TYPES_INFO[slot0.prescriptionType].badgeColor}`}>
                      {PRESCRIPTION_TYPES_INFO[slot0.prescriptionType].short}
                    </span>
                  </div>
                  <p className="text-xs text-[#7a7a7a] dark:text-[#cccccc] mt-0.5">
                    {slot0.subClass}
                  </p>
                  {slot0.composition ? (
                    <div className="text-xs text-[#0066cc] dark:text-[#2997ff] flex items-center gap-1 mt-1">
                      <Layers className="w-3.5 h-3.5" />
                      <span>{slot0.composition}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-[#7a7a7a] dark:text-[#cccccc] mt-1 truncate">
                      Refs: {slot0.commercialNames.join(', ')}
                    </p>
                  )}
                  <div className="mt-3">
                    <button
                      onClick={() => onCopyPrescription(
                        `${slot0.name}\nPosologia: ${slot0.idealPrescription}\nApresentações: ${slot0.presentations.join(', ')}`,
                        slot0.name
                      )}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white border border-[#e0e0e0] dark:border-[#3a3a3c] hover:bg-[#f5f5f7] dark:hover:bg-[#333333] transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copiar Posologia</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-xs text-[#7a7a7a] dark:text-[#cccccc] mb-3">
                    Nenhum fármaco selecionado para o primeiro lado
                  </p>
                  <button
                    onClick={() => setSearchSlot(0)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#0066cc] text-white hover:bg-[#0071e3] transition-colors"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Escolher fármaco</span>
                  </button>
                </div>
              )}
            </div>

            {/* Slot 1 Card */}
            <div className={`p-4 rounded-2xl border transition-all ${
              mobileActiveSlot === 1 ? 'block' : 'hidden sm:block'
            } ${
              slot1 
                ? 'bg-[#fafafc] dark:bg-[#222225] border-[#e0e0e0] dark:border-[#333336]' 
                : 'bg-[#f5f5f7] dark:bg-[#1c1c1e] border-dashed border-[#cccccc] dark:border-[#3a3a3c]'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#0066cc] dark:text-[#2997ff] uppercase tracking-wider">
                  Fármaco 2
                </span>
                {slot1 && (
                  <button
                    onClick={() => setSearchSlot(1)}
                    className="text-xs text-[#7a7a7a] hover:text-[#1d1d1f] dark:text-[#cccccc] dark:hover:text-white underline-offset-4 hover:underline"
                  >
                    Trocar fármaco
                  </button>
                )}
              </div>

              {slot1 ? (
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-xl font-bold text-[#1d1d1f] dark:text-white">
                      {slot1.name}
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${PRESCRIPTION_TYPES_INFO[slot1.prescriptionType].badgeColor}`}>
                      {PRESCRIPTION_TYPES_INFO[slot1.prescriptionType].short}
                    </span>
                  </div>
                  <p className="text-xs text-[#7a7a7a] dark:text-[#cccccc] mt-0.5">
                    {slot1.subClass}
                  </p>
                  {slot1.composition ? (
                    <div className="text-xs text-[#0066cc] dark:text-[#2997ff] flex items-center gap-1 mt-1">
                      <Layers className="w-3.5 h-3.5" />
                      <span>{slot1.composition}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-[#7a7a7a] dark:text-[#cccccc] mt-1 truncate">
                      Refs: {slot1.commercialNames.join(', ')}
                    </p>
                  )}
                  <div className="mt-3">
                    <button
                      onClick={() => onCopyPrescription(
                        `${slot1.name}\nPosologia: ${slot1.idealPrescription}\nApresentações: ${slot1.presentations.join(', ')}`,
                        slot1.name
                      )}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-[#2c2c2e] text-[#1d1d1f] dark:text-white border border-[#e0e0e0] dark:border-[#3a3a3c] hover:bg-[#f5f5f7] dark:hover:bg-[#333333] transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copiar Posologia</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <p className="text-xs text-[#7a7a7a] dark:text-[#cccccc] mb-3">
                    Selecione o segundo fármaco para comparar lado a lado
                  </p>
                  <button
                    onClick={() => setSearchSlot(1)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#0066cc] text-white hover:bg-[#0071e3] transition-colors"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Escolher fármaco</span>
                  </button>
                </div>
              )}
            </div>

          </div>

          {/* Quick Slot Drug Picker Overlay if user clicked "Escolher/Trocar" */}
          {searchSlot !== null && (
            <div className="p-4 rounded-2xl bg-[#fafafc] dark:bg-[#252528] border border-[#0066cc]/30 dark:border-[#2997ff]/40 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#0066cc] dark:text-[#2997ff] flex items-center gap-1.5">
                  <Search className="w-4 h-4" />
                  <span>Selecionar medicamento para o Fármaco {searchSlot + 1}</span>
                </span>
                <button
                  onClick={() => setSearchSlot(null)}
                  className="text-xs text-[#7a7a7a] hover:text-[#1d1d1f] dark:text-[#cccccc] dark:hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative mb-3">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#7a7a7a] dark:text-[#cccccc]" />
                <input
                  type="text"
                  value={pickerQuery}
                  onChange={(e) => setPickerQuery(e.target.value)}
                  placeholder="Pesquisar por nome, referência comercial ou classe..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-[#1c1c1e] text-xs sm:text-sm border border-[#e0e0e0] dark:border-[#3a3a3c] focus:outline-hidden focus:ring-2 focus:ring-[#0066cc] dark:focus:ring-[#2997ff] text-[#1d1d1f] dark:text-white"
                  autoFocus
                />
              </div>

              <div className="max-h-52 overflow-y-auto divide-y divide-[#e0e0e0]/70 dark:divide-[#333333] border border-[#e0e0e0] dark:border-[#3a3a3c] rounded-xl bg-white dark:bg-[#1c1c1e]">
                {filteredPickerMedications.map((med) => (
                  <button
                    key={med.id}
                    onClick={() => handlePickForSlot(searchSlot, med)}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-[#f5f5f7] dark:hover:bg-[#252527] transition-colors flex items-center justify-between gap-2 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-[#1d1d1f] dark:text-white mr-2">
                        {med.name}
                      </span>
                      <span className="text-[#7a7a7a] dark:text-[#cccccc]">
                        {med.subClass}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#7a7a7a] dark:text-[#cccccc] shrink-0">
                      {med.commercialNames.slice(0, 2).join(', ')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Comparison Sections */}
          {slot0 && slot1 ? (
            <div className="space-y-6">

              {/* 1. Intervalo Terapêutico & Doses */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#7a7a7a] dark:text-[#cccccc]">
                  <Pill className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />
                  <span>Dosagem & Intervalo Terapêutico</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  {/* Slot 0 */}
                  <div className={`p-4 rounded-xl bg-[#f5f5f7] dark:bg-[#252527] border border-[#e0e0e0]/70 dark:border-[#333333] ${
                    mobileActiveSlot === 0 ? 'block' : 'hidden sm:block'
                  }`}>
                    <div className="font-bold text-[#1d1d1f] dark:text-white text-base mb-1">
                      {slot0.therapeuticRange}
                    </div>
                    {slot0.extremeDose && (
                      <div className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1 mt-1 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>Dose extrema: {slot0.extremeDose}</span>
                      </div>
                    )}
                  </div>

                  {/* Slot 1 */}
                  <div className={`p-4 rounded-xl bg-[#f5f5f7] dark:bg-[#252527] border border-[#e0e0e0]/70 dark:border-[#333333] ${
                    mobileActiveSlot === 1 ? 'block' : 'hidden sm:block'
                  }`}>
                    <div className="font-bold text-[#1d1d1f] dark:text-white text-base mb-1">
                      {slot1.therapeuticRange}
                    </div>
                    {slot1.extremeDose && (
                      <div className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1 mt-1 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>Dose extrema: {slot1.extremeDose}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Prescrição Ideal & Titulação */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#7a7a7a] dark:text-[#cccccc]">
                  <Calendar className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />
                  <span>Prescrição Ideal & Titulação Recomendada</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  {/* Slot 0 */}
                  <div className={`p-4 rounded-xl bg-[#0066cc]/5 dark:bg-[#2997ff]/10 border border-[#0066cc]/20 dark:border-[#2997ff]/20 ${
                    mobileActiveSlot === 0 ? 'block' : 'hidden sm:block'
                  }`}>
                    <div className="text-[11px] font-semibold text-[#0066cc] dark:text-[#2997ff] uppercase tracking-wider mb-1">
                      {slot0.name}
                    </div>
                    <p className="leading-relaxed text-[#1d1d1f] dark:text-neutral-200">
                      {slot0.idealPrescription}
                    </p>
                  </div>

                  {/* Slot 1 */}
                  <div className={`p-4 rounded-xl bg-[#0066cc]/5 dark:bg-[#2997ff]/10 border border-[#0066cc]/20 dark:border-[#2997ff]/20 ${
                    mobileActiveSlot === 1 ? 'block' : 'hidden sm:block'
                  }`}>
                    <div className="text-[11px] font-semibold text-[#0066cc] dark:text-[#2997ff] uppercase tracking-wider mb-1">
                      {slot1.name}
                    </div>
                    <p className="leading-relaxed text-[#1d1d1f] dark:text-neutral-200">
                      {slot1.idealPrescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* 3. Apresentações Farmacêuticas */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#7a7a7a] dark:text-[#cccccc]">
                  <Pill className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />
                  <span>Apresentações no Mercado Brasileiro</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Slot 0 */}
                  <div className={`p-3.5 rounded-xl bg-[#fafafc] dark:bg-[#252527] border border-[#e0e0e0]/70 dark:border-[#333333] ${
                    mobileActiveSlot === 0 ? 'block' : 'hidden sm:block'
                  }`}>
                    <div className="flex flex-wrap gap-1.5">
                      {slot0.presentations.map((p, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white border border-[#e0e0e0] dark:border-[#333333]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Slot 1 */}
                  <div className={`p-3.5 rounded-xl bg-[#fafafc] dark:bg-[#252527] border border-[#e0e0e0]/70 dark:border-[#333333] ${
                    mobileActiveSlot === 1 ? 'block' : 'hidden sm:block'
                  }`}>
                    <div className="flex flex-wrap gap-1.5">
                      {slot1.presentations.map((p, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white border border-[#e0e0e0] dark:border-[#333333]">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. Gestação e Lactação */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#7a7a7a] dark:text-[#cccccc]">
                  <Baby className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />
                  <span>Segurança na Gestação & Lactação</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Slot 0 */}
                  <div className={`p-4 rounded-xl bg-[#fafafc] dark:bg-[#252527] border border-[#e0e0e0]/70 dark:border-[#333333] space-y-3 ${
                    mobileActiveSlot === 0 ? 'block' : 'hidden sm:block'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-[#1d1d1f] dark:text-white">Gestação</span>
                        {renderSafetyBadge(slot0.pregnancy.level)}
                      </div>
                      <p className="text-[#7a7a7a] dark:text-[#cccccc] leading-relaxed">
                        {slot0.pregnancy.text}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#e0e0e0]/70 dark:border-[#333333]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-[#1d1d1f] dark:text-white">Amamentação</span>
                        {renderSafetyBadge(slot0.lactation.level)}
                      </div>
                      <p className="text-[#7a7a7a] dark:text-[#cccccc] leading-relaxed">
                        {slot0.lactation.text}
                      </p>
                    </div>
                  </div>

                  {/* Slot 1 */}
                  <div className={`p-4 rounded-xl bg-[#fafafc] dark:bg-[#252527] border border-[#e0e0e0]/70 dark:border-[#333333] space-y-3 ${
                    mobileActiveSlot === 1 ? 'block' : 'hidden sm:block'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-[#1d1d1f] dark:text-white">Gestação</span>
                        {renderSafetyBadge(slot1.pregnancy.level)}
                      </div>
                      <p className="text-[#7a7a7a] dark:text-[#cccccc] leading-relaxed">
                        {slot1.pregnancy.text}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#e0e0e0]/70 dark:border-[#333333]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-[#1d1d1f] dark:text-white">Amamentação</span>
                        {renderSafetyBadge(slot1.lactation.level)}
                      </div>
                      <p className="text-[#7a7a7a] dark:text-[#cccccc] leading-relaxed">
                        {slot1.lactation.text}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. Alertas Clínicos & Monitoramento */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#7a7a7a] dark:text-[#cccccc]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Alertas Clínicos & Farmacovigilância</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Slot 0 */}
                  <div className={`p-4 rounded-xl bg-[#fafafc] dark:bg-[#252527] border border-[#e0e0e0]/70 dark:border-[#333333] space-y-2 ${
                    mobileActiveSlot === 0 ? 'block' : 'hidden sm:block'
                  }`}>
                    {slot0.contraindications && slot0.contraindications.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300">
                        <span className="font-semibold block mb-0.5">Contraindicações:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                          {slot0.contraindications.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {slot0.warnings && slot0.warnings.length > 0 ? (
                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300">
                        <span className="font-semibold block mb-0.5">Alertas:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                          {slot0.warnings.map((w, i) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-[#7a7a7a] dark:text-[#cccccc] italic">
                        Sem alertas críticos destacados.
                      </p>
                    )}
                  </div>

                  {/* Slot 1 */}
                  <div className={`p-4 rounded-xl bg-[#fafafc] dark:bg-[#252527] border border-[#e0e0e0]/70 dark:border-[#333333] space-y-2 ${
                    mobileActiveSlot === 1 ? 'block' : 'hidden sm:block'
                  }`}>
                    {slot1.contraindications && slot1.contraindications.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-800 dark:text-rose-300">
                        <span className="font-semibold block mb-0.5">Contraindicações:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                          {slot1.contraindications.map((c, i) => (
                            <li key={i}>{c}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {slot1.warnings && slot1.warnings.length > 0 ? (
                      <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300">
                        <span className="font-semibold block mb-0.5">Alertas:</span>
                        <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                          {slot1.warnings.map((w, i) => (
                            <li key={i}>{w}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-[#7a7a7a] dark:text-[#cccccc] italic">
                        Sem alertas críticos destacados.
                      </p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            <div className="py-12 text-center text-[#7a7a7a] dark:text-[#cccccc]">
              <p className="text-sm">
                Selecione dois psicofármacos acima para visualizar a comparação lado a lado detalhada.
              </p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#e0e0e0] dark:border-[#2a2a2c] bg-[#fafafc] dark:bg-[#222224] flex items-center justify-between">
          <div className="text-xs text-[#7a7a7a] dark:text-[#cccccc] hidden sm:block">
            Base de dados terapêutica comparativa
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] hover:opacity-90 transition-opacity ml-auto"
          >
            Concluir Comparação
          </button>
        </div>

      </div>
    </div>
  );
};
