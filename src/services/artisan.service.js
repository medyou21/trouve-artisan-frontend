const API_URL = import.meta.env.VITE_API_URL;

/**
 * 🔹 Récupère les artisans d’une catégorie depuis l’API.
 * @param {string} categorie Nom de la catégorie
 * @returns {Promise<Array>} Liste des artisans normalisés
 */
export async function getArtisansByCategorie(categorie) {
  if (!API_URL) {
    console.error("VITE_API_URL non défini !");
    return [];
  }

  if (!categorie || typeof categorie !== "string") {
    console.error("Catégorie invalide :", categorie);
    return [];
  }

  try {
    const url = `${API_URL}/api/artisans/categorie/${encodeURIComponent(
      categorie.toLowerCase()
    )}`;

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
      specialite: a.specialite || "Non précisée",
      ville: a.ville || "Indisponible",
      departement: a.departement || "",
      note: Number(a.note) || 0,
      image: a.image || "/images/placeholder.jpg",
    }));

    return normalizedData;
  } catch (err) {
    console.error("getArtisansByCategorie :", err.message);
    return [];
  }
}
