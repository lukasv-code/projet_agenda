"use client";
import { useState } from "react";
import Link from "next/link";

export default function PartenairePage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nomEntreprise: "",
    proposition: "",
    telephone: "",
    email: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Le formulaire ne fait rien de réel pour l'instant comme demandé
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-6 font-sans">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Devenir Partenaire
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Proposez votre activité pour l'ajouter à notre application
            </p>
          </div>
          <Link
            href="/"
            className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            ← Retour à l'agenda
          </Link>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-xl text-center space-y-3">
            <h3 className="font-bold text-lg">Merci pour votre demande !</h3>
            <p className="text-sm">
              Les informations de l'entreprise{" "}
              <strong>{formData.nomEntreprise}</strong> ont bien été prises en
              compte.
            </p>
            <Link
              href="/"
              className="inline-block mt-4 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
            >
              Retourner sur l'agenda
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Nom de l'entreprise
              </label>
              <input
                type="text"
                required
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ex: Fitness Club Paris"
                value={formData.nomEntreprise}
                onChange={(e) =>
                  setFormData({ ...formData, nomEntreprise: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Ce qu'elle propose (Activité)
              </label>
              <textarea
                required
                rows={3}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                placeholder="Décrivez l'activité proposée (ex: Cours de fitness, coaching...)"
                value={formData.proposition}
                onChange={(e) =>
                  setFormData({ ...formData, proposition: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="06 12 34 56 78"
                  value={formData.telephone}
                  onChange={(e) =>
                    setFormData({ ...formData, telephone: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="contact@entreprise.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium p-3 rounded-xl text-sm shadow-sm transition-all duration-200"
            >
              Envoyer la demande de partenariat
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
