import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Envoyer la recherche au parent
    onSearch(query);

    // Vider le champ après l'envoi
    setQuery("");
  };

  return (
    <form className="d-flex" onSubmit={handleSubmit}>
      <input
        type="search"
        className="form-control form-control-sm me-2"
        placeholder="Rechercher un artisan..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="btn btn-primary btn-sm" type="submit">
        🔍
      </button>
    </form>
  );
}
