import { API_BASE_URL } from "../config/api";

const RECOMMENDATIONS_API_URL = `${API_BASE_URL}/api/recommendations`;

export const fetchRecommendedEvents = async (eventId) => {
  const response = await fetch(`${RECOMMENDATIONS_API_URL}/${eventId}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch recommendations");
  }

  return data;
};