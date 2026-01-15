import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ArtisanCard from "../components/artisan/ArtisanCard";
import { Helmet } from "react-helmet";

const API_URL = import.meta.env.VITE_API_URL;

export default function Recherche() {
  const [params] = useSearchParams();
  const query = params.get("query") || "";

  // ✅ États du composant
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch des résultats depuis l'API
  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        let url = `${API_URL}/api/artisans`;

        if (query) {
          url = `${API_URL}/api/artisans/search?query=${encodeURIComponent(
            query
          )}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Erreur API recherche");

        const data = await res.json();

        // ✅ Normalisation des données
        const normalizedData = data.map((a) => ({
          id: a.id,
          nom: a.nom,
          specialite: a.specialite,
          ville: a.ville || "Indisponible",
          note: Number(a.note) || 0,
          image: a.image || "/images/placeholder.jpg",
        }));

        setArtisans(normalizedData);
      } catch (err) {
        console.error("Erreur recherche :", err);
        setArtisans([]);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [query]);

  return (
    <div className="container py-4">
      {/* 🔹 SEO dynamique avec React Helmet */}
      <Helmet>
        <title>Recherche{query ? ` : ${query}` : ""}</title>
        <meta
          name="description"
          content={
            query
              ? `Résultats de recherche pour ${query}`
              : "Tous les artisans disponibles"
          }
        />
      </Helmet>

      <h2 className="fw-bold mb-4">
        {query ? `Résultats pour « ${query} »` : "Tous les artisans"}
      </h2>

      {/* 🔹 États de chargement et résultats vides */}
      {loading && <p className="text-center">Chargement...</p>}
      {!loading && artisans.length === 0 && (
        <p className="text-center">Aucun artisan trouvé.</p>
      )}

      {/* 🔹 Liste des artisans */}
      <div className="row g-4">
        {artisans.map((artisan) => (
          <ArtisanCard
            key={artisan.id}
            id={artisan.id}
            title={artisan.nom}
            job={artisan.specialite}
            city={artisan.ville}
            note={artisan.note}
            image={artisan.image}
          />
        ))}
      </div>
    </div>
  );
}
