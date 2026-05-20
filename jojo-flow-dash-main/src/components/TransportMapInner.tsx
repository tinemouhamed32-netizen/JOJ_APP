import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Vehicle } from "@/lib/transport-data";
import { DAKAR_CENTER, TYPE_ICON, pointAt } from "@/lib/transport-data";

const typeClass: Record<string, string> = {
  Bus: "",
  Taxi: "taxi",
  Navette: "navette",
  VIP: "vip",
};

function vehicleIcon(v: Vehicle) {
  const alert = v.delayMin >= 5 ? "alert" : "";
  return L.divIcon({
    className: "",
    html: `<div class="vehicle-marker ${typeClass[v.type]} ${alert}">${TYPE_ICON[v.type]}</div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
}

const routeColors: Record<string, string> = {
  Bus: "#5BD89C",
  Taxi: "#F5D547",
  Navette: "#6FA8FF",
  VIP: "#F3B544",
};

export function TransportMapInner({
  vehicles,
  selectedId,
  onSelect,
}: {
  vehicles: Vehicle[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <MapContainer
      center={[DAKAR_CENTER.lat, DAKAR_CENTER.lng]}
      zoom={11}
      scrollWheelZoom
      className="h-full w-full"
      style={{ minHeight: 420 }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {vehicles.map((v) => (
        <Polyline
          key={`p-${v.id}`}
          positions={v.path.map((p) => [p.lat, p.lng] as [number, number])}
          pathOptions={{
            color: routeColors[v.type],
            weight: selectedId === v.id ? 4 : 2,
            opacity: selectedId === v.id ? 0.9 : 0.45,
            dashArray: v.status === "Complété" ? "6 6" : undefined,
          }}
        />
      ))}

      {vehicles.map((v) => {
        const pos = pointAt(v.path, v.progress);
        return (
          <Marker
            key={v.id}
            position={[pos.lat, pos.lng]}
            icon={vehicleIcon(v)}
            eventHandlers={{ click: () => onSelect(v.id) }}
          >
            <Popup>
              <div className="space-y-1">
                <div className="font-semibold text-[14px]">
                  {TYPE_ICON[v.type]} {v.id} · {v.type}
                </div>
                <div className="opacity-80">{v.routeName}</div>
                <div className="text-[12px] opacity-70">
                  Statut : {v.status} {v.delayMin > 0 ? `· +${v.delayMin} min` : ""}
                </div>
                <div className="text-[12px] opacity-70">ETA {v.eta} · {v.passengers}</div>
                <div className="text-[12px] opacity-70">Chauffeur : {v.driver}</div>
                <button
                  className="mt-2 text-[12px] text-[oklch(0.7_0.18_145)] underline"
                  onClick={() => onSelect(v.id)}
                >
                  Ouvrir la fiche →
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
