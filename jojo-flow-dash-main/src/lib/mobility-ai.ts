import type { Vehicle } from "./transport-data";

export type AIMessage = { role: "user" | "ai"; content: string; ts: number };

/**
 * Lightweight rule-based "JOJ Mobility AI".
 * Analyzes the current fleet state to produce sensible operational recommendations.
 * No external API required — designed to feel like a domain assistant.
 */
export function mobilityRespond(prompt: string, fleet: Vehicle[]): string {
  const p = prompt.toLowerCase().trim();
  const delayed = fleet.filter((v) => v.delayMin >= 5);
  const vip = fleet.filter((v) => v.type === "VIP");
  const enRoute = fleet.filter((v) => v.status === "En route");
  const ready = fleet.filter((v) => v.status === "Prêt");

  if (!p) return "Pose-moi une question : retards, optimisation, VIP, affectations…";

  if (/(retard|delay|en retard|temps)/.test(p)) {
    if (delayed.length === 0) return "✅ Aucun retard critique. Tous les véhicules sont dans la fenêtre planifiée.";
    const worst = [...delayed].sort((a, b) => b.delayMin - a.delayMin)[0];
    const alt = ready[0];
    return `⚠️ ${delayed.length} véhicule(s) en retard. Le plus critique : ${worst.id} (${worst.routeName}) — ${worst.delayMin} min de retard.${alt ? ` Recommandation : affecter ${alt.id} (${alt.type}) actuellement prêt à ${alt.origin}.` : ""}`;
  }

  if (/(vip|dignitaire|protocol)/.test(p)) {
    if (vip.length === 0) return "Aucun véhicule VIP actuellement actif.";
    return `⭐ ${vip.length} transport(s) VIP actif(s). Priorité absolue accordée. Couloirs dédiés recommandés sur l'A1 entre Aéroport et Village. ETA moyen : ${avgEta(vip)}.`;
  }

  if (/(optimi|améliore|améliorer|propose|suggestion|recommand)/.test(p)) {
    const lines = [
      `📊 Flotte : ${fleet.length} véhicules · ${enRoute.length} en route · ${ready.length} prêts`,
      delayed.length > 0
        ? `• Réaffecter ${delayed[0].id} → corridor secondaire pour réduire ${delayed[0].delayMin} min de retard.`
        : `• Flux nominal — aucun ré-acheminement nécessaire.`,
      ready.length > 0
        ? `• ${ready[0].id} (${ready[0].type}) est prêt : peut être avancé en buffer pour absorber un pic.`
        : `• Renforcer la réserve : aucun véhicule en stand-by immédiat.`,
      `• Probabilité d'embouteillage A1 entre 08:30–09:15 : élevée. Recommandation : décaler les départs non-prioritaires de 8 min.`,
    ];
    return lines.join("\n");
  }

  if (/(trafic|embouteill|bouchon)/.test(p)) {
    return "🚨 Trafic détecté : axe Aéroport → Village (+9 min). Suggestion : router les Navettes via Diamniadio-Sud. Les VIP gardent le couloir prioritaire.";
  }

  if (/(stade|cérémonie|ceremonie)/.test(p)) {
    const toStade = fleet.filter((v) => /stade/i.test(v.destination));
    return `🏟️ ${toStade.length} véhicule(s) en direction du Stade. Capacité totale : ${toStade.reduce((s, v) => s + v.capacity, 0)} places. Flux conforme au plan d'ouverture.`;
  }

  if (/(village|olympique)/.test(p)) {
    const toVillage = fleet.filter((v) => /village/i.test(v.destination));
    return `🏘️ Village Olympique : ${toVillage.length} arrivée(s) prévue(s). Saturation parking estimée à 62 %. Tout est sous contrôle.`;
  }

  if (/(météo|meteo|temps|pluie)/.test(p)) {
    return "🌤️ Conditions : 28 °C, vent léger Atlantique. Aucun impact opérationnel sur les trajets en cours.";
  }

  if (/(bonjour|salut|hello|hi)/.test(p)) {
    return "👋 Bonjour ! Je suis JOJ Mobility AI. Demande-moi : « analyse les retards », « optimise la flotte », « statut VIP », ou « trafic Aéroport ».";
  }

  // Fallback synthesis
  return `J'observe ${fleet.length} véhicules actifs, ${enRoute.length} en mouvement et ${delayed.length} en retard. Précise ta demande : "retards", "VIP", "optimisation", "trafic", "stade" ou "village".`;
}

function avgEta(list: Vehicle[]): string {
  if (list.length === 0) return "—";
  const mins = list.map((v) => {
    const [h, m] = v.eta.split(":").map(Number);
    return h * 60 + m;
  });
  const avg = Math.round(mins.reduce((s, n) => s + n, 0) / mins.length);
  return `${String(Math.floor(avg / 60)).padStart(2, "0")}:${String(avg % 60).padStart(2, "0")}`;
}
