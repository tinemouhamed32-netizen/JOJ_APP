export type TransportType = "Bus" | "Taxi" | "Navette" | "VIP";
export type TransportStatus = "Prêt" | "En route" | "En attente" | "Complété" | "Retard";
export type Priority = "Standard" | "Haute" | "Critique";

export type LatLng = { lat: number; lng: number };

export type Vehicle = {
  id: string;
  type: TransportType;
  status: TransportStatus;
  priority: Priority;
  routeName: string;
  origin: string;
  destination: string;
  passengers: string;
  capacity: number;
  driver: string;
  plate: string;
  eta: string; // HH:MM
  delayMin: number;
  weather: string;
  path: LatLng[]; // polyline waypoints
  progress: number; // 0..1 along path
  speedKmh: number;
};

// Key Dakar landmarks (approximate coords)
export const LANDMARKS = {
  stadeAbdoulayeWade: { lat: 14.7416, lng: -17.2256, name: "Stade Abdoulaye Wade" },
  villageOlympique: { lat: 14.7589, lng: -17.3658, name: "Village Olympique Diamniadio" },
  aeroport: { lat: 14.6708, lng: -17.0734, name: "Aéroport AIBD" },
  hotelGuest: { lat: 14.6928, lng: -17.4467, name: "Hôtel Radisson Dakar" },
  arena: { lat: 14.7521, lng: -17.3122, name: "Dakar Arena" },
  centreMedical: { lat: 14.7305, lng: -17.4612, name: "Centre Médical Principal" },
  centreVille: { lat: 14.6928, lng: -17.4467, name: "Place de l'Indépendance" },
};

export const DAKAR_CENTER: LatLng = { lat: 14.725, lng: -17.3 };

