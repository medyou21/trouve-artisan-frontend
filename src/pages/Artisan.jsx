import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Artisan() {
  const { id } = useParams();

  // ✅ États du composant
  const [artisan, setArtisan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [contactMessage, setContactMessage] = useState("");

  // 🔹 Fetch artisan depuis le backend
  useEffect(() => {
    async function fetchArtisan() {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        if (!API_URL) throw new Error("VITE_API_URL non défini");

        const res = await fetch(`${API_URL}/api/artisans/${id}`);
        if (!res.ok) throw new Error(`Artisan non trouvé (HTTP ${res.status})`);

        const data = await res.json();
        setArtisan(data);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchArtisan();
  }, [id]);

  // 🔹 Affichage des étoiles pour la note
  const renderStars = (note) => {
    const rounded = Math.round(note);
    return (
      <>
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < rounded ? "text-warning" : "text-muted"}>
            ★
          </span>
        ))}
        <span className="ms-2 small text-muted">{note}/5</span>
      </>
    );
  };

  // 🔹 Gestion de l'envoi du formulaire de contact
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!artisan) return;

    const API_URL = import.meta.env.VITE_API_URL;
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      setSending(true);
      setContactMessage("");
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Erreur serveur (${res.status})`);

      const data = await res.json();
      setContactMessage(data.message || "Message envoyé avec succès !");
      e.target.reset();
    } catch (err) {
      console.error(err);
      setContactMessage("Erreur lors de l'envoi du message");
    } finally {
      setSending(false);
    }
  };

  // 🔹 Gestion des états de chargement / erreur
  if (loading) return <p className="text-center py-5">Chargement...</p>;
  if (error) return <p className="text-center py-5 text-danger">{error}</p>;
  if (!artisan) return <p className="text-center py-5">Artisan non trouvé</p>;

  return (
    <div className="container py-5">
      {/* Carte artisan */}
      <div className="card shadow-sm mb-4">
        <div className="row g-0">
          <div className="col-md-4">
            <img
              src={artisan.image || "/images/default-artisan.png"}
              alt={artisan.nom}
              className="img-fluid rounded-start object-fit-cover"
              style={{ width: "100%", height: "300px", objectFit: "cover" }}
            />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h2 className="fw-bold text-blue">{artisan.nom}</h2>
              <div className="mb-2">{renderStars(artisan.note)}</div>

              <p>
                <strong>Spécialité :</strong> {artisan.specialite || "Indisponible"}{" "}
                {artisan.categorie && `(${artisan.categorie})`}
              </p>

              <p>
                <strong>Localisation :</strong> {artisan.ville || "Indisponible"}
                {artisan.departement && ` (${artisan.departement})`}
              </p>

              <p>
                <strong>Site web :</strong>{" "}
                {artisan.site_web ? (
                  <a href={artisan.site_web} target="_blank" rel="noopener noreferrer">
                    {artisan.site_web}
                  </a>
                ) : (
                  "Indisponible"
                )}
              </p>

              <p>
                <strong>Email :</strong> {artisan.email || "Indisponible"}
              </p>

              <p>
                <strong>À propos :</strong> {artisan.a_propos || "Indisponible"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire de contact */}
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Contacter l’artisan</h5>
          {artisan.email ? (
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nom</label>
                  <input type="text" name="nom" className="form-control" required />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" className="form-control" required />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Objet</label>
                <input type="text" name="objet" className="form-control" required />
              </div>

              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea
                  name="message"
                  className="form-control"
                  rows="4"
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" disabled={sending}>
                {sending ? "Envoi..." : "Envoyer le message"}
              </button>

              {contactMessage && (
                <p className={`mt-2 ${sending ? "text-muted" : "text-success"}`}>
                  {contactMessage}
                </p>
              )}
            </form>
          ) : (
            <p className="small text-muted">
              Aucun email disponible pour ce prestataire.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
