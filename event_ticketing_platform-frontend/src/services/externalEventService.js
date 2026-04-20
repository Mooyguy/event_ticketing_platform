const API_BASE_URL = "http://localhost:5001/api/external-events";

export const searchExternalEvents = async (query = "") => {
  const url = query
    ? `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`
    : `${API_BASE_URL}/search`;

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch external events");
  }

  return data.events || [];
};