import { motion } from "framer-motion";
import { Activity, Bus, CheckCircle2, Clock, Gauge, Sparkles } from "lucide-react";
import type { Vehicle } from "@/lib/transport-data";

function avgDelay(vehicles: Vehicle[]) {
  const d = vehicles.filter((v) => v.delayMin > 0).map((v) => v.delayMin);
  if (!d.length) return 0;
  return Math.round((d.reduce((s, n) => s + n, 0) / d.length) * 10) / 10;
}

function trafficLevel(vehicles: Vehicle[]): { label: string; pct: number; tone: string } {
  const enRoute = vehicles.filter((v) => v.status === "En route").length;
  const pct = Math.min(100, Math.round((enRoute / Math.max(1, vehicles.length)) * 140));
  const tone = pct > 75 ? "text-danger" : pct > 50 ? "text-warning" : "text-success";
  const label = pct > 75 ? "Élevé" : pct > 50 ? "Modéré" : "Fluide";
  return { label, pct, tone };
}

const Stat = ({
  icon: Icon,
  label,
  value,
  hint,
  accent,
  delay,
}: {
  icon: typeof Bus;
  label: string;
  value: string | number;
  hint?: string;
  accent: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: "easeOut" }}
    className="glass rounded-2xl p-5 relative overflow-hidden group"
  >
    <div
      className="absolute -top-12 -right-12 size-32 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-60"
      style={{ background: accent }}
    />
    <div className="flex items-start justify-between relative">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
        <p className="text-3xl font-semibold mt-2 tabular-nums">{value}</p>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </div>
      <div
        className="size-10 rounded-xl flex items-center justify-center text-background"
        style={{ background: accent }}
      >
        <Icon className="size-5" />
      </div>
    </div>
  </motion.div>
);

export function StatsGrid({ vehicles }: { vehicles: Vehicle[] }) {
  const total = vehicles.length;
  const enRoute = vehicles.filter((v) => v.status === "En route").length;
  const ready = vehicles.filter((v) => v.status === "Prêt").length;
  const done = vehicles.filter((v) => v.status === "Complété").length;
  const vip = vehicles.filter((v) => v.type === "VIP").length;
  const traffic = trafficLevel(vehicles);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
      <Stat icon={Bus} label="Trajets gérés" value={total} accent="var(--olympic-blue)" delay={0} />
      <Stat icon={Activity} label="En route" value={enRoute} accent="var(--senegal-green)" delay={0.05} />
      <Stat icon={Clock} label="Prêts" value={ready} accent="var(--senegal-yellow)" delay={0.1} />
      <Stat icon={CheckCircle2} label="Terminés" value={done} accent="var(--success)" delay={0.15} />
      <Stat
        icon={Gauge}
        label="Retard moyen"
        value={`${avgDelay(vehicles)} min`}
        accent="var(--senegal-red)"
        delay={0.2}
      />
      <Stat
        icon={Sparkles}
        label={`Trafic ${traffic.label}`}
        value={`${traffic.pct}%`}
        hint={`${vip} VIP actifs`}
        accent="var(--vip)"
        delay={0.25}
      />
    </div>
  );
}
