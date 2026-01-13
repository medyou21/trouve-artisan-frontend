const API_URL = "https://app-18bf639f-8d94-41fd-a987-21054a62c8c2.cleverapps.io"; // URL de votre backend;

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
