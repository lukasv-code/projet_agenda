"tsx";
"use client";
import { useState } from "react";
import activitiesData from "@/public/activities.json";

export default function AgendaApp() {
  const [description, setDescription] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(
    activitiesData[0].name,
  );
  const [duration, setDuration] = useState("30"); // en minutes
  const [generatedSlot, setGeneratedSlot] = useState(null);

  const handleGenerate = (e) => {
    e.preventDefault();
    setGeneratedSlot({
      activity: selectedActivity,
      description,
      duration: parseInt(duration),
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* COLONNE DE GAUCHE : Générateur */}
      <div className="w-1/3 p-6 bg-white border-r shadow-md">
        <h2 className="text-xl font-bold mb-4">Générer un créneau</h2>
        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Activité</label>
            <select
              className="w-full mt-1 p-2 border rounded"
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
            <label className="block text-sm font-medium">Description</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Chapitre 1 - Introduction"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Durée</label>
            <select
              className="w-full mt-1 p-2 border rounded"
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
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Créer le créneau
          </button>
        </form>

        {/* Zone du créneau prêt à être glissé */}
        {generatedSlot && (
          <div
            draggable
            className="mt-6 p-4 bg-blue-100 border border-blue-300 rounded cursor-grab shadow"
          >
            <h3 className="font-bold">{generatedSlot.activity}</h3>
            <p className="text-sm">{generatedSlot.description}</p>
            <span className="text-xs text-gray-600">
              Durée : {generatedSlot.duration} min
            </span>
          </div>
        )}
      </div>

      {/* COLONNE DE DROITE : Grille Emploi du Temps */}
      <div className="w-2/3 p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Emploi du temps</h2>
        <div className="bg-white rounded shadow border">
          {["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00"].map(
            (time) => (
              <div key={time} className="flex border-b h-16 items-center px-4">
                <span className="w-16 text-gray-500 font-semibold">{time}</span>
                <div
                  className="flex-1 border-l pl-4 h-full flex items-center bg-gray-50 hover:bg-gray-100 transition"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    alert(`Créneau déposé à ${time} !`);
                  }}
                >
                  <span className="text-gray-400 text-sm italic">
                    Glissez votre créneau ici
                  </span>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
