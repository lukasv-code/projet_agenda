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
  duration: number; // en minutes
  color: string;
  isCovered?: boolean;
}

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

// Génération automatique des heures de 08:00 à 00:00 par tranches de 30 minutes
const generateHours = () => {
  const list = [];
  for (let h = 8; h <= 23; h++) {
    const hourStr = h < 10 ? `0${h}` : `${h}`;
    list.push(`${hourStr}:00`);
    list.push(`${hourStr}:30`);
  }
  list.push("00:00");
  return list;
};

const heures = generateHours();

export default function AgendaApp() {
  const [description, setDescription] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(
    activitiesData[0].name,
  );
  const [duration, setDuration] = useState("60");
  const [generatedSlot, setGeneratedSlot] = useState<Slot | null>(null);

  // Stocke les créneaux placés : clé = "Jour-Heure"
  const [schedule, setSchedule] = useState<{ [key: string]: Slot }>({});

  // État pour le filtre actif ("Tous" par défaut)
  const [filterActivity, setFilterActivity] = useState("Tous");

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

  const handleDrop = (jour: string, heureDebut: string) => {
    if (!generatedSlot) return;

    const numBlocks = generatedSlot.duration / 30;
    const startIndex = heures.indexOf(heureDebut);

    if (startIndex === -1) return;

    const newSchedule = { ...schedule };

    const startKey = `${jour}-${heureDebut}`;
    newSchedule[startKey] = generatedSlot;

    for (let i = 1; i < numBlocks; i++) {
      const nextIndex = startIndex + i;
      if (nextIndex < heures.length) {
        const nextHeure = heures[nextIndex];
        const nextKey = `${jour}-${nextHeure}`;
        newSchedule[nextKey] = {
          ...generatedSlot,
          isCovered: true,
        };
      }
    }

    setSchedule(newSchedule);
    setGeneratedSlot(null);
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
                <option value="120">2 heures</option>
                <option value="150">2 heures 30</option>
                <option value="180">3 heures</option>
                <option value="210">3 heures 30</option>
                <option value="240">4 heures</option>
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

      {/* COLONNE DE DROITE : Grille Emploi du temps + Filtre */}
      <div className="w-3/4 p-6 overflow-auto flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-black">
            Emploi du temps de la semaine (8h - 00h)
          </h2>

          {/* SÉLECTEUR DE FILTRE */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-black">
              Filtrer par :
            </label>
            <select
              className="p-2 border rounded text-black bg-white text-sm"
              value={filterActivity}
              onChange={(e) => setFilterActivity(e.target.value)}
            >
              <option value="Tous">Toutes les activités</option>
              {activitiesData.map((act) => (
                <option key={act.id} value={act.name}>
                  {act.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded shadow border inline-block min-w-full">
          <div className="grid grid-cols-6 border-b bg-gray-50 text-black font-semibold text-center sticky top-0 z-20">
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
              className="grid grid-cols-6 border-b last:border-b-0 h-16"
            >
              {/* Colonne des heures fixe */}
              <div className="p-2 border-r text-gray-500 font-medium text-center flex items-center justify-center bg-gray-50 text-xs h-16">
                {heure}
              </div>

              {/* Cases des jours de la semaine */}
              {jours.map((jour) => {
                const cellKey = `${jour}-${heure}`;
                const slotInCell = schedule[cellKey];

                if (slotInCell?.isCovered) {
                  return (
                    <div
                      key={jour}
                      className="border-r last:border-r-0 bg-gray-50/50 h-16"
                    ></div>
                  );
                }

                // Vérifie si le créneau correspond au filtre actif
                const isVisible =
                  !slotInCell ||
                  filterActivity === "Tous" ||
                  slotInCell.activity === filterActivity;

                return (
                  <div
                    key={jour}
                    className="border-r last:border-r-0 relative hover:bg-gray-50 transition h-16"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(jour, heure)}
                  >
                    {slotInCell && isVisible ? (
                      <div
                        className={`absolute top-0 left-0 w-full p-2 border text-xs shadow-md overflow-hidden flex flex-col justify-between z-10 rounded ${slotInCell.color}`}
                        style={{
                          height: `${(slotInCell.duration / 30) * 4}rem`,
                        }}
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
                    ) : slotInCell && !isVisible ? (
                      // Optionnel : un style grisé ou masqué si le filtre ne correspond pas
                      <div className="absolute top-0 left-0 w-full h-full bg-gray-100 opacity-30 pointer-events-none"></div>
                    ) : null}
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
