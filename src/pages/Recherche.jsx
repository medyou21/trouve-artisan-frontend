import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ArtisanCard from "../components/artisan/ArtisanCard";
import { Helmet } from "react-helmet";

const API_URL = import.meta.env.VITE_API_URL;

export default function Recherche() {
  const [params] = useSearchParams();
  const query = params.get("query") || "";
  const categoryParam = params.get("category") || "";

  const [artisans, setArtisans] = useState([]);
  const [filteredArtisans, setFilteredArtisans] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "Tous");
  const [selectedDepartement, setSelectedDepartement] = useState("Tous");

  // 🔹 Récupération des artisans
  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        let url = `${API_URL}/api/artisans`;

        if (categoryParam) {
          url = `${API_URL}/api/artisans/categorie/${encodeURIComponent(categoryParam)}`;
        } else if (query) {
          url = `${API_URL}/api/artisans/search?query=${encodeURIComponent(query)}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Erreur API recherche");

        const data = await res.json();

        const normalizedData = data.map((a) => ({
          id: a.id,
          nom: a.nom,
          specialite: a.specialite || "Indisponible",
          ville: a.ville || "Indisponible",
          departement: a.departement || "Indisponible",
          note: Number(a.note) || 0,
          image: a.image || "/images/placeholder.jpg",
          categorie: a.categorie || "Indisponible",
        }));

        setArtisans(normalizedData);
        setFilteredArtisans(normalizedData);

        // Liste unique des départements pour le filtre
        const uniqueDeps = [
          ...new Set(normalizedData.map((a) => a.departement).filter(Boolean)),
        ].sort();
        setDepartements(uniqueDeps);

      } catch (err) {
        console.error("Erreur recherche :", err);
        setArtisans([]);
        setFilteredArtisans([]);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [query, categoryParam]);

  // 🔹 Filtrage par catégorie et département
  useEffect(() => {
    let results = [...artisans];

    if (selectedCategory !== "Tous") {
      results = results.filter(a => a.categorie === selectedCategory);
    }

    if (selectedDepartement !== "Tous") {
      results = results.filter(a => a.departement === selectedDepartement);
    }

    setFilteredArtisans(results);
  }, [selectedCategory, selectedDepartement, artisans]);

  return (
    <div className="container py-4">
      <Helmet>
        <title>
          {selectedCategory !== "Tous"
            ? `Artisans ${selectedCategory}`
            : query
            ? `Résultats : ${query}`
            : "Tous les artisans"}
        </title>
        <meta
          name="description"
          content={
            selectedCategory !== "Tous"
              ? `Liste des artisans pour la catégorie ${selectedCategory}`
              : query
              ? `Résultats de recherche pour ${query}`
              : "Tous les artisans disponibles"
          }
        />
      </Helmet>

      <h2 className="fw-bold mb-4">
        {selectedCategory !== "Tous"
          ? `Artisans : ${selectedCategory}`
          : query
          ? `Résultats pour « ${query} »`
          : "Tous les artisans"}
      </h2>

      {/* 🔹 Filtres */}
      <div className="row mb-4 g-3">
        <div className="col-md-6">
          <label className="form-label small">Catégorie</label>
          <select
            className="form-select"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="Tous">Tous</option>
            {[...new Set(artisans.map(a => a.categorie).filter(Boolean))].sort().map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label small">Département</label>
          <select
            className="form-select"
            value={selectedDepartement}
            onChange={e => setSelectedDepartement(e.target.value)}
          >
            <option value="Tous">Tous</option>
            {departements.map(dep => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="text-center py-5">Chargement...</p>}
      {!loading && filteredArtisans.length === 0 && (
        <p className="text-center py-5">Aucun artisan trouvé.</p>
      )}

      {/* 🔹 Liste des artisans */}
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
