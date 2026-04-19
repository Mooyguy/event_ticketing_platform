const API_BASE_URL = "http://localhost:5001/api/analytics";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const fetchBookingsPerEvent = async () => {
  const response = await fetch(`${API_BASE_URL}/bookings-per-event`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch analytics");
  }

  return data;
};

export const fetchTopEvents = async () => {
  const response = await fetch(`${API_BASE_URL}/top-events`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch top events");
  }

  return data;
};