import { motion } from "framer-motion";
import type { Vehicle } from "@/lib/transport-data";
import { TYPE_ICON } from "@/lib/transport-data";

const statusTone: Record<string, string> = {
  "Prêt": "bg-senegal-yellow/15 text-senegal-yellow border-senegal-yellow/30",
  "En route": "bg-senegal-green/15 text-senegal-green border-senegal-green/30",
  "En attente": "bg-muted text-muted-foreground border-border",
  "Complété": "bg-success/15 text-success border-success/30",
  "Retard": "bg-danger/15 text-danger border-danger/30",
};

const priorityTone: Record<string, string> = {
  Standard: "text-muted-foreground",
  Haute: "text-olympic-blue",
  Critique: "text-danger",
};

export function VehicleList({
  vehicles,
  selectedId,
  onSelect,
}: {
  vehicles: Vehicle[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (!vehicles.length) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <p className="text-sm font-medium">Aucun véhicule ne correspond.</p>
        <p className="text-xs text-muted-foreground mt-1">Ajuste tes filtres ou ta recherche.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {vehicles.map((v, i) => {
        const delayed = v.delayMin >= 5;
        const selected = selectedId === v.id;
        return (
          <motion.button
            key={v.id}
            type="button"
            onClick={() => onSelect(v.id)}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`w-full text-left glass rounded-xl p-4 transition-all border ${
              selected ? "border-primary/60 ring-2 ring-primary/30" : "border-transparent hover:border-primary/30"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-xl flex items-center justify-center text-xl bg-secondary/60 border border-border">
                {TYPE_ICON[v.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm truncate">{v.routeName}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusTone[v.status]}`}>
                    {v.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{v.passengers}</p>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                  <span className="font-mono">{v.id}</span>
                  <span>ETA {v.eta}</span>
                  <span className={priorityTone[v.priority]}>● {v.priority}</span>
                  {delayed && <span className="text-danger font-medium">+{v.delayMin}min</span>}
                </div>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
