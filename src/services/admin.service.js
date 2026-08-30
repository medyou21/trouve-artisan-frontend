const API_URL = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = sessionStorage.getItem("admin_token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token || ""}`,
  };
}

async function parseResponse(response) {
  if (response.status === 204) return null;
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Erreur API");
  return data;
}

export async function loginAdmin(email, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return parseResponse(response);
}

export async function getReferences() {
  const [categories, specialites, villes] = await Promise.all([
    fetch(`${API_URL}/api/categories`).then(parseResponse),
    fetch(`${API_URL}/api/specialites`).then(parseResponse),
    fetch(`${API_URL}/api/villes`).then(parseResponse),
  ]);
  return { categories, specialites, villes };
}

export async function createArtisan(payload) {
  return parseResponse(await fetch(`${API_URL}/api/artisans`, {
    method: "POST", headers: authHeaders(), body: JSON.stringify(payload),
  }));
}

export async function updateArtisan(id, payload) {
  return parseResponse(await fetch(`${API_URL}/api/artisans/${id}`, {
    method: "PUT", headers: authHeaders(), body: JSON.stringify(payload),
  }));
}

export async function deleteArtisan(id) {
  return parseResponse(await fetch(`${API_URL}/api/artisans/${id}`, {
    method: "DELETE", headers: authHeaders(),
  }));
}
