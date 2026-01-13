
const API_URL = import.meta.env.VITE_API_URL;
export async function getArtisansByCategorie(categorie) {
  try {
    const res = await fetch(
      `${API_URL}/artisans/categorie/${encodeURIComponent(
        categorie.toLowerCase()
      )}`
    );

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Erreur API (${res.status}) : ${errorText}`
      );
    }

    return await res.json();
  } catch (err) {
    console.error("getArtisansByCategorie :", err.message);
    return [];
  }
}
