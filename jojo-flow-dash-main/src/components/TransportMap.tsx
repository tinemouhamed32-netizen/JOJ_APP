import { lazy, Suspense, useEffect, useState } from "react";
import type { Vehicle } from "@/lib/transport-data";

const InnerMap = lazy(() => import("./TransportMapInner").then((m) => ({ default: m.TransportMapInner })));

export function TransportMap(props: {
  vehicles: Vehicle[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
        Chargement de la carte Dakar…
      </div>
    );
  }
  return (
    <Suspense
      fallback={
        <div className="h-full w-full flex items-center justify-center text-muted-foreground text-sm">
          Chargement de la carte Dakar…
        </div>
      }
    >
      <InnerMap {...props} />
    </Suspense>
  );
}
