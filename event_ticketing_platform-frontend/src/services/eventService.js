const API_BASE_URL = "http://localhost:5001/api/events";

export const fetchAllEvents = async () => {
  const response = await fetch(API_BASE_URL);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch events");
  }

  return data;
};

export const fetchEventById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch event");
  }

  return data;
};