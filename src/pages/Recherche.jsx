import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ArtisanCard from "../components/artisan/ArtisanCard";
import { Helmet } from "react-helmet";

const API_URL = import.meta.env.VITE_API_URL;

export default function Recherche() {
  const [params] = useSearchParams();
  const query = params.get("query") || "";
  const category = params.get("category") || ""; // pour filtrer par catégorie si besoin

  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        let url = `${API_URL}/api/artisans`;

        if (category) {
          url = `${API_URL}/api/artisans/categorie/${encodeURIComponent(
            category
          )}`;
        } else if (query) {
          url = `${API_URL}/api/artisans/search?query=${encodeURIComponent(query)}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Erreur API recherche");

        const data = await res.json();

        const normalizedData = data.map((a) => ({
          id: a.id,
          nom: a.nom,
          specialite: a.specialite || "Indisponible",
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
  }, [query, category]);

  return (
    <div className="container py-4">
      <Helmet>
        <title>
          {category
            ? `Artisans ${category}`
            : query
            ? `Résultats : ${query}`
            : "Tous les artisans"}
        </title>
        <meta
          name="description"
          content={
            category
              ? `Liste des artisans pour la catégorie ${category}`
              : query
              ? `Résultats de recherche pour ${query}`
              : "Tous les artisans disponibles"
          }
        />
      </Helmet>

      <h2 className="fw-bold mb-4">
        {category
          ? `Artisans : ${category}`
          : query
          ? `Résultats pour « ${query} »`
          : "Tous les artisans"}
      </h2>

      {loading && <p className="text-center py-5">Chargement...</p>}
      {!loading && artisans.length === 0 && (
        <p className="text-center py-5">Aucun artisan trouvé.</p>
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
