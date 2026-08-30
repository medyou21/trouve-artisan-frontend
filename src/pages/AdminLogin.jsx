import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/admin.service";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      setLoading(true);
      setError("");
      const { token } = await loginAdmin(form.get("email"), form.get("password"));
      sessionStorage.setItem("admin_token", token);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container py-5" style={{ maxWidth: 560 }}>
      <h1 className="h2 fw-bold mb-4">Administration</h1>
      <form className="card card-body shadow-sm" onSubmit={submit}>
        <label className="form-label" htmlFor="admin-email">Adresse email</label>
        <input id="admin-email" name="email" type="email" className="form-control mb-3" required />
        <label className="form-label" htmlFor="admin-password">Mot de passe</label>
        <input id="admin-password" name="password" type="password" className="form-control mb-3" minLength="8" required />
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </section>
  );
}
