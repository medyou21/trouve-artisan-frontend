const API_URL = import.meta.env.VITE_API_URL;

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
    return data;
  } catch (err) {
    console.error("getArtisansByCategorie :", err.message);
    return [];
  }
}
