// AUTOMATICALLY GENERATED SERVICE
import { APP_IDS } from '@/types/app';
import type { Uebungen, Trainingsziele, Koerpermessungen, Trainingseinheiten } from '@/types/app';

// Base Configuration
const API_BASE_URL = 'https://my.living-apps.de/rest';

// --- HELPER FUNCTIONS ---
export function extractRecordId(url: string | null | undefined): string | null {
  if (!url) return null;
  // Extrahiere die letzten 24 Hex-Zeichen mit Regex
  const match = url.match(/([a-f0-9]{24})$/i);
  return match ? match[1] : null;
}

export function createRecordUrl(appId: string, recordId: string): string {
  return `https://my.living-apps.de/rest/apps/${appId}/records/${recordId}`;
}

async function callApi(method: string, endpoint: string, data?: any) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',  // Nutze Session Cookies für Auth
    body: data ? JSON.stringify(data) : undefined
  });
  if (!response.ok) throw new Error(await response.text());
  // DELETE returns often empty body or simple status
  if (method === 'DELETE') return true;
  return response.json();
}

export class LivingAppsService {
  // --- UEBUNGEN ---
  static async getUebungen(): Promise<Uebungen[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.UEBUNGEN}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getUebungenEntry(id: string): Promise<Uebungen | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.UEBUNGEN}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createUebungenEntry(fields: Uebungen['fields']) {
    return callApi('POST', `/apps/${APP_IDS.UEBUNGEN}/records`, { fields });
  }
  static async updateUebungenEntry(id: string, fields: Partial<Uebungen['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.UEBUNGEN}/records/${id}`, { fields });
  }
  static async deleteUebungenEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.UEBUNGEN}/records/${id}`);
  }

  // --- TRAININGSZIELE ---
  static async getTrainingsziele(): Promise<Trainingsziele[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.TRAININGSZIELE}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getTrainingszieleEntry(id: string): Promise<Trainingsziele | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.TRAININGSZIELE}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createTrainingszieleEntry(fields: Trainingsziele['fields']) {
    return callApi('POST', `/apps/${APP_IDS.TRAININGSZIELE}/records`, { fields });
  }
  static async updateTrainingszieleEntry(id: string, fields: Partial<Trainingsziele['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.TRAININGSZIELE}/records/${id}`, { fields });
  }
  static async deleteTrainingszieleEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.TRAININGSZIELE}/records/${id}`);
  }

  // --- KOERPERMESSUNGEN ---
  static async getKoerpermessungen(): Promise<Koerpermessungen[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.KOERPERMESSUNGEN}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getKoerpermessungenEntry(id: string): Promise<Koerpermessungen | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.KOERPERMESSUNGEN}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createKoerpermessungenEntry(fields: Koerpermessungen['fields']) {
    return callApi('POST', `/apps/${APP_IDS.KOERPERMESSUNGEN}/records`, { fields });
  }
  static async updateKoerpermessungenEntry(id: string, fields: Partial<Koerpermessungen['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.KOERPERMESSUNGEN}/records/${id}`, { fields });
  }
  static async deleteKoerpermessungenEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.KOERPERMESSUNGEN}/records/${id}`);
  }

  // --- TRAININGSEINHEITEN ---
  static async getTrainingseinheiten(): Promise<Trainingseinheiten[]> {
    const data = await callApi('GET', `/apps/${APP_IDS.TRAININGSEINHEITEN}/records`);
    return Object.entries(data).map(([id, rec]: [string, any]) => ({
      record_id: id, ...rec
    }));
  }
  static async getTrainingseinheitenEntry(id: string): Promise<Trainingseinheiten | undefined> {
    const data = await callApi('GET', `/apps/${APP_IDS.TRAININGSEINHEITEN}/records/${id}`);
    return { record_id: data.id, ...data };
  }
  static async createTrainingseinheitenEntry(fields: Trainingseinheiten['fields']) {
    return callApi('POST', `/apps/${APP_IDS.TRAININGSEINHEITEN}/records`, { fields });
  }
  static async updateTrainingseinheitenEntry(id: string, fields: Partial<Trainingseinheiten['fields']>) {
    return callApi('PATCH', `/apps/${APP_IDS.TRAININGSEINHEITEN}/records/${id}`, { fields });
  }
  static async deleteTrainingseinheitenEntry(id: string) {
    return callApi('DELETE', `/apps/${APP_IDS.TRAININGSEINHEITEN}/records/${id}`);
  }

}