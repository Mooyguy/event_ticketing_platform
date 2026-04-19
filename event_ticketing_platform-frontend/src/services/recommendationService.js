const API_BASE_URL = "http://localhost:5001/api/recommendations";

export const fetchRecommendedEvents = async (eventId) => {
  const response = await fetch(`${API_BASE_URL}/${eventId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch recommendations");
  }

  return data;
};