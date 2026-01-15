import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ArtisanCard from "../components/artisan/ArtisanCard";
import { Helmet } from "react-helmet";

const API_URL = import.meta.env.VITE_API_URL;

export default function Recherche() {
  const [params] = useSearchParams();
  const query = params.get("query") || "";

  // ✅ États
  const [artisans, setArtisans] = useState([]);
  const [filteredArtisans, setFilteredArtisans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [selectedDepartement, setSelectedDepartement] = useState("Tous");
  const [loading, setLoading] = useState(true);

  // 🔹 Récupération des artisans
  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        let url = `${API_URL}/api/artisans`;
        if (query) {
          url = `${API_URL}/api/artisans/search?query=${encodeURIComponent(
            query
          )}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Erreur API recherche");

        const data = await res.json();

        // Normalisation
        const normalizedData = data.map((a) => ({
          id: a.id,
          nom: a.nom,
          specialite: a.specialite,
          ville: a.ville || "Indisponible",
          departement: a.departement || "Indisponible",
          categorie: a.categorie || "Indisponible",
          note: Number(a.note) || 0,
          image: a.image || "/images/placeholder.jpg",
        }));

        setArtisans(normalizedData);
        setFilteredArtisans(normalizedData);

        // Extraire les catégories uniques
        const uniqueCategories = [
          ...new Set(normalizedData.map((a) => a.categorie).filter(Boolean)),
        ].sort();
        setCategories(uniqueCategories);

        // Extraire les départements uniques
        const uniqueDepartements = [
          ...new Set(normalizedData.map((a) => a.departement).filter(Boolean)),
        ].sort();
        setDepartements(uniqueDepartements);
      } catch (err) {
        console.error("Erreur recherche :", err);
        setArtisans([]);
        setFilteredArtisans([]);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [query]);

  // 🔹 Filtrage selon catégorie et département
  useEffect(() => {
    let results = [...artisans];

    if (selectedCategory !== "Tous") {
      results = results.filter((a) => a.categorie === selectedCategory);
    }

    if (selectedDepartement !== "Tous") {
      results = results.filter((a) => a.departement === selectedDepartement);
    }

    setFilteredArtisans(results);
  }, [selectedCategory, selectedDepartement, artisans]);

  return (
    <div className="container py-4">
      <Helmet>
        <title>Recherche{query ? ` : ${query}` : ""}</title>
        <meta
          name="description"
          content={
            query
              ? `Résultats de recherche pour ${query}`
              : "Tous les artisans disponibles"
          }
        />
      </Helmet>

      <h2 className="fw-bold mb-4">
        {query ? `Résultats pour « ${query} »` : "Tous les artisans"}
      </h2>

      {/* 🔹 Filtres */}
      <div className="row mb-4">
        <div className="col-md-3">
          {/* Filtre Catégorie */}
          <div className="mb-3">
            <label className="form-label small">Catégorie</label>
            <select
              className="form-select form-select-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="Tous">Tous</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Filtre Département */}
          <div className="mb-3">
            <label className="form-label small">Département</label>
            <select
              className="form-select form-select-sm"
              value={selectedDepartement}
              onChange={(e) => setSelectedDepartement(e.target.value)}
            >
              <option value="Tous">Tous</option>
              {departements.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 🔹 Liste des artisans */}
      {loading && <p className="text-center">Chargement...</p>}
      {!loading && filteredArtisans.length === 0 && (
        <p className="text-center">Aucun artisan trouvé.</p>
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
  );
}
