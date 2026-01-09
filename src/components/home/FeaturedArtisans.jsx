import { useEffect, useState } from "react";
import ArtisanCard from "../artisan/ArtisanCard";
import { getTopArtisans } from "../../services/api";

export default function FeaturedArtisans() {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArtisans() {
      try {
        const data = await getTopArtisans();
           console.log(data); // <- Vérifie ici ce que tu reçois
        setArtisans(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des artisans :", error);
      } finally {
        setLoading(false);
      }
    }
    fetchArtisans();
  }, []);

  if (loading) {
    return <p className="text-center py-5">Chargement des artisans...</p>;
  }

  if (artisans.length === 0) {
    return <p className="text-center py-5">Aucun artisan disponible pour le moment.</p>;
  }

  return (
    <section className="py-5">
      <div className="container">
        <h2 className="text-center text-blue fw-bold mb-4">
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
    image={artisan.image}
    note={artisan.note}
  />
))}
        </div>
      </div>
    </section>
  );
}
