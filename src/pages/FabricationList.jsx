import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ArtisanCard from "../components/artisan/ArtisanCard";
import { getArtisansByCategorie } from "../services/artisan.service";

/**
 * Page Fabrication
 * Affiche les artisans de la catégorie "Fabrication"
 * avec filtres par département et ville.
 */
export default function Fabrication() {
  const [artisans, setArtisans] = useState([]);
  const [filteredArtisans, setFilteredArtisans] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [departement, setDepartement] = useState("Tous");
  const [ville, setVille] = useState("");

  /**
   * Normalisation chaîne :
   * - Supprime les accents
   * - Ignore la casse
   */
  const normalize = (str = "") =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  /**
   * Chargement des artisans via l'API
   */
  useEffect(() => {
    async function loadArtisans() {
      try {
        const data = await getArtisansByCategorie("Fabrication");

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
        setFilteredArtisans(normalizedData);

        // Extraire départements uniques
        const uniqueDepartements = [
          ...new Set(
            normalizedData
              .map((a) => a.departement)
              .filter(Boolean)
          ),
        ];

        setDepartements(uniqueDepartements);
      } catch (error) {
        console.error("Erreur chargement Fabrication :", error);
      } finally {
        setLoading(false);
      }
    }

    loadArtisans();
  }, []);

  /**
   * Filtrage des artisans
   */
  const handleSearch = () => {
    let results = [...artisans];

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

    // Réinitialisation des filtres
    setDepartement("Tous");
    setVille("");
  };

  if (loading) {
    return (
      <p className="text-center py-5" aria-live="polite">
        Chargement des artisans...
      </p>
    );
  }

  return (
    <main className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="Fil d’Ariane">
        <p className="small text-muted">
          <NavLink
                to="/"
                className="nav-link"
                             >
                Accueil
              </NavLink> / <strong>Fabrication</strong>
        </p>
      </nav>

      <h1 className="fw-bold mb-4">
        Trouver un artisan de la fabrication
      </h1>

      <div className="row">
        {/* FILTRES */}
        <aside className="col-md-3 mb-4">
          <form
            className="border rounded p-3 bg-light"
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
          >
            <h2 className="h6 fw-bold mb-3">Filtrer les résultats</h2>

            {/* Département */}
            <div className="mb-3">
              <label htmlFor="departement" className="form-label small">
                Département
              </label>
              <select
                id="departement"
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
              <label htmlFor="ville" className="form-label small">
                Ville
              </label>
              <input
                id="ville"
                type="text"
                className="form-control form-control-sm"
                placeholder="Ex : Lyon"
                value={ville}
                onChange={(e) => setVille(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-sm w-100">
              Rechercher
            </button>
          </form>
        </aside>

        {/* LISTE DES ARTISANS */}
        <section className="col-md-9">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
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
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
