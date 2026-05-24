import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Flame, Radio } from "lucide-react";
import { StatsGrid } from "@/components/StatsGrid";
import { FilterBar, type Filters } from "@/components/FilterBar";
import { TransportMap } from "@/components/TransportMap";
import { VehicleList } from "@/components/VehicleList";
import { VehicleDetail } from "@/components/VehicleDetail";
import { MobilityAIChat } from "@/components/MobilityAIChat";
import { AlertsPanel, buildAlerts } from "@/components/AlertsPanel";
import { INITIAL_VEHICLES, type Vehicle } from "@/lib/transport-data";
import { Link } from '@tanstack/react-router';  

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "JOJ Transport Dakar 2026 — Centre de supervision" },
      {
        name: "description",
        content:
          "Supervision intelligente des transports des Jeux Olympiques de la Jeunesse Dakar 2026 : bus, taxis, navettes, VIP, IA Mobility et carte live.",
      },
      { property: "og:title", content: "JOJ Transport Dakar 2026" },
      { property: "og:description", content: "Centre de contrôle intelligent des mobilités JOJ Dakar 2026." },
    ],
  }),
  component: Dashboard,
});

function nowHHMM(offsetMin = 0): string {
  const d = new Date(Date.now() + offsetMin * 60_000);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [clock, setClock] = useState(nowHHMM());
  const [filters, setFilters] = useState<Filters>({
    type: "Tous",
    status: "Tous",
    priority: "Toutes",
    destination: "",
    search: "",
  });

  // Real-time simulation tick
  useEffect(() => {
    const id = setInterval(() => {
      setClock(nowHHMM());
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.status === "Complété" || v.status === "Prêt") return v;
          const speed = v.speedKmh > 0 ? v.speedKmh : 30;
          // ~ progress per 2s tick, scaled by speed
          const step = (speed / 3600) * 0.012;
          const nextProgress = Math.min(1, v.progress + step);
          const finished = nextProgress >= 1;
          // Occasional jitter to delays
          let delay = v.delayMin;
          if (Math.random() < 0.08 && !finished) delay = Math.max(0, delay + (Math.random() < 0.5 ? 1 : -1));
          return {
            ...v,
            progress: nextProgress,
            delayMin: delay,
            status: finished ? "Complété" : v.status === "En attente" && nextProgress > 0.08 ? "En route" : v.status,
            speedKmh: finished ? 0 : v.speedKmh,
          };
        }),
      );
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const destinations = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.destination))).sort(),
    [vehicles],
  );

  const filtered = useMemo(() => {
    const q = filters.search.toLowerCase();
    return vehicles.filter((v) => {
      if (filters.type !== "Tous" && v.type !== filters.type) return false;
      if (filters.status !== "Tous") {
        if (filters.status === "Retard" ? v.delayMin < 5 : v.status !== filters.status) return false;
      }
      if (filters.priority !== "Toutes" && v.priority !== filters.priority) return false;
      if (filters.destination && v.destination !== filters.destination) return false;
      if (q) {
        const hay = `${v.id} ${v.routeName} ${v.passengers} ${v.driver} ${v.destination}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [vehicles, filters]);

  const selected = vehicles.find((v) => v.id === selectedId) ?? null;
  const alerts = useMemo(() => buildAlerts(vehicles), [vehicles]);

  return (
    <div className="min-h-screen p-4 lg:p-6 space-y-5 max-w-[1600px] mx-auto">
      {/* Hero / Top bar */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-5 lg:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 glow-ring"
      >
        <div className="flex items-center gap-4">
          <div
            className="size-14 rounded-2xl flex items-center justify-center text-2xl text-background"
            style={{ background: "var(--gradient-hero)" }}
          >
            <Flame className="size-7" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              Jeux Olympiques de la Jeunesse · Dakar 2026
            </p>
            <h1 className="text-2xl lg:text-3xl font-semibold mt-1">
              JOJ Transport <span className="text-gradient">Mobility Command</span>
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Supervision temps réel des bus, taxis, navettes, VIP et équipes médicales.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="glass rounded-xl px-4 py-2.5 flex items-center gap-2 border border-border">
            <Radio className="size-4 text-primary animate-pulse" />
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Live Dakar</p>
              <p className="text-lg font-mono font-semibold leading-none mt-0.5">{clock}</p>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex justify-end">
  <Link to="/reservation"
    className="rounded-2xl px-5 py-3 bg-primary text-white font-semibold"
  >
    Réservation Transport
  </Link>
</div>

      {/* Stats */}
      <StatsGrid vehicles={vehicles} />

      {/* Map + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl overflow-hidden h-[480px] lg:h-[540px]"
        >
          <TransportMap vehicles={vehicles} selectedId={selectedId} onSelect={setSelectedId} />
        </motion.div>
        <div className="h-[480px] lg:h-[540px]">
          <AlertsPanel alerts={alerts} />
        </div>
      </div>

      {/* Filters + List */}
      <FilterBar filters={filters} onChange={setFilters} destinations={destinations} />

      <section>
        <div className="flex items-baseline justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold">Planning de la flotte</h2>
            <p className="text-xs text-muted-foreground">
              {filtered.length} trajet{filtered.length > 1 ? "s" : ""} affiché
              {filtered.length > 1 ? "s" : ""} · clique pour ouvrir la fiche
            </p>
          </div>
        </div>
        <VehicleList vehicles={filtered} selectedId={selectedId} onSelect={setSelectedId} />
      </section>

      <footer className="text-center text-[11px] text-muted-foreground py-6">
        JOJ Mobility Command · Dakar 2026 — Prototype de supervision intelligente
      </footer>

      <VehicleDetail vehicle={selected} onClose={() => setSelectedId(null)} />
      <MobilityAIChat fleet={vehicles} />
    </div>
  );
}
