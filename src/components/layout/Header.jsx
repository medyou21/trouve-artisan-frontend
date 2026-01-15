import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Composant Header
 * Contient la navigation principale, les catégories dynamiques et la recherche
 */
export default function Header() {
  const navbarRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  /**
   * Ferme le menu mobile après navigation
   */
  const closeMenu = () => {
    if (navbarRef.current?.classList.contains("show")) {
      navbarRef.current.classList.remove("show");
    }
  };

  /**
   * Chargement des catégories depuis l'API
   */
  useEffect(() => {
    async function loadCategories() {
      if (!API_URL) {
        console.error("VITE_API_URL non défini");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/categories`);
        if (!response.ok) {
          throw new Error(`Erreur API catégories (${response.status})`);
        }

        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur chargement catégories :", error.message);
        setCategories([]);
      }
    }

    loadCategories();
  }, []);

  /**
   * Recherche globale
   */
  const handleSearch = (query) => {
    if (!query.trim()) return;
    navigate(`/recherche?query=${encodeURIComponent(query)}`);
    closeMenu();
  };

  return (
    <header className="border-bottom bg-white sticky-top">
      <nav
        className="navbar navbar-expand-lg container py-3"
        aria-label="Navigation principale"
      >
        {/* Logo */}
        <Link
          to="/"
          className="navbar-brand d-flex align-items-center"
          onClick={closeMenu}
        >
          <img
            src="/images/Logo.png"
            alt="Trouve ton artisan – Région Auvergne-Rhône-Alpes"
            height="70"
          />
        </Link>

        {/* Bouton menu mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Ouvrir le menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu principal */}
        <div
          ref={navbarRef}
          className="collapse navbar-collapse"
          id="mainNavbar"
        >
          <ul className="navbar-nav mx-auto text-center">
            <li className="nav-item">
              <NavLink
                to="/"
                className="nav-link"
                onClick={closeMenu}
              >
                Accueil
              </NavLink>
            </li>

            {categories.map((cat) => (
              <li className="nav-item" key={cat.id}>
                <NavLink
                  to={`/${cat.slug}`}
                  className="nav-link"
                  onClick={closeMenu}
                >
                  {cat.nom}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Barre de recherche */}
          <div className="mt-3 mt-lg-0">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </nav>
    </header>
  );
}
