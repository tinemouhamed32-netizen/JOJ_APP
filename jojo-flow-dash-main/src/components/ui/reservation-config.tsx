import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';

export const Route = createFileRoute('/reservation-config')({
  component: ReservationConfigPage,
});

function ReservationConfigPage() {
  const [config, setConfig] = useState({
    maxPassengers: 4,
    enableVIP: true,
    defaultTransport: 'Bus',
    autoApproval: false,
  });

  return (
    <div className="min-h-screen p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">
          Configuration des Réservations
        </h1>

        <Link
          to="/reservation"
          className="rounded-2xl bg-primary px-4 py-2 text-white"
        >
          Retour aux réservations
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-3xl border p-6 shadow-xl bg-card space-y-5"
      >
        <div>
          <label className="font-medium">
            Nombre maximum de passagers
          </label>

          <input
            type="number"
            className="border p-2 rounded-xl w-full mt-2"
            value={config.maxPassengers}
            onChange={(e) =>
              setConfig({
                ...config,
                maxPassengers: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="flex justify-between items-center">
          <p>Activer les véhicules VIP</p>

          <input
            type="checkbox"
            checked={config.enableVIP}
            onChange={(e) =>
              setConfig({
                ...config,
                enableVIP: e.target.checked,
              })
            }
          />
        </div>

        <div>
          <label className="font-medium">
            Transport par défaut
          </label>

          <select
            className="border p-2 rounded-xl w-full mt-2"
            value={config.defaultTransport}
            onChange={(e) =>
              setConfig({
                ...config,
                defaultTransport: e.target.value,
              })
            }
          >
            <option>Bus</option>
            <option>Taxi</option>
            <option>Navette</option>
            <option>VIP</option>
          </select>
        </div>

        <div className="flex justify-between items-center">
          <p>Validation automatique des réservations</p>

          <input
            type="checkbox"
            checked={config.autoApproval}
            onChange={(e) =>
              setConfig({
                ...config,
                autoApproval: e.target.checked,
              })
            }
          />
        </div>

        <button className="rounded-2xl bg-green-600 px-5 py-3 text-white font-semibold">
          Sauvegarder Configuration
        </button>
      </motion.div>
    </div>
  );
}