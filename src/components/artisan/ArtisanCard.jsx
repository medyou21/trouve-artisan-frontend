import { Link } from "react-router-dom";

export default function ArtisanCard({ id, title, job, city, image, note }) {
  const safeNote = note ?? 0; // valeur par défaut si undefined
  const fullStars = Math.round(safeNote);
  const emptyStars = 5 - fullStars;

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card h-100 shadow-sm">
        <img src={image || "/images/placeholder.jpg"} className="card-img-top" alt={title} />

        <div className="card-body d-flex flex-column">
          <h5 className="fw-bold text-blue">{title || "Nom indisponible"}</h5>

          <p className="text-warning mb-1">
            {"★".repeat(fullStars)}
            <span className="text-muted">{"★".repeat(emptyStars)}</span>
            <span className="ms-2 text-dark">({safeNote.toFixed(1)})</span>
          </p>

          <p className="mb-1 text-blue">{job || "Spécialité indisponible"}</p>
          <hr/>
          <p className="text-light-blue">{city || "Ville inconnue"}</p>

          <Link to={`/artisan/${id}`} className="btn btn-blue btn-sm mt-auto">
            Voir le profil
          </Link>
        </div>
      </div>
    </div>
  );
}
