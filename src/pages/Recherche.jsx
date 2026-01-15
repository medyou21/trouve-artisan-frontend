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
import { useParams } from "react-router-dom";
import ArtisanCard from "../components/artisan/ArtisanCard";
import { getArtisansByCategorie } from "../services/artisan.service";

/**
 * Page affichant les artisans d'une catégorie
 */
export default function ArtisanByCategory() {
  const { id } = useParams(); // id = nom de la catégorie
  const [artisans, setArtisans] = useState([]);
  const [filteredArtisans, setFilteredArtisans] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departement, setDepartement] = useState("Tous");
  const [ville, setVille] = useState("");

  // Normalisation pour comparer sans accents
  const normalize = (str = "") =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  // Chargement des artisans par catégorie
  useEffect(() => {
    async function loadArtisans() {
      setLoading(true);
      try {
        const data = await getArtisansByCategorie(id);

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
        setFilteredArtisans(normalizedData);

        const uniqueDepartements = [
          ...new Set(normalizedData.map((a) => a.departement).filter(Boolean)),
        ].sort();

        setDepartements(uniqueDepartements);
      } catch (err) {
        console.error("Erreur chargement artisans :", err);
      } finally {
        setLoading(false);
      }
    }

    loadArtisans();
  }, [id]);

  // Filtrage par département et ville
  const handleSearch = () => {
    let results = artisans;

    if (departement !== "Tous") {
      results = results.filter(
        (a) => normalize(a.departement) === normalize(departement)
      );
    }

    if (ville.trim() !== "") {
      results = results.filter((a) =>
        normalize(a.ville).includes(normalize(ville))
      );
    }

    setFilteredArtisans(results);
  };

  if (loading) return <p className="text-center py-5">Chargement...</p>;
  if (!artisans.length) return <p className="text-center py-5">Aucun artisan trouvé.</p>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Artisans dans la catégorie "{id}"</h2>

      <div className="row">
        {/* FILTRES */}
        <aside className="col-md-3 mb-4">
          <div className="border rounded p-3 bg-light">
            <h6 className="fw-bold mb-3">Filtrer les résultats</h6>

            <div className="mb-3">
              <label className="form-label small">Département</label>
              <select
                className="form-select form-select-sm"
                value={departement}
                onChange={(e) => setDepartement(e.target.value)}
              >
                <option value="Tous">Tous</option>
                {departements.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label small">Ville</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Ex : Lyon"
                value={ville}
                onChange={(e) => setVille(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary btn-sm w-100"
              onClick={handleSearch}
            >
              Rechercher
            </button>
          </div>
        </aside>

        {/* LISTE */}
        <section className="col-md-9">
          <div className="row g-4">
            {filteredArtisans.map((artisan) => (
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
        </section>
      </div>
    </div>
  );
}
