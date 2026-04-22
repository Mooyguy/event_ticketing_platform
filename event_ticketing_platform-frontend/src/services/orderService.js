const API_BASE_URL = "http://localhost:5001/api/orders";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const checkoutOrder = async (orderData) => {
  const response = await fetch(`${API_BASE_URL}/checkout`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(orderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Checkout failed");
  }

  return data;
};

export const fetchOrdersByUser = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
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