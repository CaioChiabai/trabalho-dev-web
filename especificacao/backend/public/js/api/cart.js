import { API_BASE_URL } from "./config.js";

export async function getCartItems() {
  const res = await fetch(`${API_BASE_URL}/cart-items?populate=*`);
  const data = await res.json();
  return data.data;
}

export async function addToCart(produtoId, quantidade = 1) {
  const res = await fetch(`${API_BASE_URL}/cart-items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { produto: produtoId, quantidade } })
  });
  return await res.json();
}

export async function removeFromCart(itemId) {
  await fetch(`${API_BASE_URL}/cart-items/${itemId}`, { method: "DELETE" });
}