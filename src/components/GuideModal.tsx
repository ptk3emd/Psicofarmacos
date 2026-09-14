import React, { useEffect } from 'react';
import { X, FileText, CheckCircle2, ShieldCheck, AlertCircle, Syringe, Droplets } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="guide-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="guide-modal-content"
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-[#1c1c1e] text-[#1d1d1f] dark:text-white rounded-[24px] shadow-2xl border border-[#e0e0e0] dark:border-[#2a2a2c] overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#e0e0e0] dark:border-[#2a2a2c] bg-[#fafafc] dark:bg-[#222224] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0066cc]/10 dark:bg-[#2997ff]/20 text-[#0066cc] dark:text-[#2997ff] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                Guia de Receituários & Equivalências
              </h2>
              <p className="text-xs text-[#7a7a7a] dark:text-[#cccccc]">
                Regras regulatórias da ANVISA (Portaria SVS/MS nº 344/1998)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white dark:hover:bg-[#2c2c2e] text-[#7a7a7a] hover:text-[#1d1d1f] dark:hover:text-white transition-colors"
            aria-label="Fechar guia"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* Receitas Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-[#7a7a7a] dark:text-[#cccccc] uppercase tracking-wider">
              Tipos de Receituário no Brasil
            </h3>

            {/* Branca 2 vias */}
            <div className="p-4 rounded-2xl bg-[#fafafc] dark:bg-[#252527] border border-[#e0e0e0] dark:border-[#333333]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Receita de Controle Especial em 2 Vias (Branca)
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-medium">
                  Lista C1
                </span>
              </div>
              <p className="text-xs text-[#7a7a7a] dark:text-[#cccccc] leading-relaxed">
                Utilizada para <strong>Antidepressivos</strong> (ISRS, Tricíclicos, Duais, etc.), <strong>Antipsicóticos orais</strong> e certos ansiolíticos (Buspirona, Pregabalina).
                <br />
                • Validade: <strong>30 dias</strong> a partir da data de emissão em todo o território nacional.
                <br />
                • Quantidade máxima: até <strong>60 dias de tratamento</strong> (ou até 6 meses com justificativa CID em programas específicos). 1ª via retida na farmácia, 2ª via com o paciente.
              </p>
            </div>

            {/* Azul B */}
            <div className="p-4 rounded-2xl bg-[#fafafc] dark:bg-[#252527] border border-[#e0e0e0] dark:border-[#333333]">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-[#0066cc] dark:text-[#2997ff] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff]" />
                  Notificação de Receita B (Azul)
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-100 text-[#0066cc] dark:bg-sky-950/60 dark:text-[#2997ff] font-medium">
                  Lista B1 (Psicotrópicos)
                </span>
              </div>
              <p className="text-xs text-[#7a7a7a] dark:text-[#cccccc] leading-relaxed">
                Exigida para <strong>Benzodiazepínicos</strong> (Clonazepam, Diazepam, Alprazolam, Lorazepam...) e <strong>Indutores do Sono Z-Drugs</strong> (Zolpidem, Zopiclona, Eszopiclona) e associações com BZD (Limbitrol, Sulpan).
                <br />
                • Talão numerado fornecido pela Vigilância Sanitária local.
                <br />
                • Validade: <strong>30 dias</strong>. Quantidade restrita a <strong>60 dias de tratamento</strong>.
              </p>
            </div>
          </div>

          {/* Equivalências & Conversões Clínicas Importantes */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-[#7a7a7a] dark:text-[#cccccc] uppercase tracking-wider flex items-center gap-1.5">
              <Syringe className="w-4 h-4 text-[#0066cc] dark:text-[#2997ff]" />
              <span>Equivalências Posológicas do Guia</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#f5f5f7] dark:bg-[#252527] border border-[#e0e0e0]/70 dark:border-[#333333]">
                <div className="font-semibold text-[#1d1d1f] dark:text-white mb-1">
                  Haloperidol Oral vs Decanoato (IM)
                </div>
                <p className="text-[#7a7a7a] dark:text-[#cccccc] leading-relaxed">
                  1 ampola de 1mL (50mg) a cada 30 dias equivale a receber diariamente de <strong>2,5 a 3,3mg</strong> de Haldol oral.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f5f5f7] dark:bg-[#252527] border border-[#e0e0e0]/70 dark:border-[#333333]">
                <div className="font-semibold text-[#1d1d1f] dark:text-white mb-1">
                  Flufenazina Oral vs Enantato (IM)
                </div>
                <p className="text-[#7a7a7a] dark:text-[#cccccc] leading-relaxed">
                  10mg da forma oral equivale a <strong>12,5mg (0,5mL)</strong> da forma de depósito a cada 3 semanas.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f5f5f7] dark:bg-[#252527] border border-[#e0e0e0]/70 dark:border-[#333333]">
                <div className="font-semibold text-[#1d1d1f] dark:text-white mb-1 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />
                  <span>Gotas: Rivotril (Clonazepam)</span>
                </div>
                <p className="text-[#7a7a7a] dark:text-[#cccccc] leading-relaxed">
                  Frasco de 2,5mg/mL: <strong>1 gota = 0,1mg</strong>. Logo, 10 gotas = 1,0mg e 20 gotas = 2,0mg.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f5f5f7] dark:bg-[#252527] border border-[#e0e0e0]/70 dark:border-[#333333]">
                <div className="font-semibold text-[#1d1d1f] dark:text-white mb-1 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-[#0066cc] dark:text-[#2997ff]" />
                  <span>Gotas: Neuleptil (Periciazina)</span>
                </div>
                <p className="text-[#7a7a7a] dark:text-[#cccccc] leading-relaxed">
                  Solução 4%: <strong>1 gota = 1mg</strong>. Solução 1% pediátrica: <strong>1 gota = 0,25mg</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Cuidados Especiais em Farmacovigilância */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
            <div className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1.5 mb-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Regras de Farmacovigilância e Monitoramento Obrigatório</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-amber-900/90 dark:text-amber-200 leading-relaxed">
              <li><strong>Clozapina:</strong> Obrigatório hemograma semanal nos primeiros 6 meses e mensal após (risco de agranulocitose 1% e leucopenia 3%).</li>
              <li><strong>Agomelatina (Notificação 2024):</strong> Monitorar transaminases (TGO/TGP) no início e com 3, 6, 12 e 24 semanas (hepatotoxicidade).</li>
              <li><strong>Tranilcipromina (IMAO):</strong> Dieta restrita em tiramina (queijos envelhecidos, chopp, embutidos) sob risco de crise hipertensiva; aguardar 15 dias de washout ao trocar por ISRS.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e0e0e0] dark:border-[#2a2a2c] bg-[#fafafc] dark:bg-[#222224] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs font-semibold bg-[#1d1d1f] text-white dark:bg-white dark:text-[#1d1d1f] hover:opacity-90 transition-opacity"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
