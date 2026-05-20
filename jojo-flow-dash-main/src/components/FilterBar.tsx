import { motion } from "framer-motion";
import { Search } from "lucide-react";
import type { Priority, TransportStatus, TransportType } from "@/lib/transport-data";

export type Filters = {
  type: TransportType | "Tous";
  status: TransportStatus | "Tous";
  priority: Priority | "Toutes";
  destination: string;
  search: string;
};

const TYPES: (TransportType | "Tous")[] = ["Tous", "Bus", "Taxi", "Navette", "VIP"];
const STATUSES: (TransportStatus | "Tous")[] = ["Tous", "Prêt", "En route", "En attente", "Complété", "Retard"];
const PRIORITIES: (Priority | "Toutes")[] = ["Toutes", "Standard", "Haute", "Critique"];

export function FilterBar({
  filters,
  onChange,
  destinations,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  destinations: string[];
}) {
  const Pill = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
        active
          ? "bg-primary text-primary-foreground border-primary shadow-[0_0_18px_-4px_var(--primary)]"
          : "bg-secondary/40 text-muted-foreground border-border hover:text-foreground hover:border-primary/40"
      }`}
    >
      {children}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-4 space-y-3"
    >
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Rechercher route, passagers, chauffeur, ID…"
            className="w-full bg-input/60 border border-border rounded-xl pl-10 pr-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={filters.destination}
          onChange={(e) => onChange({ ...filters, destination: e.target.value })}
          className="bg-input/60 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary/60"
        >
          <option value="">Toutes destinations</option>
          {destinations.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground mr-1">Type</span>
          {TYPES.map((t) => (
            <Pill key={t} active={filters.type === t} onClick={() => onChange({ ...filters, type: t })}>{t}</Pill>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground mr-1">Statut</span>
          {STATUSES.map((s) => (
            <Pill key={s} active={filters.status === s} onClick={() => onChange({ ...filters, status: s })}>{s}</Pill>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground mr-1">Priorité</span>
          {PRIORITIES.map((p) => (
            <Pill key={p} active={filters.priority === p} onClick={() => onChange({ ...filters, priority: p })}>{p}</Pill>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
