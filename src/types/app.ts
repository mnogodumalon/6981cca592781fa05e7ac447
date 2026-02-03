// AUTOMATICALLY GENERATED TYPES - DO NOT EDIT

export interface Uebungen {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    uebungsname?: string;
    kategorie?: 'krafttraining' | 'ausdauertraining' | 'flexibilitaet' | 'balance' | 'hiit' | 'cardio' | 'yoga' | 'pilates' | 'sonstiges';
    zielmuskeln?: string;
    beschreibung?: string;
  };
}

export interface Trainingsziele {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    zielbezeichnung?: string;
    zielkategorie?: 'gewichtsabnahme' | 'muskelaufbau' | 'ausdauer' | 'kraft' | 'flexibilitaet' | 'allgemeine_fitness' | 'sonstiges';
    zielwert?: string;
    zieldatum?: string; // Format: YYYY-MM-DD oder ISO String
    aktueller_status?: 'nicht_begonnen' | 'in_arbeit' | 'erreicht' | 'pausiert' | 'aufgegeben';
    notizen_ziel?: string;
  };
}

export interface Koerpermessungen {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    messdatum?: string; // Format: YYYY-MM-DD oder ISO String
    gewicht?: number;
    koerperfettanteil?: number;
    muskelmasse?: number;
    bauchumfang?: number;
    brustumfang?: number;
    hueftumfang?: number;
    oberarmumfang?: number;
    oberschenkelumfang?: number;
    notizen_messung?: string;
  };
}

export interface Trainingseinheiten {
  record_id: string;
  createdat: string;
  updatedat: string | null;
  fields: {
    trainingsdauer?: number;
    intensitaet?: 'sehr_leicht' | 'leicht' | 'mittel' | 'hoch' | 'sehr_hoch' | 'maximal';
    kalorien?: number;
    stimmung?: 'sehr_schlecht' | 'schlecht' | 'neutral' | 'gut' | 'sehr_gut' | 'ausgezeichnet';
    notizen_training?: string;
    trainingsdatum?: string; // Format: YYYY-MM-DD oder ISO String
    ausgefuehrte_uebungen?: string;
  };
}

export const APP_IDS = {
  UEBUNGEN: '6981cc8a4b3fbde2c92a2299',
  TRAININGSZIELE: '6981cc8f4250fc57a9a63a6e',
  KOERPERMESSUNGEN: '6981cc90bd34b0752d169796',
  TRAININGSEINHEITEN: '6981cc906bdf8cfb3e2d5422',
} as const;

// Helper Types for creating new records
export type CreateUebungen = Uebungen['fields'];
export type CreateTrainingsziele = Trainingsziele['fields'];
export type CreateKoerpermessungen = Koerpermessungen['fields'];
export type CreateTrainingseinheiten = Trainingseinheiten['fields'];