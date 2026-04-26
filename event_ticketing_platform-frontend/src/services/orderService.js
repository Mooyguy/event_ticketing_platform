import { API_BASE_URL } from "../config/api";

const ORDERS_API_URL = `${API_BASE_URL}/api/orders`;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const checkoutOrder = async (orderData) => {
  const response = await fetch(`${ORDERS_API_URL}/checkout`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(orderData),
  });

  // Be defensive: backend (or proxies) may return non-JSON on errors.
  const rawText = await response.text();
  let data;
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    data = { message: rawText };
  }

  if (!response.ok) {
    const details = data?.error ? ` (${data.error})` : "";
    const message = (data?.message || "Checkout failed") + details;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
};

export const fetchOrdersByUser = async (userId) => {
  const response = await fetch(`${ORDERS_API_URL}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch orders");
  }

  return data;
};