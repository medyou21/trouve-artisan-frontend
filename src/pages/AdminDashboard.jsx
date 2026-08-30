import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllArtisans } from "../services/artisan.service";
import { createArtisan, deleteArtisan, getReferences, updateArtisan } from "../services/admin.service";

const emptyForm = {
  nom: "", note: 0, image: "", email: "", site_web: "", a_propos: "",
  top: false, categorie_id: "", specialite_id: "", ville_id: "",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [artisans, setArtisans] = useState([]);
  const [refs, setRefs] = useState({ categories: [], specialites: [], villes: [] });
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const reload = async () => setArtisans(await getAllArtisans());

  useEffect(() => {
    if (!sessionStorage.getItem("admin_token")) {
      navigate("/admin/connexion");
      return;
    }
    async function initialize() {
      try {
        const [loadedArtisans, loadedRefs] = await Promise.all([
          getAllArtisans(),
          getReferences(),
        ]);
        setArtisans(loadedArtisans);
        setRefs(loadedRefs);
      } catch (err) {
        setMessage(err.message);
      }
    }
    initialize();
  }, [navigate]);

  const change = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    const payload = {
      ...form,
      note: Number(form.note),
      categorie_id: Number(form.categorie_id),
      specialite_id: Number(form.specialite_id),
      ville_id: Number(form.ville_id),
    };
    delete payload.categorie_id;
    try {
      if (editingId) await updateArtisan(editingId, payload);
      else await createArtisan(payload);
      setMessage(editingId ? "Artisan modifié." : "Artisan créé.");
      setEditingId(null);
      setForm(emptyForm);
      await reload();
    } catch (err) {
      if (/authentification|jeton/i.test(err.message)) navigate("/admin/connexion");
      setMessage(err.message);
    }
  };

  const edit = (artisan) => {
    setEditingId(artisan.id);
    setForm({
      nom: artisan.nom, note: artisan.note, image: artisan.image, email: artisan.email,
      site_web: artisan.site_web, a_propos: artisan.a_propos, top: artisan.top,
      categorie_id: refs.categories.find((item) => item.nom === artisan.categorie)?.id || "",
      specialite_id: refs.specialites.find((item) => item.nom === artisan.specialite)?.id || "",
      ville_id: refs.villes.find((item) => item.nom === artisan.ville)?.id || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (artisan) => {
    if (!window.confirm(`Supprimer ${artisan.nom} ?`)) return;
    try {
      await deleteArtisan(artisan.id);
      setMessage("Artisan supprimé.");
      await reload();
    } catch (err) { setMessage(err.message); }
  };

  const logout = () => {
    sessionStorage.removeItem("admin_token");
    navigate("/admin/connexion");
  };

  return (
    <section className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 fw-bold mb-0">Gestion des artisans</h1>
        <button className="btn btn-outline-secondary" onClick={logout}>Déconnexion</button>
      </div>
      {message && <div className="alert alert-info" role="status">{message}</div>}
      <form className="card card-body shadow-sm mb-5" onSubmit={submit}>
        <h2 className="h5 mb-3">{editingId ? "Modifier l’artisan" : "Ajouter un artisan"}</h2>
        <div className="row g-3">
          <div className="col-md-6"><input aria-label="Nom" name="nom" value={form.nom} onChange={change} className="form-control" placeholder="Nom" required /></div>
          <div className="col-md-2"><input aria-label="Note" name="note" type="number" min="0" max="5" step="0.1" value={form.note} onChange={change} className="form-control" /></div>
          <div className="col-md-4"><input aria-label="Email" name="email" type="email" value={form.email} onChange={change} className="form-control" placeholder="Email" /></div>
          <div className="col-md-6"><input aria-label="Site web" name="site_web" type="url" value={form.site_web} onChange={change} className="form-control" placeholder="https://..." /></div>
          <div className="col-md-6"><input aria-label="Image" name="image" value={form.image} onChange={change} className="form-control" placeholder="/images/..." /></div>
          <div className="col-md-4"><select aria-label="Catégorie" name="categorie_id" value={form.categorie_id} onChange={change} className="form-select" required><option value="">Catégorie</option>{refs.categories.map((x) => <option key={x.id} value={x.id}>{x.nom}</option>)}</select></div>
          <div className="col-md-4"><select aria-label="Spécialité" name="specialite_id" value={form.specialite_id} onChange={change} className="form-select" required><option value="">Spécialité</option>{refs.specialites.filter((x) => !form.categorie_id || String(x.categorie_id) === String(form.categorie_id)).map((x) => <option key={x.id} value={x.id}>{x.nom}</option>)}</select></div>
          <div className="col-md-4"><select aria-label="Ville" name="ville_id" value={form.ville_id} onChange={change} className="form-select" required><option value="">Ville</option>{refs.villes.map((x) => <option key={x.id} value={x.id}>{x.nom}</option>)}</select></div>
          <div className="col-12"><textarea aria-label="À propos" name="a_propos" value={form.a_propos} onChange={change} className="form-control" rows="3" maxLength="3000" placeholder="Présentation" /></div>
          <div className="col-12 form-check ms-2"><input id="artisan-top" name="top" type="checkbox" checked={form.top} onChange={change} className="form-check-input" /><label htmlFor="artisan-top" className="form-check-label">Mettre en avant</label></div>
        </div>
        <div className="mt-3 d-flex gap-2"><button className="btn btn-primary">{editingId ? "Enregistrer" : "Créer"}</button>{editingId && <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Annuler</button>}</div>
      </form>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead><tr><th>Nom</th><th>Spécialité</th><th>Ville</th><th>Actions</th></tr></thead>
          <tbody>{artisans.map((artisan) => <tr key={artisan.id}><td>{artisan.nom}</td><td>{artisan.specialite}</td><td>{artisan.ville}</td><td><button className="btn btn-sm btn-outline-primary me-2" onClick={() => edit(artisan)}>Modifier</button><button className="btn btn-sm btn-outline-danger" onClick={() => remove(artisan)}>Supprimer</button></td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}
