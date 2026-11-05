"use client";
import { useState } from "react";

const activitiesData = [
  {
    id: "1",
    name: "Handball",
    color: "bg-blue-100 border-blue-400 text-blue-800",
  },
  {
    id: "2",
    name: "Cinéma",
    color: "bg-green-100 border-green-400 text-green-800",
  },
  {
    id: "3",
    name: "Casino",
    color: "bg-purple-100 border-purple-400 text-purple-800",
  },
  {
    id: "4",
    name: "jeu de société",
    color: "bg-orange-100 border-orange-400 text-orange-800",
  },
  {
    id: "5",
    name: "Révision",
    color: "bg-indigo-100 border-indigo-400 text-indigo-800",
  },
  {
    id: "6",
    name: "Bar",
    color: "bg-yellow-100 border-yellow-400 text-yellow-800",
  },
  {
    id: "7",
    name: "Course à pied",
    color: "bg-pink-100 border-pink-400 text-pink-800",
  },
  { id: "8", name: "Basket", color: "bg-red-100 border-red-400 text-red-800" },
];

interface Slot {
  id: string; // Identifiant unique pour retrouver le créneau dans le state
  activity: string;
  prenom: string;
  nom: string;
  description: string;
  duration: number;
  color: string;
  maxInscrits: number;
  inscrits: number;
  estInscrit: boolean;
  isCovered?: boolean;
}

interface PresetSlot {
  jour: string;
  heureDebut: string;
  activity: string;
  prenom: string;
  nom: string;
  description: string;
  duration: number;
  maxInscrits: number;
  inscrits: number;
}

const initialPresets: PresetSlot[] = [
  {
    jour: "Lundi",
    heureDebut: "09:00",
    activity: "Handball",
    prenom: "Thomas",
    nom: "Dupont",
    description: "Entraînement match",
    duration: 120,
    maxInscrits: 5,
    inscrits: 2,
  },
  {
    jour: "Mardi",
    heureDebut: "14:00",
    activity: "Cinéma",
    prenom: "Sarah",
    nom: "Conor",
    description: "Sortie film SF",
    duration: 180,
    maxInscrits: 10,
    inscrits: 4,
  },
  {
    jour: "Jeudi",
    heureDebut: "10:30",
    activity: "Révision",
    prenom: "Alex",
    nom: "Martin",
    description: "Préparation partiels",
    duration: 90,
    maxInscrits: 4,
    inscrits: 1,
  },
];

const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"];

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

const buildInitialSchedule = () => {
  const schedule: { [key: string]: Slot } = {};

  initialPresets.forEach((preset, index) => {
    const actObj = activitiesData.find((a) => a.name === preset.activity);
    const color = actObj
      ? actObj.color
      : "bg-blue-100 border-blue-400 text-blue-800";

    const slotId = `preset-${index}`;
    const slot: Slot = {
      id: slotId,
      activity: preset.activity,
      prenom: preset.prenom,
      nom: preset.nom,
      description: preset.description,
      duration: preset.duration,
      color,
      maxInscrits: preset.maxInscrits,
      inscrits: preset.inscrits,
      estInscrit: false,
    };

    const numBlocks = preset.duration / 30;
    const startIndex = heures.indexOf(preset.heureDebut);

    if (startIndex !== -1) {
      const startKey = `${preset.jour}-${preset.heureDebut}`;
      schedule[startKey] = slot;

      for (let i = 1; i < numBlocks; i++) {
        const nextIndex = startIndex + i;
        if (nextIndex < heures.length) {
          const nextHeure = heures[nextIndex];
          const nextKey = `${preset.jour}-${nextHeure}`;
          schedule[nextKey] = { ...slot, isCovered: true };
        }
      }
    }
  });

  return schedule;
};

