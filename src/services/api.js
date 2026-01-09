const API_URL = "http://localhost:3000/api";

/**
 * Récupère les artisans les mieux notés depuis l'API.
 * @returns {Promise<Array>} Liste des artisans
 */
export async function getTopArtisans() {
  try {
    const response = await fetch(`${API_URL}/artisans/top`);

    // Vérifie si la requête a réussi
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Impossible de récupérer les artisans :", error);
    return []; 
    // Retourne un tableau vide en cas d'erreur pour éviter les plantages
  }
}
