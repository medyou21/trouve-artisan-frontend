import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";

const API_URL = import.meta.env.VITE_API_URL;

export default function Header() {
  const navbarRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const closeMenu = () => {
    if (navbarRef.current?.classList.contains("show")) {
      navbarRef.current.classList.remove("show");
    }
  };

  // 🔹 Chargement catégories depuis MariaDB
  useEffect(() => {
    async function loadCategories() {
      try {
        console.log("API_URL =", API_URL); // 🔹 pour debug
        if (!API_URL) throw new Error("VITE_API_URL non défini");

        const res = await fetch(`${API_URL}/api/categories`);
        if (!res.ok) throw new Error(`Erreur API catégories : ${res.status}`);

        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Erreur chargement catégories", err);
      }
    }
    loadCategories();
  }, []);

  // 🔍 Recherche globale
  const handleSearch = (query) => {
    if (!query.trim()) return;
    navigate(`/recherche?query=${encodeURIComponent(query)}`);
    closeMenu();
  };

  return (
    <header className="border-bottom bg-white sticky-top">
      <nav className="navbar navbar-expand-lg container py-3">
        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <img src="/images/Logo.png" alt="Logo" height="70" />
        </Link>

        {/* Burger mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-label="Menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu */}
        <div ref={navbarRef} className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav mx-auto text-center">
            <li className="nav-item">
              <NavLink to="/" className="nav-link" onClick={closeMenu}>
                Accueil
              </NavLink>
            </li>

            {categories.map((cat) => (
              <li className="nav-item" key={cat.id}>
                <NavLink to={`/${cat.slug}`} className="nav-link" onClick={closeMenu}>
                  {cat.nom}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Recherche */}
          <div className="mt-3 mt-lg-0">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </nav>
    </header>
  );
}
