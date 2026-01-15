import { Link } from "react-router-dom";
import heroImage from "/images/hero1.jpg";

/**
 * Composant Hero
 * Section principale d’accueil avec image de fond et appel à l’action
 */
export default function Hero() {
  return (
    <section
      className="hero-section text-white position-relative"
      style={{ backgroundImage: `url(${heroImage})` }}
      aria-labelledby="hero-title"
    >
      {/* Overlay sombre pour améliorer la lisibilité du texte */}
      <div className="hero-overlay" aria-hidden="true"></div>

      <div className="container position-relative py-5">
        <div className="row align-items-center min-vh-50">
          <div className="col-12 col-md-8 col-lg-6">
            <h1
              id="hero-title"
              className="fw-bold display-6 display-md-5"
            >
              Trouvez facilement un artisan près de chez vous
            </h1>

            <p className="mt-3 fs-6 fs-md-5">
              Une plateforme officielle pour découvrir, choisir et contacter
              les artisans d’Auvergne-Rhône-Alpes.
            </p>

            <Link
              to="/recherche"
              className="btn btn-blue btn-lg mt-3"
              aria-label="Accéder à la recherche d’artisans"
            >
              Trouver un artisan
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
