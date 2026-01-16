const API_URL = import.meta.env.VITE_API_URL;

/**
 * 🔹 Récupère les artisans "top" depuis l'API.
 * @returns {Promise<Array>} Liste des artisans normalisés
 */
export async function getTopArtisans() {
  if (!API_URL) {
    console.error("VITE_API_URL non défini !");
    return [];
  }

  try {
    const url = `${API_URL}/api/artisans/top`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur API (${response.status}) : ${errorText}`);
    }

    const data = await response.json();

    // 🔹 Normalisation des données pour correspondre aux relations Sequelize
    const normalizedData = data.map((artisan) => ({
      id: artisan.id,
      nom: artisan.nom || "Indisponible",
      specialite: artisan.specialite_obj?.nom || "Non précisée",
      ville: artisan.ville_obj?.nom || "Indisponible",
      departement: artisan.ville_obj?.departement?.nom || artisan.departement_obj?.nom || "",
      categorie: artisan.categorie?.nom || "",
      note: Number(artisan.note) || 0,
      image: artisan.image || "/images/placeholder.jpg",
      email: artisan.email || "",
      site_web: artisan.site_web || "",
      a_propos: artisan.a_propos || "",
      top: artisan.top || false,
    }));

    return normalizedData;
  } catch (error) {
    console.error("Impossible de récupérer les artisans :", error.message);
    return [];
  }
}
