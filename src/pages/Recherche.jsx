import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ArtisanCard from "../components/artisan/ArtisanCard";
import { getArtisansByCategorie } from "../services/artisan.service";

export default function Recherche() {
  const [params] = useSearchParams();
  const query = params.get("query") || "";

  // 🔹 États
  const [artisans, setArtisans] = useState([]);
  const [filteredArtisans, setFilteredArtisans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departements, setDepartements] = useState([]);

  const [categorie, setCategorie] = useState("Tous");
  const [departement, setDepartement] = useState("Tous");
  const [ville, setVille] = useState("");

  const [loading, setLoading] = useState(true);

  // 🔹 Normalisation texte
  const normalize = (str = "") =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // 🔹 Chargement initial : tous les artisans
  useEffect(() => {
    async function loadArtisans() {
      try {
        // Ici on peut charger tous les artisans ou par catégorie si nécessaire
        const data = await fetch(`${import.meta.env.VITE_API_URL}/api/artisans`)
          .then(res => res.json());

        // 🔹 Normalisation et récupération des relations
        const normalizedData = data.map((a) => ({
          id: a.id,
          nom: a.nom || "Indisponible",
          specialite: a.specialite_obj?.nom || "Non précisée",
          ville: a.ville_obj?.nom || "Indisponible",
          departement: a.departement_obj?.nom || "",
          categorie: a.categorie?.nom || "",
          note: Number(a.note) || 0,
          image: a.image || "/images/placeholder.jpg",
        }));

        setArtisans(normalizedData);
        setFilteredArtisans(normalizedData);

        // 🔹 Liste unique des catégories et départements
        setCategories(
          [...new Set(normalizedData.map(a => a.categorie).filter(Boolean))].sort()
        );

        setDepartements(
          [...new Set(normalizedData.map(a => a.departement).filter(Boolean))].sort()
        );
      } catch (error) {
        console.error("Erreur chargement artisans :", error);
      } finally {
        setLoading(false);
      }
    }

    loadArtisans();
  }, []);

  // 🔹 Synchronisation avec la recherche du header (nom)
  useEffect(() => {
    let results = artisans;

    if (query.trim()) {
      results = results.filter((a) =>
        normalize(a.nom).includes(normalize(query))
      );
    }

    setFilteredArtisans(results);
  }, [query, artisans]);

  // 🔹 Application des filtres
  const handleSearch = () => {
    let results = artisans;

    if (query.trim()) {
      results = results.filter((a) =>
        normalize(a.nom).includes(normalize(query))
      );
    }

    if (categorie !== "Tous") {
      results = results.filter(
        (a) => normalize(a.categorie) === normalize(categorie)
      );
    }

    if (departement !== "Tous") {
      results = results.filter(
        (a) => normalize(a.departement) === normalize(departement)
      );
    }

    if (ville.trim()) {
      results = results.filter((a) =>
        normalize(a.ville).includes(normalize(ville))
      );
    }

    setFilteredArtisans(results);
  };

  if (loading) {
    return <p className="text-center py-5">Chargement...</p>;
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">
        {query ? `Résultats pour « ${query} »` : "Tous les artisans"}
      </h2>

      <div className="row">
        {/* FILTRES */}
        <aside className="col-md-3 mb-4">
          <div className="border rounded p-3 bg-light">
            <h6 className="fw-bold mb-3">Filtres</h6>

            {/* Catégorie */}
            <div className="mb-3">
              <label className="form-label small">Catégorie</label>
              <select
                className="form-select form-select-sm"
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
              >
                <option value="Tous">Toutes</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Département */}
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

            {/* Ville */}
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

        {/* LISTE DES ARTISANS */}
        <section className="col-md-9">
          <p className="small text-muted mb-3">
            {filteredArtisans.length} artisan
            {filteredArtisans.length > 1 ? "s" : ""}
          </p>

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
