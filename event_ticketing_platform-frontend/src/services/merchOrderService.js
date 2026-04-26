import { API_BASE_URL } from "../config/api";

const MERCH_ORDERS_API_URL = `${API_BASE_URL}/api/merch-orders`;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const createMerchOrder = async (orderData) => {
  const response = await fetch(MERCH_ORDERS_API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(orderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create merchandise order");
  }

  return data;
};