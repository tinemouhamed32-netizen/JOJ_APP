export type ReservationStatus =
  | 'En attente'
  | 'Confirmée'
  | 'En route'
  | 'Terminée';

export interface Reservation {
  id: string;
  fullName: string;
  role: 'Athlète' | 'Officiel' | 'Média' | 'VIP';
  transportType: 'Bus' | 'Taxi' | 'Navette' | 'VIP';
  departure: string;
  destination: string;
  date: string;
  time: string;
  passengers: number;
  priority: 'Standard' | 'Haute' | 'Critique';
  comment?: string;
  status: ReservationStatus;
  assignedVehicle?: string;
  eta: string;
  createdAt: string;
}

export const JOJ_LOCATIONS = [
  'Stade Abdoulaye Wade',
  'Village Olympique Diamniadio',
  'Dakar Arena',
  'Aéroport AIBD',
  'Centre Médical',
  'Hôtel Radisson Dakar',
  "Place de l’Indépendance",
];

export function generateReservationId() {
  return `JOJ-RES-2026-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function generateETA() {
  return `${10 + Math.floor(Math.random() * 40)} min`;
}