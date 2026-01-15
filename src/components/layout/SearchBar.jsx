import { useState } from "react";

/**
 * Composant SearchBar
 * Permet la recherche globale d'artisans
 *
 * @param {Function} onSearch - Fonction appelée lors de la soumission
 */
export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  /**
   * Soumission du formulaire de recherche
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    // Envoi de la recherche au composant parent
    onSearch(query.trim());

    // Réinitialisation du champ
    setQuery("");
  };

  return (
    <form
      className="d-flex"
      role="search"
      aria-label="Recherche d'artisans"
      onSubmit={handleSubmit}
    >
      {/* Champ de recherche */}
      <label htmlFor="search-input" className="visually-hidden">
        Rechercher un artisan
      </label>

      <input
        id="search-input"
        type="search"
        className="form-control form-control-sm me-2"
        placeholder="Rechercher un artisan..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-required="true"
      />

      {/* Bouton de validation */}
      <button
        className="btn btn-primary btn-sm"
        type="submit"
        aria-label="Lancer la recherche"
      >
        🔍
      </button>
    </form>
  );
}
