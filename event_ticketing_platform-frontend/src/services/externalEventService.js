import { API_BASE_URL } from "../config/api";

const EXTERNAL_EVENTS_API_URL = `${API_BASE_URL}/api/external-events`;

export const searchExternalEvents = async (query = "") => {
  const url = query
    ? `${EXTERNAL_EVENTS_API_URL}/search?q=${encodeURIComponent(query)}`
    : `${EXTERNAL_EVENTS_API_URL}/search`;

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch external events");
  }

  return data.events || [];
};