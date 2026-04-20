const API_BASE_URL = "http://localhost:5001/api/users";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const fetchAllUsers = async () => {
  const response = await fetch(API_BASE_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch users");
  }

  return data;
};

export const updateUserRole = async (id, role) => {
  const response = await fetch(`${API_BASE_URL}/${id}/role`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify({ role }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update role");
  }

  return data;
};