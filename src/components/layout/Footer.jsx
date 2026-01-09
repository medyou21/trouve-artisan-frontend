import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-blue text-white pt-4 mt-5">
      <div className="container">
        <div className="row">

          {/* Présentation */}
          <div className="col-md-4 mb-3">
            <strong>La Région Auvergne-Rhône-Alpes</strong>
            <p className="mt-2">
              Trouve ton artisan<br />
              en Auvergne-Rhône-Alpes
            </p>
          </div>

          {/* Menu légal */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold">Pages légales</h6>
            <ul className="list-unstyled">
              <li>
                <Link to="/mentions-legales" className="text-white text-decoration-none">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/donnees-personnelles" className="text-white text-decoration-none">
                  Données personnelles
                </Link>
              </li>
              <li>
                <Link to="/accessibilite" className="text-white text-decoration-none">
                  Accessibilité
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-white text-decoration-none">
                  Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Coordonnées */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold">Contact</h6>
            <address className="mb-0">
              101 cours Charlemagne<br />
              CS 20033<br />
              69269 LYON CEDEX 02<br />
              France<br />
              <a href="tel:+33426734000" className="text-white text-decoration-none">
                +33 (0)4 26 73 40 00
              </a>
            </address>
          </div>

        </div>

        <hr className="border-light" />

        <p className="text-center small mb-0">
          Région Auvergne-Rhône-Alpes – Tous droits réservés
        </p>
      </div>
    </footer>
  );
}
