import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ArtisanCard from "../components/artisan/ArtisanCard";
import { getAllArtisans } from "../services/artisan.service";

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

  // 🔹 Chargement initial
  useEffect(() => {
    async function loadArtisans() {
      try {
        const data = await getAllArtisans();

        setArtisans(data);
        setFilteredArtisans(data);

        // 🔹 Catégories uniques
        const uniqueCats = [...new Set(data.map((a) => a.categorie).filter(Boolean))].sort();
        setCategories(uniqueCats);

        // 🔹 Départements uniques
        const uniqueDeps = Array.from(
          new Map(
            data
              .map((a) => a.departement) // ✅ utiliser champ normalisé
              .filter(Boolean)
              .map((d) => [d.id, d])
          ).values()
        );
        setDepartements(uniqueDeps);
      } catch (err) {
        console.error("Erreur chargement artisans :", err);
      } finally {
        setLoading(false);
      }
    }

    loadArtisans();
  }, []);

  // 🔹 Appliquer les filtres à chaque changement
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, artisans, categorie, departement, ville]);

  const handleSearch = () => {
    let results = artisans;

    // 🔹 Recherche par nom
    if (query.trim()) {
      results = results.filter((a) => normalize(a.nom).includes(normalize(query)));
    }

    // 🔹 Filtre catégorie
    if (categorie !== "Tous") {
      results = results.filter((a) => normalize(a.categorie) === normalize(categorie));
    }

    // 🔹 Filtre département
    if (departement !== "Tous") {
      results = results.filter((a) => String(a.departement?.id) === departement);
    }

    // 🔹 Filtre ville
    if (ville.trim()) {
      results = results.filter((a) => normalize(a.ville).includes(normalize(ville)));
    }

    setFilteredArtisans(results);
  };

  if (loading) return <p className="text-center py-5">Chargement...</p>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold text-blue mb-4">
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
                  <option key={dep.id} value={String(dep.id)}>
                    {dep.code} - {dep.nom}
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

            <button className="btn btn-primary btn-sm w-100" onClick={handleSearch}>
              Rechercher
            </button>
          </div>
        </aside>

        {/* LISTE ARTISANS */}
        <section className="col-md-9">
         <p className="small text-muted mb-3">
  {filteredArtisans.length}{" "}
  artisan{filteredArtisans.length > 1 ? "s" : ""}{" "}
  au total
</p>


          <div className="row g-4">
            {filteredArtisans.map((artisan) => (
              <ArtisanCard
                key={artisan.id}
                id={artisan.id}
                title={artisan.nom}
                job={artisan.specialite}
                city={artisan.ville}
                 department={artisan.departement}
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