// Build smooth-ish paths between landmarks using a couple of interpolated waypoints.
function buildPath(a: LatLng, b: LatLng, jitter = 0.01): LatLng[] {
  const mid1 = {
    lat: a.lat + (b.lat - a.lat) * 0.33 + (Math.random() - 0.5) * jitter,
    lng: a.lng + (b.lng - a.lng) * 0.33 + (Math.random() - 0.5) * jitter,
  };
  const mid2 = {
    lat: a.lat + (b.lat - a.lat) * 0.66 + (Math.random() - 0.5) * jitter,
    lng: a.lng + (b.lng - a.lng) * 0.66 + (Math.random() - 0.5) * jitter,
  };
  return [a, mid1, mid2, b];
}

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: "JOJ-B01",
    type: "Bus",
    status: "En route",
    priority: "Haute",
    routeName: "Stade → Village Olympique",
    origin: LANDMARKS.stadeAbdoulayeWade.name,
    destination: LANDMARKS.villageOlympique.name,
    passengers: "32 athlètes — Équipe Sénégal",
    capacity: 45,
    driver: "Moussa Diop",
    plate: "DK 2026 AB",
    eta: "08:20",
    delayMin: 0,
    weather: "☀️ 28° ensoleillé",
    path: buildPath(LANDMARKS.stadeAbdoulayeWade, LANDMARKS.villageOlympique),
    progress: 0.15,
    speedKmh: 48,
  },
  {
    id: "JOJ-T02",
    type: "Taxi",
    status: "Prêt",
    priority: "Standard",
    routeName: "Hôtel Radisson → Stade",
    origin: LANDMARKS.hotelGuest.name,
    destination: LANDMARKS.stadeAbdoulayeWade.name,
    passengers: "3 invités fédération",
    capacity: 4,
    driver: "Awa Faye",
    plate: "DK 1842 CT",
    eta: "08:35",
    delayMin: 0,
    weather: "☀️ 27°",
    path: buildPath(LANDMARKS.hotelGuest, LANDMARKS.stadeAbdoulayeWade),
    progress: 0,
    speedKmh: 0,
  },
  {
    id: "JOJ-N03",
    type: "Navette",
    status: "En attente",
    priority: "Haute",
    routeName: "Centre Médical → Village",
    origin: LANDMARKS.centreMedical.name,
    destination: LANDMARKS.villageOlympique.name,
    passengers: "Équipe médicale (6)",
    capacity: 12,
    driver: "Ibrahima Ndiaye",
    plate: "DK 7720 MD",
    eta: "08:50",
    delayMin: 4,
    weather: "🌤️ 29°",
    path: buildPath(LANDMARKS.centreMedical, LANDMARKS.villageOlympique),
    progress: 0.05,
    speedKmh: 12,
  },
  {
    id: "JOJ-V04",
    type: "VIP",
    status: "En route",
    priority: "Critique",
    routeName: "Aéroport → Village JOJ",
    origin: LANDMARKS.aeroport.name,
    destination: LANDMARKS.villageOlympique.name,
    passengers: "Dignitaires CIO",
    capacity: 6,
    driver: "Cheikh Sarr",
    plate: "DK 0001 VIP",
    eta: "09:05",
    delayMin: 0,
    weather: "☀️ 28°",
    path: buildPath(LANDMARKS.aeroport, LANDMARKS.villageOlympique, 0.005),
    progress: 0.25,
    speedKmh: 72,
  },
  {
    id: "JOJ-B05",
    type: "Bus",
    status: "Complété",
    priority: "Standard",
    routeName: "Dakar Arena → Stade",
    origin: LANDMARKS.arena.name,
    destination: LANDMARKS.stadeAbdoulayeWade.name,
    passengers: "Équipe judo (28)",
    capacity: 45,
    driver: "Fatou Sow",
    plate: "DK 3091 AB",
    eta: "07:55",
    delayMin: 0,
    weather: "☀️ 26°",
    path: buildPath(LANDMARKS.arena, LANDMARKS.stadeAbdoulayeWade),
    progress: 1,
    speedKmh: 0,
  },
  {
    id: "JOJ-N06",
    type: "Navette",
    status: "En route",
    priority: "Haute",
    routeName: "Village → Arena",
    origin: LANDMARKS.villageOlympique.name,
    destination: LANDMARKS.arena.name,
    passengers: "Officiels techniques",
    capacity: 12,
    driver: "Mariama Ba",
    plate: "DK 6612 NV",
    eta: "08:42",
    delayMin: 7,
    weather: "🌤️ 28°",
    path: buildPath(LANDMARKS.villageOlympique, LANDMARKS.arena),
    progress: 0.45,
    speedKmh: 38,
  },
  {
    id: "JOJ-T07",
    type: "Taxi",
    status: "En route",
    priority: "Standard",
    routeName: "Place Indépendance → Hôtel",
    origin: LANDMARKS.centreVille.name,
    destination: LANDMARKS.hotelGuest.name,
    passengers: "Presse internationale (2)",
    capacity: 4,
    driver: "Ousmane Kane",
    plate: "DK 5523 CT",
    eta: "08:28",
    delayMin: 0,
    weather: "☀️ 27°",
    path: buildPath(LANDMARKS.centreVille, LANDMARKS.hotelGuest, 0.003),
    progress: 0.6,
    speedKmh: 26,
  },
  {
    id: "JOJ-V08",
    type: "VIP",
    status: "Prêt",
    priority: "Critique",
    routeName: "Village → Stade (cérémonie)",
    origin: LANDMARKS.villageOlympique.name,
    destination: LANDMARKS.stadeAbdoulayeWade.name,
    passengers: "Président CNOSS",
    capacity: 6,
    driver: "Aliou Diallo",
    plate: "DK 0002 VIP",
    eta: "09:30",
    delayMin: 0,
    weather: "☀️ 29°",
    path: buildPath(LANDMARKS.villageOlympique, LANDMARKS.stadeAbdoulayeWade),
    progress: 0,
    speedKmh: 0,
  },
];

export const TYPE_ICON: Record<TransportType, string> = {
  Bus: "🚌",
  Taxi: "🚕",
  Navette: "🚐",
  VIP: "✨",
};

// Linear-interpolate along the path based on progress (0..1)
export function pointAt(path: LatLng[], progress: number): LatLng {
  if (progress <= 0) return path[0];
  if (progress >= 1) return path[path.length - 1];
  const total = path.length - 1;
  const scaled = progress * total;
  const idx = Math.floor(scaled);
  const t = scaled - idx;
  const a = path[idx];
  const b = path[idx + 1];
  return { lat: a.lat + (b.lat - a.lat) * t, lng: a.lng + (b.lng - a.lng) * t };
}
