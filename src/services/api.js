const API_URL = import.meta.env.VITE_API_URL;

/**
 * Récupère les artisans les mieux notés depuis l'API.
 * @returns {Promise<Array>} Liste des artisans
 */
export async function getTopArtisans() {
  try {
    const response = await fetch(`${API_URL}/api/artisans/top`);

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Impossible de récupérer les artisans :", error);
    return [];
  }
}
