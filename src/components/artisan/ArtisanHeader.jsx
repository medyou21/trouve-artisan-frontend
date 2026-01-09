export default function ArtisanHeader() {
  return (
    <div className="card shadow-sm mb-4">
      <div className="row g-0 align-items-center">
        <div className="col-md-4">
          <img
            src="/images/artisan1.jpg"
            className="img-fluid rounded-start"
            alt="Artisan"
          />
        </div>

        <div className="col-md-8">
          <div className="card-body">
            <h1 className="fw-bold text-blue">
              Atelier Bois & Tradition
            </h1>

            <p className="text-warning mb-1">★★★★★</p>

            <p className="mb-1">
              <strong>Métier :</strong> Menuiserie artisanale
            </p>

            <p className="text-muted">
              📍 Lyon (69)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
