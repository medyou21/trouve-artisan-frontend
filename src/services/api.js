const API_URL = import.meta.env.VITE_API_URL;

/**
 * 🔹 Récupère les artisans "top" depuis l'API
 * @returns {Promise<Array>} Liste des artisans normalisés
 */
export async function getTopArtisans() {
  try {
    const response = await fetch(`${API_URL}/api/artisans/top`);
    if (!response.ok) throw new Error("Erreur API");

    const data = await response.json();

    return data.map((artisan) => ({
      id: artisan.id,
      nom: artisan.nom || "Indisponible",
      specialite: artisan.specialite_obj?.nom || "Non précisée",

      // ✅ Ville
      ville: artisan.ville?.nom || "Indisponible",

      // ✅ Département NORMALISÉ (objet)
      departement: artisan.ville?.departement
        ? {
            id: artisan.ville.departement.id,
            code: artisan.ville.departement.code,
            nom: artisan.ville.departement.nom,
          }
        : null,

      categorie: artisan.categorie?.nom || "Indisponible",
      note: Number(artisan.note) || 0,
      image: artisan.image || "/images/placeholder.jpg",
      email: artisan.email || "",
      site_web: artisan.site_web || "",
      a_propos: artisan.a_propos || "",
      top: Boolean(artisan.top),
    }));
  } catch (err) {
    console.error("getTopArtisans ❌", err);
    return [];
  }
}
