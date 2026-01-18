import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ArtisanCard from "../components/artisan/ArtisanCard";
import { getAllArtisans } from "../services/artisan.service";

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

  const normalize = (str = "") =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  useEffect(() => {
    async function loadArtisans() {
      try {
        const data = await getAllArtisans();
        setArtisans(data);
        setFilteredArtisans(data);

        // 🔹 Catégories uniques
        setCategories(
          [...new Set(data.map((a) => a.categorie?.nom).filter(Boolean))].sort()
        );

        // 🔹 Départements uniques
        const uniqueDeps = Array.from(
          new Map(
            data
              .map((a) => a.ville?.departement)
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

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, artisans, categorie, departement, ville]);

  const handleSearch = () => {
    let results = artisans;

    if (query.trim()) {
      results = results.filter((a) => normalize(a.nom).includes(normalize(query)));
    }

    if (categorie !== "Tous") {
      results = results.filter((a) => normalize(a.categorie?.nom) === normalize(categorie));
    }

    if (departement !== "Tous") {
      results = results.filter(
        (a) => String(a.ville?.departement?.id) === departement
      );
    }

    if (ville.trim()) {
      results = results.filter((a) => normalize(a.ville?.nom).includes(normalize(ville)));
    }

    setFilteredArtisans(results);
  };

  if (loading) return <p className="text-center py-5">Chargement...</p>;

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

            <div className="mb-3">
              <label className="form-label small">Catégorie</label>
              <select
                className="form-select form-select-sm"
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
              >
                <option value="Tous">Toutes</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

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
            {filteredArtisans.length} artisan{filteredArtisans.length > 1 ? "s" : ""}
          </p>

          <div className="row g-4">
            {filteredArtisans.map((artisan) => (
              <ArtisanCard
                key={artisan.id}
                id={artisan.id}
                title={artisan.nom}
                job={artisan.specialite_obj?.nom}
                city={artisan.ville?.nom}
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
