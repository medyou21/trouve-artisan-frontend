const API_URL = import.meta.env.VITE_API_URL;

/**
 * 🔹 Récupère les artisans d’une catégorie depuis l’API.
 * @param {number|string} categorieId ID de la catégorie
 * @returns {Promise<Array>} Liste des artisans normalisés
 */

export async function getArtisansByCategorie(categorieId) {
  if (!API_URL || !categorieId) return [];

  try {
    const res = await fetch(`${API_URL}/api/artisans/categorie/${categorieId}`);
    if (!res.ok) throw new Error(`Erreur API ${res.status}`);

    const data = await res.json();

    return data.map((a) => ({
      id: a.id,
      nom: a.nom || "Indisponible",
      specialite: a.specialite_obj?.nom || "Non précisée",
      ville: a.ville_obj?.nom || "Indisponible",
      departement: a.ville_obj?.departement?.nom || "Indisponible",
      categorie: a.categorie?.nom || "Indisponible",
      note: Number(a.note) || 0,
      image: a.image || "/images/placeholder.jpg",
      email: a.email || "",
      site_web: a.site_web || "Indisponible",
      a_propos: a.a_propos || "Indisponible",
      top: Boolean(a.top),
    }));
  } catch (err) {
    console.error("getArtisansByCategorie :", err.message);
    return [];
  }
}
