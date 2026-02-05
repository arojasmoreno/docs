
export enum UserRole {
  ADMIN = 'ADMIN',
  OPERARIO = 'OPERARIO'
}

export enum DocType {
  INSTRUCCION = 'Instrucción de Trabajo',
  FDS = 'Ficha de Seguridad (FDS)',
  FT = 'Ficha Técnica (FT)',
  MANUAL = 'Manual de Máquina'
}

export type Language = 'es' | 'fr' | 'ar' | 'wo';

export interface WorkCenter {
  id: string;
  name: string;
  location?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
  centerId?: string; // ID del centro asignado
}

export interface IndustrialDocument {
  id: string;
  title: string;
  type: DocType;
  category: string;
  driveUrl: string;
  description: string;
  lastUpdated: string;
  centerId: string; // ID del centro al que pertenece
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export const getDocTypeKey = (type: DocType): string => {
  switch (type) {
    case DocType.INSTRUCCION: return 'doc_type_instruccion';
    case DocType.FDS: return 'doc_type_fds';
    case DocType.FT: return 'doc_type_ft';
    case DocType.MANUAL: return 'doc_type_manual';
    default: return '';
  }
};
