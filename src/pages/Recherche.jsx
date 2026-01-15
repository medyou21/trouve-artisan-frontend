import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ArtisanCard from "../components/artisan/ArtisanCard";
import { getArtisansByCategorie } from "../services/artisan.service";

export default function Recherche() {
  const [params] = useSearchParams();
  const query = params.get("query") || "";

  // ✅ États pour données et filtres
  const [artisans, setArtisans] = useState([]);
  const [filteredArtisans, setFilteredArtisans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [categorie, setCategorie] = useState("Tous");
  const [departement, setDepartement] = useState("Tous");
  const [ville, setVille] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Chargement des artisans depuis le backend
  useEffect(() => {
    async function loadArtisans() {
      try {
        // Si une recherche spécifique par mot clé
        let data;
        if (query) {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/artisans/search?query=${encodeURIComponent(query)}`);
          data = await res.json();
        } else {
          // Sinon récupérer tous les artisans
          data = await getArtisansByCategorie("Tous");
        }

        // Normalisation
        const normalizedData = data.map((a) => ({
          id: a.id,
          nom: a.nom,
          specialite: a.specialite,
          ville: a.ville || "",
          departement: a.departement || "",
          categorie: a.categorie || "",
          note: Number(a.note) || 0,
          image: a.image || "/images/placeholder.jpg",
        }));

        setArtisans(normalizedData);
        setFilteredArtisans(normalizedData);

        // Extraire catégories uniques
        const uniqueCategories = [
          ...new Set(normalizedData.map((a) => a.categorie).filter(Boolean))
        ].sort();
        setCategories(uniqueCategories);

        // Extraire départements uniques
        const uniqueDepartements = [
          ...new Set(normalizedData.map((a) => a.departement).filter(Boolean))
        ].sort();
        setDepartements(uniqueDepartements);

      } catch (error) {
        console.error("Erreur chargement artisans :", error);
      } finally {
        setLoading(false);
      }
    }

    loadArtisans();
  }, [query]);

  // 🔹 Normalisation texte pour filtre
  const normalize = (str = "") =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // 🔹 Appliquer filtres
  const handleSearch = () => {
    let results = artisans;

    if (categorie !== "Tous") {
      results = results.filter(a => normalize(a.categorie) === normalize(categorie));
    }

    if (departement !== "Tous") {
      results = results.filter(a => normalize(a.departement) === normalize(departement));
    }

    if (ville.trim() !== "") {
      results = results.filter(a => normalize(a.ville).includes(normalize(ville)));
    }

    setFilteredArtisans(results);

    // Optionnel : réinitialiser les filtres si tu veux
    // setCategorie("Tous");
    // setDepartement("Tous");
    // setVille("");
  };

  if (loading) return <p className="text-center py-5">Chargement...</p>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Rechercher un artisan</h2>

      <div className="row">
        {/* FILTRES */}
        <aside className="col-md-3 mb-4">
          <div className="border rounded p-3 bg-light">
            <h6 className="fw-bold mb-3">Filtrer les résultats</h6>

            {/* Filtre Catégorie */}
            <div className="mb-3">
              <label className="form-label small">Catégorie</label>
              <select className="form-select form-select-sm" value={categorie} onChange={e => setCategorie(e.target.value)}>
                <option value="Tous">Tous</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            {/* Filtre Département */}
            <div className="mb-3">
              <label className="form-label small">Département</label>
              <select className="form-select form-select-sm" value={departement} onChange={e => setDepartement(e.target.value)}>
                <option value="Tous">Tous</option>
                {departements.map(dep => <option key={dep} value={dep}>{dep}</option>)}
              </select>
            </div>

            {/* Filtre Ville */}
            <div className="mb-3">
              <label className="form-label small">Ville</label>
              <input type="text" className="form-control form-control-sm" placeholder="Ex : Lyon" value={ville} onChange={e => setVille(e.target.value)} />
            </div>

            <button className="btn btn-primary btn-sm w-100" onClick={handleSearch}>
              Rechercher
            </button>
          </div>
        </aside>

        {/* LISTE DES ARTISANS */}
        <section className="col-md-9">
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <p className="small text-muted mb-3">
                {filteredArtisans.length} artisan{filteredArtisans.length > 1 ? "s" : ""}
              </p>

              <div className="row g-4">
                {filteredArtisans.map(artisan => (
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
