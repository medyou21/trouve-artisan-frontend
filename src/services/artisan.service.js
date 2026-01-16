const API_URL = import.meta.env.VITE_API_URL;

/**
 * 🔹 Récupère les artisans d’une catégorie depuis l’API.
 * @param {number|string} categorieId ID de la catégorie
 * @returns {Promise<Array>} Liste des artisans normalisés
 */
export async function getArtisansByCategorie(categorieId) {
  if (!API_URL) {
    console.error("VITE_API_URL non défini !");
    return [];
  }

  if (!categorieId) {
    console.error("ID de catégorie invalide :", categorieId);
    return [];
  }

  try {
    const url = `${API_URL}/api/artisans/categorie/${categorieId}`;
    const res = await fetch(url);

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Erreur API (${res.status}) : ${errorText}`);
    }

    const data = await res.json();

    // 🔹 Normalisation des champs pour éviter les valeurs nulles ou incorrectes
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
  } catch (err) {
    console.error("getArtisansByCategorie :", err.message);
    return [];
  }
}
