import { Link } from "react-router-dom";
import heroImage from "/images/hero1.jpg";

export default function Hero() {
  return (
    <section
      className="hero-section text-white position-relative"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="hero-overlay"></div>

      <div className="container position-relative py-5 py-md-6">
        <div className="row align-items-center min-vh-50">
          <div className="col-12 col-md-8 col-lg-6">
            <br /><br />
            <h1 className="fw-bold display-6 display-md-5">
              Trouvez facilement un artisan près de chez vous
            </h1>

            <p className="mt-3 fs-6 fs-md-5">
              Une plateforme officielle pour découvrir, choisir et contacter
              les artisans d’Auvergne-Rhône-Alpes.
            </p>

            <Link to="/recherche" className="btn btn-blue btn-lg mt-3">
              Trouver un artisan
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
