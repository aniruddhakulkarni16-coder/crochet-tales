import { API_URL } from "../config";

const TOKEN_KEY = "adminToken";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function loginRequest(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data.token;
}

export async function checkToken() {
  const token = getToken();
  if (!token) return false;

  try {
    const res = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch (error) {
    return false;
  }
}
export async function deleteProduct(productId) {
  const res = await fetch(`${API_URL}/api/products/${productId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Could not delete product");
  }
}
export async function saveProduct(productId, product) {
  const isEdit = productId !== null && productId !== undefined;
  const url = isEdit
    ? `${API_URL}/api/products/${productId}`
    : `${API_URL}/api/products`;

  const res = await fetch(url, {
    method: isEdit ? "PUT" : "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(product),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Could not save product");
  }

  return data;
}
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Image upload failed");
  }

  return data.url;
}