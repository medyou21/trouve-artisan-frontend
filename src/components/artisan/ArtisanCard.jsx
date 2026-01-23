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
  const emptyStars = 5 - fullStars;

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

          <p className="mb-1">
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

          <Link
            to={`/artisan/${id}`}
            className="btn btn-blue btn-sm mt-auto"
          >
            Voir le profil
          </Link>
        </div>
      </article>
    </div>
  );
}
