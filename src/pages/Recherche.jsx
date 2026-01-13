import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ArtisanCard from "../components/artisan/ArtisanCard";
import { Helmet } from "react-helmet";

const API_URL = "https://app-18bf639f-8d94-41fd-a987-21054a62c8c2.cleverapps.io";


export default function Recherche() {
  const [params] = useSearchParams();
  const query = params.get("query") || "";
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

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

        // ✅ Normalisation MariaDB
        const normalizedData = data.map((a) => ({
          id: a.id,
          nom: a.nom,
          specialite: a.specialite,
          ville: a.ville,
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
      <Helmet>
        <title>
          Recherche{query ? ` : ${query}` : ""}
        </title>
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

      {loading && <p>Chargement...</p>}

      {!loading && artisans.length === 0 && (
        <p>Aucun artisan trouvé.</p>
      )}

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
