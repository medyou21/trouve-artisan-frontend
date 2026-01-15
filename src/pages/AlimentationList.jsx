import { useEffect, useState } from "react";
import ArtisanCard from "../components/artisan/ArtisanCard";
import { getArtisansByCategorie } from "../services/artisan.service";

/**
 * Page Services
 * Affiche la liste des artisans de la catégorie "Alimentation"
 * avec filtres par département et ville.
 */
export default function Services() {
  const [artisans, setArtisans] = useState([]);
  const [filteredArtisans, setFilteredArtisans] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [departement, setDepartement] = useState("Tous");
  const [ville, setVille] = useState("");

  /**
   * Normalisation des chaînes
   * → suppression des accents
   * → comparaison insensible à la casse
   */
  const normalize = (str = "") =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  /**
   * Chargement des artisans depuis l'API
   */
  useEffect(() => {
    async function loadArtisans() {
      try {
        const data = await getArtisansByCategorie("Alimentation");

        // Normalisation des données (MariaDB → Frontend)
        const normalizedData = data.map((artisan) => ({
          id: artisan.id,
          nom: artisan.nom,
          specialite: artisan.specialite,
          ville: artisan.ville || "",
          departement: artisan.departement || "",
          note: Number(artisan.note) || 0,
          image: artisan.image || "/images/placeholder.jpg",
        }));

        setArtisans(normalizedData);
        setFilteredArtisans(normalizedData);

        // Départements uniques
        const uniqueDepartements = [
          ...new Set(
            normalizedData
              .map((a) => a.departement)
              .filter(Boolean)
          ),
        ];

        setDepartements(uniqueDepartements);
      } catch (error) {
        console.error("Erreur chargement artisans :", error);
      } finally {
        setLoading(false);
      }
    }

    loadArtisans();
  }, []);

  /**
   * Application des filtres
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
  };

  /**
   * État de chargement
   */
  if (loading) {
    return (
      <p className="text-center py-5" aria-live="polite">
        Chargement des artisans...
      </p>
    );
  }

  return (
    <main className="container py-4">
      {/* Fil d'Ariane */}
      <nav aria-label="Fil d’Ariane">
        <p className="small text-muted">
          Accueil / <strong>Alimentation</strong>
        </p>
      </nav>

      <h1 className="fw-bold mb-4">
        Trouver un artisan de l’alimentation
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
            <h2 className="h6 fw-bold mb-3">
              Filtrer les résultats
            </h2>

            {/* Département */}
            <div className="mb-3">
              <label
                htmlFor="departement"
                className="form-label small"
              >
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
              <label
                htmlFor="ville"
                className="form-label small"
              >
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

            <button
              type="submit"
              className="btn btn-primary btn-sm w-100"
            >
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
