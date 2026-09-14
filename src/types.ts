export type MedicationCategory = 
  | 'todos'
  | 'antidepressivos'
  | 'ansioliticos_outros'
  | 'benzodiazepinicos'
  | 'zdrugs'
  | 'antipsicoticos'
  | 'antipsicoticos_deposito'
  | 'associacoes';

export type PrescriptionType = 
  | 'receita_especial_branca' // Receituário de controle especial em 2 vias
  | 'receita_b_azul'          // Notificação de Receita B (Azul)
  | 'receita_c1_branca';      // Receita C1 de controle especial em 2 vias

export type SafetyLevel = 
  | 'segura' 
  | 'relativamente_segura' 
  | 'pouco_recomendada' 
  | 'contraindicada' 
  | 'sem_estudos'
  | 'cautela';

export interface Medication {
  id: string;
  name: string;
  commercialNames: string[];
  category: MedicationCategory;
  categoryName: string;
  subClass: string;
  presentations: string[];
  therapeuticRange: string;
  extremeDose?: string;
  pregnancy: {
    level: SafetyLevel;
    text: string;
  };
  lactation: {
    level: SafetyLevel;
    text: string;
  };
  idealPrescription: string;
  contraindications?: string[];
  warnings?: string[];
  specialNotes?: string[];
  prescriptionType: PrescriptionType;
  isDiscontinued?: boolean;
  composition?: string;
}

export interface FilterState {
  search: string;
  category: MedicationCategory;
  subClass: string;
  prescriptionType: 'all' | PrescriptionType;
  pregnancySafety: 'all' | 'segura' | 'contraindicada';
  showDiscontinued: boolean;
  onlyFavorites: boolean;
}
