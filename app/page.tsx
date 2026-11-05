"use client";
import { useState } from "react";
import Link from "next/link";

const activitiesData = [
  {
    id: "1",
    name: "Running Parc de Champagne",
    color: "bg-rose-100 border-rose-300 text-rose-900 hover:bg-rose-200",
  },
  {
    id: "2",
    name: "Séance BU (Bibliothèque)",
    color:
      "bg-indigo-100 border-indigo-300 text-indigo-900 hover:bg-indigo-200",
  },
  {
    id: "3",
    name: "Match Rugby / Hand",
    color: "bg-blue-100 border-blue-300 text-blue-900 hover:bg-blue-200",
  },
  {
    id: "4",
    name: "Soirée Place Drouet-d'Erlon",
    color:
      "bg-yellow-100 border-yellow-300 text-yellow-900 hover:bg-yellow-200",
  },
  {
    id: "5",
    name: "Basket (Complexes sportifs)",
    color:
      "bg-orange-100 border-orange-300 text-orange-900 hover:bg-orange-200",
  },
  {
    id: "6",
    name: "Ciné Opera / Gaumont",
    color:
      "bg-emerald-100 border-emerald-300 text-emerald-900 hover:bg-emerald-200",
  },
  {
    id: "7",
    name: "Jeux de société & Bar",
    color: "bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200",
  },
  {
    id: "8",
    name: "Piscine / Natation",
    color: "bg-cyan-100 border-cyan-300 text-cyan-900 hover:bg-cyan-200",
  },
  {
    id: "9",
    name: "FitnessPark",
    color: "bg-teal-100 border-teal-300 text-teal-900 hover:bg-teal-200",
  },
];

