import { API_BASE_URL } from "../config/api";

const EVENTS_API_URL = `${API_BASE_URL}/api/events`;

export const fetchAllEvents = async () => {
  const response = await fetch(EVENTS_API_URL);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch events");
  }

  return data;
};

export const fetchEventById = async (id) => {
  const response = await fetch(`${EVENTS_API_URL}/${id}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch event");
  }

  return data;
};