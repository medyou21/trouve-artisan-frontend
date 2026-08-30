const API_URL = import.meta.env.VITE_API_URL;

/**
 * Vérifie que l’API est bien configurée
 */
function checkApiUrl() {
  if (!API_URL) {
    console.error("❌ VITE_API_URL non défini !");
    return false;
  }
  return true;
}

/**
 * 🔹 Normalisation d’un artisan (évite les undefined / null)
 */
function normalizeArtisan(a) {
  return {
    id: a.id,
    nom: a.nom || "Indisponible",
    specialite: a.specialite_obj?.nom || "Non précisée",
    ville: a.ville?.nom || "Indisponible",
    departement: a.ville?.departement
      ? { id: a.ville.departement.id, code: a.ville.departement.code, nom: a.ville.departement.nom }
      : null,
    categorie: a.specialite_obj?.categorie?.nom || "",
    note: Number(a.note) || 0,
    image: a.image || "/images/placeholder.jpg",
    email: a.email || "",
    site_web: a.site_web || "",
    a_propos: a.a_propos || "",
    top: Boolean(a.top),
  };
}


/**
 * 🔹 Tous les artisans
 */
export async function getAllArtisans() {
  if (!checkApiUrl()) return [];

  try {
    const res = await fetch(`${API_URL}/api/artisans`);
    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    return data.map(normalizeArtisan);
  } catch (err) {
    console.error("getAllArtisans ❌", err.message);
    return [];
  }
}

/**
 * 🔹 Artisans TOP
 */
export async function getTopArtisans() {
  if (!checkApiUrl()) return [];

  try {
    const res = await fetch(`${API_URL}/api/artisans/top`);
    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    return data.map(normalizeArtisan);
  } catch (err) {
    console.error("getTopArtisans ❌", err.message);
    return [];
  }
}

/**
 * 🔹 Artisans par catégorie
 */
export async function getArtisansByCategorie(categorieId) {
  if (!checkApiUrl() || !categorieId) return [];

  try {
    const res = await fetch(
      `${API_URL}/api/artisans/categorie/${categorieId}`
    );
    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    return data.map(normalizeArtisan);
  } catch (err) {
    console.error("getArtisansByCategorie ❌", err.message);
    return [];
  }
}

/**
 * 🔹 Artisans par département
 */
export async function getArtisansByDepartement(departementId) {
  if (!checkApiUrl() || !departementId) return [];

  try {
    const res = await fetch(
      `${API_URL}/api/artisans/departement/${departementId}`
    );
    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    return data.map(normalizeArtisan);
  } catch (err) {
    console.error("getArtisansByDepartement ❌", err.message);
    return [];
  }
}

/**
 * 🔹 Artisans par ville
 */
export async function getArtisansByVille(villeId) {
  if (!checkApiUrl() || !villeId) return [];

  try {
    const res = await fetch(
      `${API_URL}/api/artisans/ville/${villeId}`
    );
    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    return data.map(normalizeArtisan);
  } catch (err) {
    console.error("getArtisansByVille ❌", err.message);
    return [];
  }
}

/**
 * 🔹 Recherche par nom
 */
export async function searchArtisans(query) {
  if (!checkApiUrl() || !query) return [];

  try {
    const res = await fetch(
      `${API_URL}/api/artisans/search?q=${encodeURIComponent(query)}`
    );
    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    return data.map(normalizeArtisan);
  } catch (err) {
    console.error("searchArtisans ❌", err.message);
    return [];
  }
}

/**
 * 🔹 Un artisan par ID
 */
export async function getArtisanById(id) {
  if (!checkApiUrl() || !id) return null;

  try {
    const res = await fetch(`${API_URL}/api/artisans/${id}`);
    if (!res.ok) throw new Error(await res.text());

    const data = await res.json();
    return normalizeArtisan(data);
  } catch (err) {
    console.error("getArtisanById ❌", err.message);
    return null;
  }
}