export default function AgendaApp() {
  const [description, setDescription] = useState("");
  const [selectedActivityName, setSelectedActivityName] = useState(
    activitiesData[0].name,
  );
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [duration, setDuration] = useState("60");
  const [maxInscrits, setMaxInscrits] = useState("5");
  const [generatedSlot, setGeneratedSlot] = useState<Slot | null>(null);

  const [schedule, setSchedule] = useState<{ [key: string]: Slot }>(
    buildInitialSchedule,
  );
  const [filterActivity, setFilterActivity] = useState("Tous");

  // État pour la modale de détails
  const [selectedSlotForModal, setSelectedSlotForModal] = useState<Slot | null>(
    null,
  );

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const actObj = activitiesData.find((a) => a.name === selectedActivityName);
    if (!actObj) return;

    setGeneratedSlot({
      id: `custom-${Date.now()}`,
      activity: actObj.name,
      prenom,
      nom,
      description,
      duration: parseInt(duration),
      color: actObj.color,
      maxInscrits: parseInt(maxInscrits),
      inscrits: 0,
      estInscrit: false,
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

  // Basculer l'inscription à un créneau
  const toggleInscription = (slotId: string) => {
    const updatedSchedule = { ...schedule };

    // On parcourt toutes les cases pour mettre à jour toutes les parties du créneau (s'il s'étale sur plusieurs blocs)
    Object.keys(updatedSchedule).forEach((key) => {
      const s = updatedSchedule[key];
      if (s.id === slotId) {
        if (s.estInscrit) {
          s.estInscrit = false;
          s.inscrits = Math.max(0, s.inscrits - 1);
        } else {
          if (s.inscrits < s.maxInscrits) {
            s.estInscrit = true;
            s.inscrits += 1;
          } else {
            alert("Ce créneau est complet !");
          }
        }
      }
    });

    setSchedule(updatedSchedule);
    if (selectedSlotForModal) {
      // Met à jour la modale ouverte
      const refSlot = Object.values(updatedSchedule).find(
        (s) => s.id === slotId,
      );
      if (refSlot) setSelectedSlotForModal({ ...refSlot });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden relative">
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
                value={selectedActivityName}
                onChange={(e) => setSelectedActivityName(e.target.value)}
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
                Prénom
              </label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded text-black bg-white"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                placeholder="Ex: Thomas"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">
                Nom
              </label>
              <input
                type="text"
                className="w-full mt-1 p-2 border rounded text-black bg-white"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Ex: Dupont"
                required
              />
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
                placeholder="Ex: Entraînement..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">
                Nombre max d'inscrits
              </label>
              <input
                type="number"
                className="w-full mt-1 p-2 border rounded text-black bg-white"
                value={maxInscrits}
                onChange={(e) => setMaxInscrits(e.target.value)}
                min="1"
                required
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

          {generatedSlot && (
            <div
              draggable
              className={`mt-6 p-4 border rounded cursor-grab shadow ${generatedSlot.color}`}
            >
              <h3 className="font-bold">{generatedSlot.activity}</h3>
              <p className="text-xs font-medium">
                {generatedSlot.prenom} {generatedSlot.nom}
              </p>
              <p className="text-xs mt-1">
                Places : 0/{generatedSlot.maxInscrits}
              </p>
              <span className="text-xs opacity-75 mt-2 block">
                (Glissez-moi)
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
              <div className="p-2 border-r text-gray-500 font-medium text-center flex items-center justify-center bg-gray-50 text-xs h-16">
                {heure}
              </div>

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
                        onClick={() => setSelectedSlotForModal(slotInCell)}
                        className={`absolute top-0 left-0 w-full p-2 border text-xs shadow-md overflow-hidden flex flex-col justify-between z-10 rounded cursor-pointer hover:opacity-90 transition ${slotInCell.color}`}
                        style={{
                          height: `${(slotInCell.duration / 30) * 4}rem`,
                        }}
                      >
                        <div>
                          <span className="font-bold truncate block">
                            {slotInCell.activity}
                          </span>
                          <span className="text-[10px] opacity-80">
                            {slotInCell.inscrits}/{slotInCell.maxInscrits}{" "}
                            inscrits
                          </span>
                        </div>

                        {/* Point rouge si inscrit */}
                        <div className="flex justify-center items-center pb-1">
                          {slotInCell.estInscrit && (
                            <span
                              className="w-2.5 h-2.5 bg-red-600 rounded-full shadow-sm"
                              title="Vous êtes inscrit"
                            ></span>
                          )}
                        </div>
                      </div>
                    ) : slotInCell && !isVisible ? (
                      <div className="absolute top-0 left-0 w-full h-full bg-gray-100 opacity-30 pointer-events-none"></div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* MODALE DE DÉTAILS DE L'ACTIVITÉ */}
      {selectedSlotForModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 text-black">
            <h3 className="text-xl font-bold mb-2">
              {selectedSlotForModal.activity}
            </h3>
            <p className="text-sm text-gray-600 mb-4 font-medium">
              Responsable : {selectedSlotForModal.prenom}{" "}
              {selectedSlotForModal.nom}
            </p>

            <div className="space-y-2 mb-6 bg-gray-50 p-3 rounded border">
              <p className="text-sm">
                <strong>Description :</strong>{" "}
                {selectedSlotForModal.description || "Aucune description"}
              </p>
              <p className="text-sm">
                <strong>Durée :</strong> {selectedSlotForModal.duration} minutes
              </p>
              <p className="text-sm">
                <strong>Inscriptions :</strong> {selectedSlotForModal.inscrits}{" "}
                / {selectedSlotForModal.maxInscrits} personnes
              </p>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => toggleInscription(selectedSlotForModal.id)}
                className={`px-4 py-2 rounded text-white font-semibold text-sm ${
                  selectedSlotForModal.estInscrit
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {selectedSlotForModal.estInscrit
                  ? "Se désinscrire"
                  : "S'inscrire"}
              </button>

              <button
                onClick={() => setSelectedSlotForModal(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded text-sm font-semibold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
