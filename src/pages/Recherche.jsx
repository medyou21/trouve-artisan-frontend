import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ArtisanCard from "../components/artisan/ArtisanCard";

const API_URL = import.meta.env.VITE_API_URL;

// 🔹 Normalisation d’un artisan (évite undefined / null)
const normalizeArtisan = (a) => ({
  id: a.id,
  nom: a.nom || "Indisponible",
  specialite: a.specialite_obj?.nom || "Non précisée",
  ville: a.ville_obj?.nom || "Indisponible",
  departement: a.ville_obj?.departement
    ? `${a.ville_obj.departement.code} - ${a.ville_obj.departement.nom}`
    : "",
  categorie: a.categorie?.nom || "",
  note: Number(a.note) || 0,
  image: a.image || "/images/placeholder.jpg",
});

// 🔹 Vérifie API
const checkApiUrl = () => {
  if (!API_URL) console.error("❌ VITE_API_URL non défini !");
  return !!API_URL;
};

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

  // 🔹 Normalisation texte
  const normalize = (str = "") =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // 🔹 Chargement initial des artisans
  useEffect(() => {
    const loadArtisans = async () => {
      if (!checkApiUrl()) return;

      try {
        const res = await fetch(`${API_URL}/api/artisans`);
        if (!res.ok) throw new Error(await res.text());

        const data = await res.json();
        const normalized = data.map(normalizeArtisan);

        setArtisans(normalized);
        setFilteredArtisans(normalized);

        // 🔹 Catégories uniques
        setCategories([...new Set(normalized.map(a => a.categorie).filter(Boolean))].sort());

        // 🔹 Départements uniques (id + code + nom)
        const uniqueDeps = [
          ...new Map(
            normalized
              .map(a => a.ville_obj?.departement)
              .filter(Boolean)
              .map(d => [d.id, d])
          ).values(),
        ];
        setDepartements(uniqueDeps);

      } catch (err) {
        console.error("Erreur chargement artisans :", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadArtisans();
  }, []);

  // 🔹 Synchronisation avec recherche header
  useEffect(() => {
    if (!query.trim()) return setFilteredArtisans(artisans);

    const results = artisans.filter(a => normalize(a.nom).includes(normalize(query)));
    setFilteredArtisans(results);
  }, [query, artisans]);

  // 🔹 Application des filtres combinés
  const handleSearch = async () => {
    if (!checkApiUrl()) return;

    try {
      const queryParams = [];
      if (categorie !== "Tous") queryParams.push(`categorie_id=${categorie}`);
      if (departement !== "Tous") queryParams.push(`departement_id=${departement}`);
      if (ville.trim()) queryParams.push(`ville_id=${ville}`);

      const queryString = queryParams.length ? `?${queryParams.join("&")}` : "";
      const res = await fetch(`${API_URL}/api/artisans/filter${queryString}`);
      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setFilteredArtisans(data.map(normalizeArtisan));
    } catch (err) {
      console.error("Erreur handleSearch :", err.message);
    }
  };

  if (loading) return <p className="text-center py-5">Chargement...</p>;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">
        {query ? `Résultats pour « ${query} »` : "Tous les artisans"}
      </h2>

      <div className="row">
        {/* 🔹 FILTRES */}
        <aside className="col-md-3 mb-4">
          <div className="border rounded p-3 bg-light">
            <h6 className="fw-bold mb-3">Filtres</h6>

            {/* Catégorie */}
            <div className="mb-3">
              <label className="form-label small">Catégorie</label>
              <select
                className="form-select form-select-sm"
                value={categorie}
                onChange={e => setCategorie(e.target.value)}
              >
                <option value="Tous">Toutes</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Département */}
            <div className="mb-3">
              <label className="form-label small">Département</label>
              <select
                className="form-select form-select-sm"
                value={departement}
                onChange={e => setDepartement(e.target.value)}
              >
                <option value="Tous">Tous</option>
                {departements.map(dep => (
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
                onChange={e => setVille(e.target.value)}
              />
            </div>

            <button className="btn btn-primary btn-sm w-100" onClick={handleSearch}>
              Rechercher
            </button>
          </div>
        </aside>

        {/* 🔹 LISTE ARTISANS */}
        <section className="col-md-9">
          <p className="small text-muted mb-3">
            {filteredArtisans.length} artisan{filteredArtisans.length > 1 ? "s" : ""}
          </p>

          <div className="row g-4">
            {filteredArtisans.map(a => (
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
    </div>
  );
}
