
import { User, UserRole, IndustrialDocument, DocType, WorkCenter } from './types';

export const INITIAL_CENTERS: WorkCenter[] = [
  { id: 'c1', name: 'Planta Principal - Madrid', location: 'Getafe' },
  { id: 'c2', name: 'Centro Logístico - Barcelona', location: 'El Prat' }
];

export const INITIAL_USERS: User[] = [
  {
    id: '1',
    name: 'Administrador Sistema',
    email: 'admin@indudocs.com',
    role: UserRole.ADMIN,
    password: 'admin'
  },
  {
    id: '2',
    name: 'Juan Operario Madrid',
    email: 'juan@indudocs.com',
    role: UserRole.OPERARIO,
    password: 'user123',
    centerId: 'c1'
  }
];

export const INITIAL_DOCS: IndustrialDocument[] = [
  {
    id: 'd1',
    title: 'Procedimiento de Soldadura TIG',
    type: DocType.INSTRUCCION,
    category: 'Producción',
    driveUrl: 'https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'Instrucciones paso a paso para soldadura en acero inoxidable.',
    lastUpdated: '2023-10-15',
    centerId: 'c1'
  },
  {
    id: 'd2',
    title: 'Acetona Industrial - FDS',
    type: DocType.FDS,
    category: 'Químicos',
    driveUrl: 'https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'Ficha de datos de seguridad para el manejo de acetona.',
    lastUpdated: '2023-11-02',
    centerId: 'c1'
  },
  {
    id: 'd3',
    title: 'Manual Torno CNC Mazak',
    type: DocType.MANUAL,
    category: 'Mantenimiento',
    driveUrl: 'https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    description: 'Manual de usuario y mantenimiento preventivo.',
    lastUpdated: '2024-01-20',
    centerId: 'c2'
  }
];
