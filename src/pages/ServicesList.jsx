import { useEffect, useState } from "react";
import ArtisanCard from "../components/artisan/ArtisanCard";
import { getArtisansByCategorie } from "../services/artisan.service";

export default function Services() {
  // ✅ États pour gérer les données et filtres
  const [artisans, setArtisans] = useState([]);
  const [filteredArtisans, setFilteredArtisans] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departement, setDepartement] = useState("Tous");
  const [ville, setVille] = useState("");

  // 🔹 Chargement des artisans au montage du composant
  useEffect(() => {
    async function loadArtisans() {
      try {
        const data = await getArtisansByCategorie("Services");

        // ✅ Normalisation des données
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

        // 🔹 Extraire les départements uniques pour le filtre
        const uniqueDepartements = [
          ...new Set(normalizedData.map((a) => a.departement).filter(Boolean)),
        ].sort();

        setDepartements(uniqueDepartements);
      } catch (error) {
        console.error("Erreur chargement services :", error);
      } finally {
        setLoading(false);
      }
    }

    loadArtisans();
  }, []);

  // 🔹 Fonction utilitaire pour normaliser texte (accent, majuscule)
  const normalize = (str = "") =>
    str
      .normalize("NFD") // sépare lettres et accents
      .replace(/[\u0300-\u036f]/g, "") // supprime les accents
      .toLowerCase();

  // 🔹 Filtrage des artisans selon département et ville
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

    // 🔹 Réinitialisation des filtres après recherche
    setDepartement("Tous");
    setVille("");
  };

  // 🔹 Affichage pendant le chargement
  if (loading) {
    return <p className="text-center py-5">Chargement...</p>;
  }

  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <p className="small text-muted">
        Accueil / <strong>Services</strong>
      </p>

      <h2 className="fw-bold mb-4">Trouver un prestataire de services</h2>

      <div className="row">
        {/* FILTRES */}
        <aside className="col-md-3 mb-4">
          <div className="border rounded p-3 bg-light">
            <h6 className="fw-bold mb-3">Filtrer les résultats</h6>

            {/* Filtre Département */}
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

            {/* Filtre Ville */}
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
          <div className="card shadow-sm mb-4">
            <div className="card-body">
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
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
