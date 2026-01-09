import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function NotFound() {
  return (
    <div className="container min-vh-100 d-flex align-items-center">
      <Helmet>
        <title>Page non trouvée – Artisanat Local</title>
        <meta
          name="description"
          content="La page demandée est introuvable. Retournez à l’accueil pour découvrir nos artisans locaux."
        />
      </Helmet>

      <div className="row w-100 align-items-center">
        {/* IMAGE */}
        <div className="col-12 col-md-6 text-center mb-4 mb-md-0">
          <img
            src="/images/404.png"
            alt="Page non trouvée"
            className="img-fluid notfound-img"
          />
        </div>

        {/* TEXTE */}
        <div className="col-12 col-md-6 text-center text-md-start">
          <h1 className="fw-bold display-5 mb-3">Oups !</h1>
          <h2 className="fw-semibold mb-3">Page non trouvée</h2>

          <p className="text-muted mb-4">
            La page que vous avez demandée n’existe pas ou a été déplacée.
            <br className="d-none d-md-block" />
            Revenez à l’accueil pour continuer votre recherche.
          </p>

          <Link to="/" className="btn btn-primary btn-lg">
            Retour à l’accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
