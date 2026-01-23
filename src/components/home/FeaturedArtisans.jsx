import { useEffect, useState } from "react";
import ArtisanCard from "../artisan/ArtisanCard";
import { getTopArtisans } from "../../services/api";

/**
 * Section affichant les artisans mis en avant (artisans du mois)
 */
export default function FeaturedArtisans() {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArtisans() {
      try {
        const data = await getTopArtisans();

        if (!Array.isArray(data)) {
          throw new Error("Format de données invalide");
        }

        setArtisans(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des artisans :", err);
        setError("Impossible de charger les artisans pour le moment.");
      } finally {
        setLoading(false);
      }
    }

    fetchArtisans();
  }, []);

  if (loading) {
    return (
      <p className="text-center py-5" role="status">
        Chargement des artisans...
      </p>
    );
  }

  if (error) {
    return (
      <p className="text-center py-5 text-danger">
        {error}
      </p>
    );
  }

  if (artisans.length === 0) {
    return (
      <p className="text-center py-5">
        Aucun artisan disponible pour le moment.
      </p>
    );
  }

  return (
    <section className="py-5" aria-labelledby="featured-artisans-title">
      <div className="container">
        <h2
          id="featured-artisans-title"
          className="text-center text-blue fw-bold mb-4"
        >
          Les artisans du mois
        </h2>

        <div className="row g-4">
          {artisans.map((artisan) => (
            <ArtisanCard
              key={artisan.id}
              id={artisan.id}
              title={artisan.nom}
              job={artisan.specialite}
              city={artisan.ville}
              department={artisan.departement} 
              image={artisan.image}
              note={artisan.note}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
