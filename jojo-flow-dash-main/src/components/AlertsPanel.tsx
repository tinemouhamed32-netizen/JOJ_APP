import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Sparkles, Zap } from "lucide-react";
import type { Vehicle } from "@/lib/transport-data";

export type AlertItem = {
  id: string;
  tone: "danger" | "warning" | "success" | "vip";
  icon: typeof AlertTriangle;
  title: string;
  detail: string;
};

export function buildAlerts(fleet: Vehicle[]): AlertItem[] {
  const out: AlertItem[] = [];
  fleet
    .filter((v) => v.delayMin >= 8)
    .forEach((v) =>
      out.push({
        id: `delay-${v.id}`,
        tone: "danger",
        icon: AlertTriangle,
        title: `Retard critique ${v.id}`,
        detail: `${v.routeName} · +${v.delayMin} min`,
      }),
    );
  fleet
    .filter((v) => v.delayMin >= 5 && v.delayMin < 8)
    .forEach((v) =>
      out.push({
        id: `traffic-${v.id}`,
        tone: "warning",
        icon: Zap,
        title: "Embouteillage détecté",
        detail: `${v.id} · ${v.routeName}`,
      }),
    );
  fleet
    .filter((v) => v.type === "VIP" && v.status === "En route")
    .forEach((v) =>
      out.push({
        id: `vip-${v.id}`,
        tone: "vip",
        icon: Sparkles,
        title: "Transport VIP prioritaire",
        detail: `${v.id} · ${v.routeName} · ETA ${v.eta}`,
      }),
    );
  fleet
    .filter((v) => v.status === "Complété")
    .slice(0, 2)
    .forEach((v) =>
      out.push({
        id: `done-${v.id}`,
        tone: "success",
        icon: CheckCircle2,
        title: "Mission terminée",
        detail: `${v.id} · ${v.routeName}`,
      }),
    );
  return out.slice(0, 6);
}

const toneClass: Record<AlertItem["tone"], string> = {
  danger: "border-danger/40 bg-danger/10 text-danger",
  warning: "border-warning/40 bg-warning/10 text-warning",
  success: "border-success/40 bg-success/10 text-success",
  vip: "border-vip/40 bg-vip/10 text-vip",
};

export function AlertsPanel({ alerts }: { alerts: AlertItem[] }) {
  return (
    <div className="glass rounded-2xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Zap className="size-4 text-primary" /> Alertes intelligentes
        </h3>
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Live</span>
      </div>
      <div className="space-y-2 overflow-y-auto scrollbar-thin pr-1 flex-1">
        <AnimatePresence initial={false}>
          {alerts.length === 0 && (
            <p className="text-xs text-muted-foreground py-6 text-center">
              Tout est sous contrôle. Aucune alerte active.
            </p>
          )}
          {alerts.map((a) => (
            <motion.div
              key={a.id}
              layout
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`rounded-xl border px-3 py-2.5 flex items-start gap-2.5 ${toneClass[a.tone]}`}
            >
              <a.icon className="size-4 mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">{a.title}</p>
                <p className="text-[11px] text-muted-foreground truncate">{a.detail}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
