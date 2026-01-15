import { Link } from "react-router-dom";

/**
 * Composant Footer
 * Contient les informations institutionnelles, légales et de contact
 */
export default function Footer() {
  return (
    <footer
      className="bg-blue text-white pt-4 mt-5"
      role="contentinfo"
    >
      <div className="container">
        <div className="row">

          {/* Présentation institutionnelle */}
          <div className="col-12 col-md-4 mb-3">
            <p className="fw-bold mb-2">
              La Région Auvergne-Rhône-Alpes
            </p>
            <p className="mb-0">
              Trouvez votre artisan<br />
              en Auvergne-Rhône-Alpes
            </p>
          </div>

          {/* Menu légal */}
          <nav
            className="col-12 col-md-4 mb-3"
            aria-labelledby="footer-legal-title"
          >
            <h6
              id="footer-legal-title"
              className="fw-bold"
            >
              Pages légales
            </h6>
            <ul className="list-unstyled mb-0">
              <li>
                <Link
                  to="/mentions-legales"
                  className="text-white text-decoration-none"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  to="/donnees-personnelles"
                  className="text-white text-decoration-none"
                >
                  Données personnelles
                </Link>
              </li>
              <li>
                <Link
                  to="/accessibilite"
                  className="text-white text-decoration-none"
                >
                  Accessibilité
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="text-white text-decoration-none"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </nav>

          {/* Coordonnées de contact */}
          <div className="col-12 col-md-4 mb-3">
            <h6 className="fw-bold">Contact</h6>
            <address className="mb-0 not-italic">
              101 cours Charlemagne<br />
              CS 20033<br />
              69269 Lyon Cedex 02<br />
              France<br />
              <a
                href="tel:+33426734000"
                className="text-white text-decoration-none"
                aria-label="Téléphone Région Auvergne-Rhône-Alpes"
              >
                +33 (0)4 26 73 40 00
              </a>
            </address>
          </div>

        </div>

        <hr className="border-light" />

        <p className="text-center small mb-0">
          © {new Date().getFullYear()} Région Auvergne-Rhône-Alpes – Tous droits réservés
        </p>
      </div>
    </footer>
  );
}
