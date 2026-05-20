import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { motion } from 'framer-motion';
export default ReservationPage;

type Reservation = {
  id: string;
  fullName: string;
  transportType: string;
  eta: string;
  status: string;
};

export const Route = createFileRoute('/reservation')({
  component: ReservationPage,
});

function ReservationPage() {
  const [form, setForm] = useState({
    fullName: '',
    transportType: '',
    comment: '',
  });

  const [reservations, setReservations] = useState<Reservation[]>([]);

  const submit = () => {
    const newReservation: Reservation = {
      id: Date.now().toString(),
      fullName: form.fullName,
      transportType: form.transportType,
      eta: new Date().toLocaleTimeString(),
      status: 'En attente',
    };

    setReservations([...reservations, newReservation]);

    setForm({
      fullName: '',
      transportType: '',
      comment: '',
    });
  };

  const updateStatus = (id: string, status: string) => {
    setReservations(prev =>
      prev.map(r => (r.id === id ? { ...r, status } : r))
    );
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      <Link
        to="/"
        className="rounded-xl bg-primary px-4 py-2 text-white"
      >
        Retour Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-3xl border p-6 shadow-xl"
        >
          <h1 className="text-2xl font-bold mb-5">
            Réservation Transport
          </h1>

          <div className="space-y-4">
            <input
              className="border p-3 rounded-xl w-full"
              placeholder="Nom complet"
              value={form.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.target.value })
              }
            />

            <input
              className="border p-3 rounded-xl w-full"
              placeholder="Type de transport"
              value={form.transportType}
              onChange={(e) =>
                setForm({ ...form, transportType: e.target.value })
              }
            />

            <textarea
              className="border p-3 rounded-xl w-full"
              placeholder="Commentaire"
              value={form.comment}
              onChange={(e) =>
                setForm({ ...form, comment: e.target.value })
              }
            />

            <button
              onClick={submit}
              className="rounded-2xl bg-primary py-4 text-white font-semibold w-full"
            >
              Réserver Transport
            </button>
          </div>
        </motion.div>

        <div className="rounded-3xl border p-6 shadow-xl overflow-auto">
          <h2 className="text-2xl font-semibold mb-4">
            Gestion des Réservations
          </h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th>ID</th>
                <th>Nom</th>
                <th>Transport</th>
                <th>ETA</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {reservations.map((r) => (
                <tr key={r.id} className="border-b">
                  <td>{r.id}</td>
                  <td>{r.fullName}</td>
                  <td>{r.transportType}</td>
                  <td>{r.eta}</td>
                  <td>{r.status}</td>
                  <td className="space-x-2 py-2">
                    <button
                      onClick={() => updateStatus(r.id, 'Confirmée')}
                      className="text-green-500"
                    >
                      Accepter
                    </button>

                    <button
                      onClick={() => updateStatus(r.id, 'En route')}
                      className="text-blue-500"
                    >
                      Démarrer
                    </button>

                    <button
                      onClick={() => updateStatus(r.id, 'Terminée')}
                      className="text-purple-500"
                    >
                      Finir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}