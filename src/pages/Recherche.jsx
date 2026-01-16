import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ArtisanCard from "../components/artisan/ArtisanCard";
import { getArtisansByCategorie } from "../services/artisan.service";

export default function Recherche() {
  const [params] = useSearchParams();
  const query = params.get("query") || "";

  const [artisans, setArtisans] = useState([]);
  const [filteredArtisans, setFilteredArtisans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departements, setDepartements] = useState([]);

  const [categorie, setCategorie] = useState("Tous");
  const [departement, setDepartement] = useState("Tous");
  const [ville, setVille] = useState("");

  const [loading, setLoading] = useState(true);

  // 🔹 Normalisation texte pour comparaison
  const normalize = (str = "") =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // 🔹 Chargement initial : tous les artisans
  useEffect(() => {
    async function loadArtisans() {
      try {
        // On charge toutes les catégories d’abord
        const categoriesRes = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`);
        const categoriesData = await categoriesRes.json();

        setCategories(categoriesData.map((c) => ({ id: c.id, nom: c.nom })));

        // Pour chaque catégorie, on récupère les artisans
        let allArtisans = [];
        for (const cat of categoriesData) {
          const catArtisans = await getArtisansByCategorie(cat.id);
          allArtisans = [...allArtisans, ...catArtisans];
        }

        setArtisans(allArtisans);
        setFilteredArtisans(allArtisans);

        // Départements uniques pour le filtre
        const uniqueDepartements = [
          ...new Set(allArtisans.map((a) => a.departement).filter(Boolean)),
        ].sort();
        setDepartements(uniqueDepartements);
      } catch (error) {
        console.error("Erreur chargement artisans :", error);
      } finally {
        setLoading(false);
      }
    }

    loadArtisans();
  }, []);

  // 🔹 Filtrage automatique par query
  useEffect(() => {
    let results = artisans;

    if (query.trim()) {
      results = results.filter((a) =>
        normalize(a.nom).includes(normalize(query))
      );
    }

    setFilteredArtisans(results);
  }, [query, artisans]);

  // 🔹 Application des filtres manuels
  const handleSearch = () => {
    let results = [...artisans];

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
                  <option key={cat.id} value={cat.nom}>
                    {cat.nom}
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
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                placeholder="Ex : Lyon"
              />
            </div>

            <button className="btn btn-primary btn-sm w-100" onClick={handleSearch}>
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

          {filteredArtisans.length === 0 && (
            <p className="text-center text-muted py-4">
              Aucun artisan ne correspond à votre recherche.
            </p>
          )}

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
