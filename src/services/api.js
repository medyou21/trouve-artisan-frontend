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
    const normalizedData = data.map((a) => ({
      id: a.id,
      nom: a.nom || "Indisponible",
      specialite: a.specialite_obj?.nom || "Non précisée",
      ville: a.ville_obj?.nom || "Indisponible",
      departement: a.departement_obj?.nom || "",
      categorie: a.categorie?.nom || "",
      note: Number(a.note) || 0,
      image: a.image || "/images/placeholder.jpg",
    }));

    return normalizedData;
  } catch (error) {
    console.error("Impossible de récupérer les artisans :", error.message);
    return [];
  }
}
