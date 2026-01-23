import { Link } from "react-router-dom";

/**
 * Carte artisan affichée dans les listes
 * @param {string|number} id - Identifiant de l’artisan
 * @param {string} title - Nom de l’artisan
 * @param {string} job - Spécialité
 * @param {string} city - Ville
 * @param {string} department - Département
 * @param {string} category - Catégorie
 * @param {string} image - URL de l’image
 * @param {number} note - Note sur 5
 */

export default function ArtisanCard({
  id,
  title,
  job,
  city,
  department,
  image,
  note,
}) {
  const safeNote = Number.isFinite(note) ? note : 0;

  const fullStars = Math.round(safeNote);
  const emptyStars = Math.max(0, 5 - fullStars);

  // ✅ Ville + code département
  const location =
    city && department?.code
      ? `${city} (${department.code})`
      : city || "Ville inconnue";

  return (
    <div className="col-12 col-md-6 col-lg-4">
      <article className="card h-100 shadow-sm">
        <img
          src={image || "/images/placeholder.jpg"}
          className="card-img-top"
          alt={title ? `Photo de ${title}` : "Photo artisan indisponible"}
          loading="lazy"
          style={{ height: "220px", objectFit: "cover" }}
        />

        <div className="card-body d-flex flex-column">
          <h3 className="h5 fw-bold text-blue">
            {title || "Nom indisponible"}
          </h3>

          <p className="mb-1" aria-label={`Note ${safeNote} sur 5`}>
            <span className="text-warning">{"★".repeat(fullStars)}</span>
            <span className="text-muted">{"★".repeat(emptyStars)}</span>
            <span className="ms-2">({safeNote.toFixed(1)})</span>
          </p>

          <p className="mb-1 text-blue">
            {job || "Spécialité indisponible"}
          </p>

          <hr />

          <p className="text-light-blue mb-3">
            {location}
          </p>

          {id && (
            <Link
              to={`/artisan/${id}`}
              className="btn btn-blue btn-sm mt-auto"
            >
              Voir le profil
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}
