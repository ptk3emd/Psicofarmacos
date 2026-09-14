import React, { useEffect } from 'react';
import { 
  X, 
  Copy, 
  Star, 
  AlertTriangle, 
  Baby, 
  ShieldAlert, 
  Pill, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Layers, 
  HeartHandshake, 
  Info
} from 'lucide-react';
import { Medication } from '../types';
import { PRESCRIPTION_TYPES_INFO } from '../data/medications';

interface MedicationModalProps {
  medication: Medication | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onCopyPrescription: (text: string, drugName: string) => void;
}

export const MedicationModal: React.FC<MedicationModalProps> = ({
  medication,
  onClose,
  isFavorite,
  onToggleFavorite,
  onCopyPrescription,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!medication) return null;

  const rxInfo = PRESCRIPTION_TYPES_INFO[medication.prescriptionType];

  const fullPrescriptionSnippet = `PRESCRIÇÃO CLÍNICA - ${medication.name.toUpperCase()}
Fármaco: ${medication.name} (${medication.subClass})
${medication.composition ? `Composição: ${medication.composition}\n` : ''}Nomes de referência: ${medication.commercialNames.join(', ')}
Apresentações: ${medication.presentations.join(' | ')}
Intervalo Terapêutico: ${medication.therapeuticRange}
Prescrição Sugerida: ${medication.idealPrescription}
Receituário: ${rxInfo.label} (${rxInfo.short})
Segurança: Gestação: ${medication.pregnancy.text} | Lactação: ${medication.lactation.text}`;

  return (
    <div
      id="medication-detail-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="medication-detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-medication-title"
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white rounded-[24px] shadow-2xl border border-[#e0e0e0] dark:border-[#2a2a2c] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-[#e0e0e0] dark:border-[#2a2a2c] bg-[#fafafc] dark:bg-[#222224] flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#0066cc]/10 text-[#0066cc] dark:bg-[#2997ff]/15 dark:text-[#2997ff]">
                {medication.categoryName}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#f5f5f7] dark:bg-[#2a2a2c] text-[#7a7a7a] dark:text-[#cccccc]">
                {medication.subClass}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${rxInfo.badgeColor}`}>
                {rxInfo.short}
              </span>
              {medication.isDiscontinued && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800">
                  Descontinuado
                </span>
              )}
            </div>

            <h2 id="modal-medication-title" className="text-2xl sm:text-3xl font-bold tracking-tight">
              {medication.name}
            </h2>

            {medication.composition && (
              <p className="text-sm font-medium text-[#0066cc] dark:text-[#2997ff] mt-1 flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                <span>Associação: {medication.composition}</span>
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              id="modal-fav-toggle-btn"
              onClick={() => onToggleFavorite(medication.id)}
              className="p-2 rounded-full hover:bg-white dark:hover:bg-[#2c2c2e] text-[#7a7a7a] hover:text-amber-500 transition-colors"
              title={isFavorite ? 'Remover dos favoritos' : 'Favoritar'}
              aria-label="Alternar favorito"
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
            </button>
            <button
              id="modal-close-btn"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white dark:hover:bg-[#2c2c2e] text-[#7a7a7a] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
              aria-label="Fechar janela"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Section: Prescrição Ideal & Posologia */}
          <div className="p-4 rounded-2xl bg-[#0066cc]/5 dark:bg-[#2997ff]/10 border border-[#0066cc]/20 dark:border-[#2997ff]/20">
            <div className="flex items-center gap-2 mb-2 text-[#0066cc] dark:text-[#2997ff] font-semibold text-sm">
              <Calendar className="w-4 h-4" />
              <span>Prescrição Ideal & Titulação</span>
            </div>
            <p className="text-[15px] leading-relaxed text-[#1d1d1f] dark:text-neutral-200">
              {medication.idealPrescription}
            </p>

            <div className="mt-4 pt-3 border-t border-[#0066cc]/15 dark:border-[#2997ff]/20 flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs text-[#7a7a7a] dark:text-[#cccccc]">
                <strong>Intervalo Terapêutico:</strong> {medication.therapeuticRange}
                {medication.extremeDose && ` • ${medication.extremeDose}`}
              </div>
              <button
                id="modal-copy-posology-btn"
                onClick={() => onCopyPrescription(fullPrescriptionSnippet, medication.name)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#0066cc] text-white hover:bg-[#0071e3] dark:bg-[#2997ff] dark:text-[#1d1d1f] transition-all active:scale-95 shadow-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Prescrição</span>
              </button>
            </div>
          </div>

          {/* Section: Apresentações */}
          <div>
            <h3 className="text-xs font-semibold text-[#7a7a7a] dark:text-[#cccccc] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff]" />
              <span>Apresentações Disponíveis</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {medication.presentations.map((pres, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#f5f5f7] dark:bg-[#252527] text-[#1d1d1f] dark:text-white border border-[#e0e0e0]/80 dark:border-[#333333]"
                >
                  {pres}
                </span>
              ))}
            </div>
          </div>

          {/* Section: Gravidez & Lactação */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-[#fafafc] dark:bg-[#222224] border border-[#e0e0e0] dark:border-[#2a2a2c]">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-[#7a7a7a] dark:text-[#cccccc] uppercase tracking-wider">
                <Baby className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff]" />
                <span>Gravidez</span>
              </div>
              <p className="text-sm font-medium text-[#1d1d1f] dark:text-white">
                {medication.pregnancy.text}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#fafafc] dark:bg-[#222224] border border-[#e0e0e0] dark:border-[#2a2a2c]">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-[#7a7a7a] dark:text-[#cccccc] uppercase tracking-wider">
                <HeartHandshake className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff]" />
                <span>Lactação</span>
              </div>
              <p className="text-sm font-medium text-[#1d1d1f] dark:text-white">
                {medication.lactation.text}
              </p>
            </div>
          </div>

          {/* Section: Nomes Comerciais */}
          {medication.commercialNames.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-[#7a7a7a] dark:text-[#cccccc] uppercase tracking-wider mb-2">
                Nomes Comerciais / Marcas de Referência
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {medication.commercialNames.map((name) => (
                  <span
                    key={name}
                    className="px-2.5 py-1 rounded-lg text-xs bg-[#f5f5f7] dark:bg-[#272729] text-[#1d1d1f] dark:text-white border border-[#e0e0e0]/70 dark:border-[#333333]"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Critical Warnings & Contraindications */}
          {((medication.warnings && medication.warnings.length > 0) || 
            (medication.contraindications && medication.contraindications.length > 0)) && (
            <div className="space-y-3">
              {medication.contraindications && medication.contraindications.length > 0 && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-900 dark:text-rose-200">
                  <div className="flex items-center gap-1.5 font-semibold text-xs uppercase tracking-wider text-rose-700 dark:text-rose-400 mb-2">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Contraindicações Formais</span>
                  </div>
                  <ul className="list-disc list-inside text-xs sm:text-sm space-y-1">
                    {medication.contraindications.map((contra, idx) => (
                      <li key={idx}>{contra}</li>
                    ))}
                  </ul>
                </div>
              )}

              {medication.warnings && medication.warnings.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200">
                  <div className="flex items-center gap-1.5 font-semibold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Alertas Clínicos Críticos</span>
                  </div>
                  <ul className="list-disc list-inside text-xs sm:text-sm space-y-1.5">
                    {medication.warnings.map((warn, idx) => (
                      <li key={idx} className="leading-relaxed">{warn}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Special notes */}
          {medication.specialNotes && medication.specialNotes.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-[#f5f5f7] dark:bg-[#252527] border border-[#e0e0e0]/70 dark:border-[#333333] text-xs text-[#7a7a7a] dark:text-[#cccccc] space-y-1">
              <div className="font-semibold text-[#1d1d1f] dark:text-white flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />
                <span>Observação Farmacológica</span>
              </div>
              {medication.specialNotes.map((note, idx) => (
                <p key={idx}>{note}</p>
              ))}
            </div>
          )}

          {/* Prescription Guide Info Box */}
          <div className="p-4 rounded-2xl bg-[#f5f5f7] dark:bg-[#222224] border border-[#e0e0e0]/60 dark:border-[#333333] text-xs text-[#7a7a7a] dark:text-[#cccccc]">
            <div className="flex items-center gap-1.5 font-semibold text-[#1d1d1f] dark:text-white mb-1">
              <FileText className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />
              <span>Exigência Legal de Receituário no Brasil</span>
            </div>
            <p className="leading-relaxed">
              <strong>{rxInfo.label}:</strong> {rxInfo.description}
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#e0e0e0] dark:border-[#2a2a2c] bg-[#fafafc] dark:bg-[#222224] flex items-center justify-between">
          <span className="text-xs text-[#7a7a7a] dark:text-[#cccccc]">
            Pressione <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-black/30 border border-[#e0e0e0] dark:border-[#333333] text-[10px] font-mono">Esc</kbd> para fechar
          </span>
          <button
            id="modal-bottom-close-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] hover:opacity-90 transition-opacity active:scale-95"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
