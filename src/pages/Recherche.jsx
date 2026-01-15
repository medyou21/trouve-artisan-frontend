/* import { useEffect, useState } from "react";
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
      {/* 🔹 SEO dynamique avec React Helmet *//*}

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

      {/* 🔹 États de chargement et résultats vides *//*}
      {loading && <p className="text-center">Chargement...</p>}
      {!loading && artisans.length === 0 && (
        <p className="text-center">Aucun artisan trouvé.</p>
      )}

      {/* 🔹 Liste des artisans *//*}
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
 */


import { useEffect, useState } from "react";
import { Link, useSearchParams, useLocation } from "react-router-dom";
import { getArtisansByCategorie } from "../services/artisan.service";

/**
 * Page listant les artisans selon une catégorie ou une recherche
 */
export default function ArtisanList() {
  const location = useLocation();
  const [params] = useSearchParams();
  const query = params.get("query") || ""; // recherche
  const category = params.get("categorie") || ""; // catégorie
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  // Normalisation pour affichage et filtre
  const normalize = (str = "") =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  useEffect(() => {
    async function fetchArtisans() {
      setLoading(true);
      try {
        let data = [];

        if (category) {
          data = await getArtisansByCategorie(category);
        } else if (query) {
          const res = await fetch(
            `${import.meta.env.VITE_API_URL}/api/artisans/search?query=${encodeURIComponent(query)}`
          );
          if (!res.ok) throw new Error("Erreur API recherche");
          data = await res.json();
        } else {
          // Par défaut, tous les artisans
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/artisans`);
          if (!res.ok) throw new Error("Erreur API");
          data = await res.json();
        }

        // Normalisation des données
        const normalizedData = data.map((a) => ({
          id: a.id,
          nom: a.nom,
          specialite: a.specialite,
          ville: a.ville || "",
          departement: a.departement || "",
          note: Number(a.note) || 0,
          image: a.image || "/images/placeholder.jpg",
        }));

        setArtisans(normalizedData);
      } catch (err) {
        console.error("Erreur récupération artisans :", err);
        setArtisans([]);
      } finally {
        setLoading(false);
      }
    }

    fetchArtisans();
  }, [query, category, location.pathname]);

  // Affichage étoiles
  const renderStars = (note) => {
    const rounded = Math.round(note);
    return (
      <>
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rounded ? "text-warning" : "text-muted"}>
            ★
          </span>
        ))}
        <span className="ms-2 small text-muted">{note}/5</span>
      </>
    );
  };

  if (loading) return <p className="text-center py-5">Chargement...</p>;

  if (artisans.length === 0)
    return <p className="text-center py-5">Aucun artisan trouvé.</p>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">
        {category
          ? `Artisans dans la catégorie "${category}"`
          : query
          ? `Résultats pour "${query}"`
          : "Tous les artisans"}
      </h2>

      <div className="row g-4">
        {artisans.map((artisan) => (
          <div className="col-12 col-md-6 col-lg-4" key={artisan.id}>
            <Link
              to={`/artisan/${artisan.id}`}
              className="text-decoration-none"
            >
              <div className="card shadow-sm h-100">
                <img
                  src={artisan.image}
                  alt={artisan.nom}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title text-blue">{artisan.nom}</h5>
                  <p className="mb-1">{renderStars(artisan.note)}</p>
                  <p className="mb-1">
                    <strong>Spécialité:</strong> {artisan.specialite || "Indisponible"}
                  </p>
                  <p className="mb-0">
                    <strong>Localisation:</strong>{" "}
                    {artisan.ville} {artisan.departement && `(${artisan.departement})`}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
