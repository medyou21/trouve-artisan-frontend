import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ArtisanCard from "../components/artisan/ArtisanCard";

export default function Artisan() {
  const { id } = useParams();

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

  if (loading) return <p className="text-center py-5">Chargement...</p>;
  if (error) return <p className="text-center py-5 text-danger">{error}</p>;
  if (!artisan) return <p className="text-center py-5">Artisan non trouvé</p>;

  return (
    <div className="container py-5">
      {/* Carte artisan avec ArtisanCard */}
      <div className="mb-4">
        <ArtisanCard
          id={artisan.id}
          title={artisan.nom}
          job={artisan.specialite}
          city={artisan.ville?.nom}
          image={artisan.image}
          note={artisan.note}
        />
      </div>

      {/* Informations complémentaires */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <p><strong>Catégorie :</strong> {artisan.categorie?.nom || "Indisponible"}</p>
          <p><strong>Département :</strong> {artisan.departement?.nom || "Indisponible"}</p>
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
          <p><strong>Email :</strong> {artisan.email || "Indisponible"}</p>
          <p><strong>À propos :</strong> {artisan.a_propos || "Indisponible"}</p>
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