interface Slot {
  id: string;
  activity: string;
  prenom: string;
  nom: string;
  description: string;
  duration: number; // en minutes
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
    jour: "Lundi",
    heureDebut: "09:30",
    activity: "Révision",
    prenom: "Alex",
    nom: "Martin",
    description: "Session partiels en même temps",
    duration: 60,
    maxInscrits: 4,
    inscrits: 1,
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
    heureDebut: "9:00",
    activity: "Handball",
    prenom: "Sarah",
    nom: "Conor",
    description: "Sortie film SF",
    duration: 30,
    maxInscrits: 5,
    inscrits: 4,
  },
  {
    jour: "Vendredi",
    heureDebut: "10:00",
    activity: "Révision",
    prenom: "Alex",
    nom: "Martin",
    description: "Session partiels en même temps",
    duration: 60,
    maxInscrits: 4,
    inscrits: 2,
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
  const schedule: { [key: string]: Slot[] } = {};

  initialPresets.forEach((preset, index) => {
    const actObj = activitiesData.find((a) => a.name === preset.activity);
    const color = actObj
      ? actObj.color
      : "bg-blue-100 border-blue-300 text-blue-900";

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
      if (!schedule[startKey]) schedule[startKey] = [];
      schedule[startKey].push(slot);

      for (let i = 1; i < numBlocks; i++) {
        const nextIndex = startIndex + i;
        if (nextIndex < heures.length) {
          const nextHeure = heures[nextIndex];
          const nextKey = `${preset.jour}-${nextHeure}`;
          if (!schedule[nextKey]) schedule[nextKey] = [];
          schedule[nextKey].push({ ...slot, isCovered: true });
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

  const [schedule, setSchedule] = useState<{ [key: string]: Slot[] }>(
    buildInitialSchedule,
  );
  const [filterActivity, setFilterActivity] = useState("Tous");
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
    if (!newSchedule[startKey]) newSchedule[startKey] = [];
    newSchedule[startKey].push(generatedSlot);

    for (let i = 1; i < numBlocks; i++) {
      const nextIndex = startIndex + i;
      if (nextIndex < heures.length) {
        const nextHeure = heures[nextIndex];
        const nextKey = `${jour}-${nextHeure}`;
        if (!newSchedule[nextKey]) newSchedule[nextKey] = [];
        newSchedule[nextKey].push({
          ...generatedSlot,
          isCovered: true,
        });
      }
    }

    setSchedule(newSchedule);
    setGeneratedSlot(null);
  };

  const toggleInscription = (slotId: string) => {
    const updatedSchedule = { ...schedule };

    Object.keys(updatedSchedule).forEach((key) => {
      updatedSchedule[key] = updatedSchedule[key].map((s) => {
        if (s.id === slotId) {
          const newEstInscrit = !s.estInscrit;
          const newInscrits = newEstInscrit
            ? Math.min(s.maxInscrits, s.inscrits + 1)
            : Math.max(0, s.inscrits - 1);
          return { ...s, estInscrit: newEstInscrit, inscrits: newInscrits };
        }
        return s;
      });
    });

    setSchedule(updatedSchedule);
    if (selectedSlotForModal) {
      let found = null;
      Object.values(updatedSchedule).forEach((slotList) => {
        const match = slotList.find((s) => s.id === slotId);
        if (match) found = match;
      });
      if (found) setSelectedSlotForModal(found);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans overflow-hidden relative">
      {/* COLONNE DE GAUCHE : Générateur */}
      <div className="w-80 bg-white border-r border-slate-200 shadow-sm flex flex-col overflow-y-auto p-6 h-full">
        <div>
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">
              Mon Agenda
            </h1>
          </div>

          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            Générer un créneau
          </h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Activité
              </label>
              <select
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Prénom
                </label>
                <input
                  type="text"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  placeholder="Prénom"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="Nom"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Description
              </label>
              <input
                type="text"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Entraînement..."
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Max Inscrits
                </label>
                <input
                  type="number"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={maxInscrits}
                  onChange={(e) => setMaxInscrits(e.target.value)}
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Durée
                </label>
                <select
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option value="30">30 min</option>
                  <option value="60">1h00</option>
                  <option value="90">1h30</option>
                  <option value="120">2h00</option>
                  <option value="150">2h30</option>
                  <option value="180">3h00</option>
                  <option value="240">4h00</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium p-2.5 rounded-lg text-sm shadow-sm transition-all duration-200"
            >
              Créer le créneau
            </button>
          </form>

          {generatedSlot && (
            <div
              draggable
              className={`mt-6 p-4 border rounded-xl cursor-grab shadow-sm transition-transform active:scale-95 ${generatedSlot.color}`}
            >
              <h3 className="font-bold text-sm">{generatedSlot.activity}</h3>
              <p className="text-xs font-medium opacity-80">
                {generatedSlot.prenom} {generatedSlot.nom}
              </p>
              <div className="mt-3 flex justify-between items-center text-[11px] font-semibold opacity-75">
                <span>Glissez vers l'EDT</span>
                <span>0/{generatedSlot.maxInscrits} max</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* COLONNE DE DROITE : Grille Emploi du temps */}
      <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden p-8">
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Emploi du temps
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Semaine complète (8h00 - 00h00)
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <label className="text-xs font-semibold text-slate-600 pl-2">
              Filtrer :
            </label>
            <select
              className="bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 p-2 focus:outline-none"
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

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-y-auto flex-1 relative">
          <div className="grid grid-cols-6 border-b border-slate-200 bg-slate-100 text-slate-700 font-semibold text-xs text-center sticky top-0 z-30">
            <div className="p-3.5 border-r border-slate-200 text-slate-500">
              Heures
            </div>
            {jours.map((jour) => (
              <div
                key={jour}
                className="p-3.5 border-r border-slate-200 last:border-r-0 tracking-wide uppercase text-[11px]"
              >
                {jour}
              </div>
            ))}
          </div>

          <div className="divide-y divide-slate-100">
            {heures.map((heure) => (
              <div key={heure} className="grid grid-cols-6 h-16">
                <div className="p-2 border-r border-slate-200 text-slate-400 font-medium text-center flex items-center justify-center bg-slate-50/50 text-[11px]">
                  {heure}
                </div>

                {jours.map((jour) => {
                  const cellKey = `${jour}-${heure}`;
                  const slotsInCell = schedule[cellKey] || [];
                  const activeSlots = slotsInCell.filter(
                    (s) => !s.isCovered && s.inscrits < s.maxInscrits,
                  );
                  const visibleSlots =
                    filterActivity === "Tous"
                      ? activeSlots
                      : activeSlots.filter(
                          (s) => s.activity === filterActivity,
                        );

                  return (
                    <div
                      key={jour}
                      className="border-r border-slate-200 last:border-r-0 relative hover:bg-indigo-50/20 transition-colors h-16"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(jour, heure)}
                    >
                      {visibleSlots.length > 0 && (
                        <div className="absolute top-0 left-0 w-full z-10 flex px-1 pt-1">
                          {visibleSlots.length === 1 ? (
                            <div
                              onClick={() =>
                                setSelectedSlotForModal(visibleSlots[0])
                              }
                              className={`w-full p-2 border text-xs shadow-sm overflow-hidden flex flex-col justify-between rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] ${visibleSlots[0].color}`}
                              style={{
                                height: `${(visibleSlots[0].duration / 30) * 4 - 0.5}rem`,
                              }}
                            >
                              <div className="flex justify-between items-start">
                                <span className="font-bold truncate text-slate-900">
                                  {visibleSlots[0].activity}
                                </span>
                                <span className="text-[10px] font-semibold bg-white/60 px-1.5 py-0.5 rounded-full text-slate-600">
                                  {visibleSlots[0].inscrits}/
                                  {visibleSlots[0].maxInscrits}
                                </span>
                              </div>
                              <div className="flex justify-center items-center pb-0.5">
                                {visibleSlots[0].estInscrit && (
                                  <span
                                    className="w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white shadow-sm"
                                    title="Inscrit"
                                  ></span>
                                )}
                              </div>
                            </div>
                          ) : (
                            // Affichage côte à côte strict ancré sur la ligne exacte de la demi-heure
                            <div className="w-full flex gap-1 items-start">
                              {visibleSlots.map((slot) => (
                                <div
                                  key={slot.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSlotForModal(slot);
                                  }}
                                  className={`flex-1 p-1.5 border text-[10px] shadow-sm overflow-hidden flex flex-col justify-between rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] ${slot.color}`}
                                  style={{
                                    height: `${(slot.duration / 30) * 4 - 0.5}rem`,
                                  }}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-bold truncate text-slate-900 leading-tight">
                                      {slot.activity}
                                    </span>
                                    <span className="text-[9px] opacity-75">
                                      {slot.inscrits}/{slot.maxInscrits}
                                    </span>
                                  </div>
                                  <div className="flex justify-center items-center pb-0.5">
                                    {slot.estInscrit && (
                                      <span
                                        className="w-1.5 h-1.5 bg-rose-500 rounded-full ring-1 ring-white shadow-sm"
                                        title="Inscrit"
                                      ></span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOUTON FLOTTANT : Partenaire */}
      <Link
        href="/partenaire"
        className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-full shadow-lg transition-all duration-200 flex items-center space-x-2 hover:scale-105"
      >
        <span>🤝</span>
        <span>Je voudrais être partenaire</span>
      </Link>

      {/* MODALE DE DÉTAILS */}
      {selectedSlotForModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md text-slate-800 border border-slate-100 animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-semibold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  Activité
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-2">
                  {selectedSlotForModal.activity}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSlotForModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Responsable :</span>
                <span className="font-medium text-slate-800">
                  {selectedSlotForModal.prenom} {selectedSlotForModal.nom}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Description :</span>
                <span className="font-medium text-slate-800 text-right">
                  {selectedSlotForModal.description || "Aucune description"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Durée :</span>
                <span className="font-medium text-slate-800">
                  {selectedSlotForModal.duration} minutes
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Inscrits :</span>
                <span className="font-medium text-slate-800">
                  {selectedSlotForModal.inscrits} /{" "}
                  {selectedSlotForModal.maxInscrits} personnes
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => toggleInscription(selectedSlotForModal.id)}
                className={`w-full py-2.5 rounded-xl text-white font-medium text-sm shadow-sm transition-all duration-200 ${
                  selectedSlotForModal.estInscrit
                    ? "bg-rose-500 hover:bg-rose-600 shadow-rose-100"
                    : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
                }`}
              >
                {selectedSlotForModal.estInscrit
                  ? "Se désinscrire"
                  : "S'inscrire à l'activité"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
