import { AnimatePresence, motion } from "framer-motion";
import { X, Gauge, MapPin, Users, User, Hash, Cloud, AlertTriangle } from "lucide-react";
import type { Vehicle } from "@/lib/transport-data";
import { TYPE_ICON } from "@/lib/transport-data";

export function VehicleDetail({ vehicle, onClose }: { vehicle: Vehicle | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {vehicle && (
        <>
          <motion.div
            className="fixed inset-0 bg-background/70 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 glass border-l border-border overflow-y-auto scrollbar-thin"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 240 }}
          >
            <div className="sticky top-0 bg-card/80 backdrop-blur-md border-b border-border p-5 flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Fiche transport</p>
                <h2 className="text-xl font-semibold mt-1 flex items-center gap-2">
                  <span className="text-2xl">{TYPE_ICON[vehicle.type]}</span>
                  {vehicle.id}
                </h2>
                <p className="text-sm text-muted-foreground">{vehicle.routeName}</p>
              </div>
              <button
                onClick={onClose}
                className="size-9 rounded-lg flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-3 gap-3">
                <Metric label="Statut" value={vehicle.status} />
                <Metric label="ETA" value={vehicle.eta} />
                <Metric
                  label="Retard"
                  value={vehicle.delayMin > 0 ? `+${vehicle.delayMin}min` : "À l'heure"}
                  tone={vehicle.delayMin >= 5 ? "danger" : vehicle.delayMin > 0 ? "warning" : "success"}
                />
              </div>

              <div className="space-y-2 text-sm">
                <Row icon={MapPin} label="Origine" value={vehicle.origin} />
                <Row icon={MapPin} label="Destination" value={vehicle.destination} />
                <Row icon={User} label="Chauffeur" value={vehicle.driver} />
                <Row icon={Hash} label="Plaque" value={vehicle.plate} />
                <Row icon={Users} label="Passagers" value={`${vehicle.passengers} · ${vehicle.capacity} pl.`} />
                <Row icon={Gauge} label="Vitesse" value={`${Math.round(vehicle.speedKmh)} km/h`} />
                <Row icon={Cloud} label="Météo" value={vehicle.weather} />
                <Row icon={AlertTriangle} label="Priorité" value={vehicle.priority} />
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Progression du trajet</p>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className="h-full"
                    style={{ background: "var(--gradient-hero)" }}
                    animate={{ width: `${Math.round(vehicle.progress * 100)}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{Math.round(vehicle.progress * 100)} % complété</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Historique récent</p>
                <ul className="space-y-2 text-sm">
                  {historyFor(vehicle).map((h, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <span className="mt-1.5 size-1.5 rounded-full bg-primary shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Metric({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "success" | "warning" | "danger" }) {
  const toneClass =
    tone === "danger" ? "text-danger" : tone === "warning" ? "text-warning" : tone === "success" ? "text-success" : "text-foreground";
  return (
    <div className="rounded-xl bg-secondary/50 border border-border p-3">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`text-sm font-semibold mt-1 ${toneClass}`}>{value}</p>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-border/50 last:border-0">
      <span className="flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-wide">
        <Icon className="size-3.5" />
        {label}
      </span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}

function historyFor(v: Vehicle): string[] {
  return [
    `07:42 — Véhicule ${v.id} affecté au trajet ${v.routeName}`,
    `07:58 — Chauffeur ${v.driver} a démarré la mission`,
    v.delayMin > 0
      ? `08:12 — Ralentissement détecté (+${v.delayMin} min estimés)`
      : `08:12 — Progression conforme au planning`,
    `Maintenant — ${Math.round(v.progress * 100)}% du trajet effectué, ETA ${v.eta}`,
  ];
}
