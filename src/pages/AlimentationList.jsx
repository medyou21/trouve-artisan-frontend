import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ArtisanCard from "../components/artisan/ArtisanCard";
import { getArtisansByCategorie } from "../services/artisan.service";

export default function Services() {
  const [artisans, setArtisans] = useState([]);
  const [filteredArtisans, setFilteredArtisans] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [departement, setDepartement] = useState("Tous");
  const [ville, setVille] = useState("");

  // 🔹 Normalisation
  const normalize = (str = "") =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // 🔹 Chargement des artisans
  useEffect(() => {
    async function loadArtisans() {
      try {
        // ⚠️ ID réel de la catégorie Alimentation
        const data = await getArtisansByCategorie(2);

        // 🔹 Normalisation
        const normalized = data.map((a) => ({
          id: a.id,
          nom: a.nom || "Indisponible",
          specialite: a.specialite || "Non précisée",
          ville: a.ville || "Indisponible",
          departement: a.departement || null,
          note: a.note || 0,
          image: a.image || "/images/placeholder.jpg",
        }));

        setArtisans(normalized);
        setFilteredArtisans(normalized);

        // 🔹 Départements uniques
        const uniqueDeps = Array.from(
          new Map(
            normalized
              .map((a) => a.departement)
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
  }, [artisans, departement, ville]);

  const handleSearch = () => {
    let results = [...artisans];

    // 🔹 Filtre département
    if (departement !== "Tous") {
      results = results.filter(
        (a) => String(a.departement?.id) === String(departement)
      );
    }

    // 🔹 Filtre ville
    if (ville.trim()) {
      results = results.filter((a) => normalize(a.ville).includes(normalize(ville)));
    }

    setFilteredArtisans(results);
  };

  if (loading) return <p className="text-center py-5">Chargement des artisans…</p>;

  return (
    <main className="container py-4">
      {/* Fil d'Ariane */}
      <nav aria-label="Fil d’Ariane">
        <p className="small text-muted">
          <Link to="/" className="nav-link d-inline p-0">
            Accueil
          </Link>{" "}
          / <strong>Alimentation</strong>
        </p>
      </nav>

      <h1 className="fw-bold mb-4">Trouver un artisan de l’alimentation</h1>

      <div className="row">
        {/* FILTRES */}
        <aside className="col-md-3 mb-4">
          <div className="border rounded p-3 bg-light">
            <h6 className="fw-bold mb-3">Filtrer les résultats</h6>

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
                  <option key={dep.id} value={dep.id}>
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

            <button
              className="btn btn-primary btn-sm w-100"
              onClick={handleSearch}
            >
              Rechercher
            </button>
          </div>
        </aside>

        {/* LISTE ARTISANS */}
        <section className="col-md-9">
          <p className="small text-muted mb-3">
            {filteredArtisans.length} artisan
            {filteredArtisans.length > 1 ? "s" : ""} trouvé
            {filteredArtisans.length > 1 ? "s" : ""}
          </p>

          {filteredArtisans.length === 0 && (
            <p className="text-center text-muted py-4">
              Aucun artisan ne correspond à votre recherche.
            </p>
          )}

          <div className="row g-4">
            {filteredArtisans.map((a) => (
              <ArtisanCard
                key={a.id}
                id={a.id}
                title={a.nom}
                job={a.specialite}
                city={a.ville}
                note={a.note}
                image={a.image}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
