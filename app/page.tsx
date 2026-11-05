"use client";
import { useState } from "react";

// Liste des activités possibles
const activitiesData = [
  {
    id: "1",
    name: "Cours magistral",
    color: "bg-blue-100 border-blue-400 text-blue-800",
  },
  {
    id: "2",
    name: "Travaux dirigés (TD)",
    color: "bg-green-100 border-green-400 text-green-800",
  },
  {
    id: "3",
    name: "Réunion / Projet",
    color: "bg-purple-100 border-purple-400 text-purple-800",
  },
  {
    id: "4",
    name: "Pause / Repas",
    color: "bg-orange-100 border-orange-400 text-orange-800",
  },
];

interface Slot {
  activity: string;
  description: string;
  duration: number;
  color: string;
}

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];
const heures = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
];

export default function AgendaApp() {
  const [description, setDescription] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(
    activitiesData[0].name,
  );
  const [duration, setDuration] = useState("30");
  const [generatedSlot, setGeneratedSlot] = useState<Slot | null>(null);

  // Stocke les créneaux placés dans la grille : clé = "Jour-Heure" (ex: "Lundi-08:00")
  const [schedule, setSchedule] = useState<{ [key: string]: Slot }>({});

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const actObj = activitiesData.find((a) => a.name === selectedActivity);
    setGeneratedSlot({
      activity: selectedActivity,
      description,
      duration: parseInt(duration),
      color: actObj
        ? actObj.color
        : "bg-blue-100 border-blue-400 text-blue-800",
    });
  };

  const handleDrop = (jour: string, heure: string) => {
    if (generatedSlot) {
      const cellKey = `${jour}-${heure}`;
      setSchedule((prev) => ({
        ...prev,
        [cellKey]: generatedSlot,
      }));
      setGeneratedSlot(null); // Retire le créneau de la zone de gauche une fois placé
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* COLONNE DE GAUCHE : Générateur */}
      <div className="w-1/4 p-6 bg-white border-r shadow-md flex flex-col justify-between overflow-y-auto">
        <div>
          <h2 className="text-xl font-bold mb-4 text-black">
            Générer un créneau
          </h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black">
                Activité
              </label>
              <select
                className="w-full mt-1 p-2 border rounded text-black bg-white"
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
              >
                {activitiesData.map((act) => (
                  <option key={act.id} value={act.name}>
                    {act.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-black">
                Description
              </label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded text-black bg-white"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Chapitre 1 - Intro"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">
                Durée
              </label>
              <select
                className="w-full mt-1 p-2 border rounded text-black bg-white"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value="30">30 minutes</option>
                <option value="60">1 heure</option>
                <option value="90">1 heure 30</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-semibold"
            >
              Créer le créneau
            </button>
          </form>

          {/* Créneau prêt à être glissé */}
          {generatedSlot && (
            <div
              draggable
              className={`mt-6 p-4 border rounded cursor-grab shadow ${generatedSlot.color}`}
            >
              <h3 className="font-bold">{generatedSlot.activity}</h3>
              <p className="text-sm">{generatedSlot.description}</p>
              <span className="text-xs opacity-75">
                Durée : {generatedSlot.duration} min (Glissez-moi)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* COLONNE DE DROITE : Grille Emploi du temps (Jours x Heures) */}
      <div className="w-3/4 p-6 overflow-auto">
        <h2 className="text-xl font-bold mb-4 text-black">
          Emploi du temps de la semaine
        </h2>
        <div className="bg-white rounded shadow border inline-block min-w-full">
          <div className="grid grid-cols-6 border-b bg-gray-50 text-black font-semibold text-center">
            <div className="p-3 border-r">Heures</div>
            {jours.map((jour) => (
              <div key={jour} className="p-3 border-r last:border-r-0">
                {jour}
              </div>
            ))}
          </div>

          {heures.map((heure) => (
            <div
              key={heure}
              className="grid grid-cols-6 border-b last:border-b-0 h-20"
            >
              {/* Colonne des heures */}
              <div className="p-3 border-r text-gray-500 font-medium text-center flex items-center justify-center bg-gray-50">
                {heure}
              </div>

              {/* Cases des jours de la semaine */}
              {jours.map((jour) => {
                const cellKey = `${jour}-${heure}`;
                const slotInCell = schedule[cellKey];

                return (
                  <div
                    key={jour}
                    className="border-r last:border-r-0 p-1 relative flex items-center justify-center hover:bg-gray-50 transition"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(jour, heure)}
                  >
                    {slotInCell ? (
                      <div
                        className={`w-full h-full p-2 rounded border text-xs shadow-sm overflow-hidden flex flex-col justify-between ${slotInCell.color}`}
                      >
                        <span className="font-bold truncate">
                          {slotInCell.activity}
                        </span>
                        <span className="truncate">
                          {slotInCell.description}
                        </span>
                        <span className="text-[10px] opacity-75">
                          {slotInCell.duration} min
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-300 text-xs select-none">
                        Déposer ici
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
