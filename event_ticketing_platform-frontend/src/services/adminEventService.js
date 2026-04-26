import { API_BASE_URL } from "../config/api";

const EVENTS_API_URL = `${API_BASE_URL}/api/events`;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const createEvent = async (eventData) => {
  const response = await fetch(EVENTS_API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(eventData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create event");
  }

  return data;
};

export const updateEvent = async (id, eventData) => {
  const response = await fetch(`${EVENTS_API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(eventData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update event");
  }

  return data;
};

export const deleteEvent = async (id) => {
  const response = await fetch(`${EVENTS_API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete event");
  }

  return data;
};