const API_BASE_URL = "http://localhost:5001/api/events";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const createEvent = async (eventData) => {
  const response = await fetch(API_BASE_URL, {
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
  const response = await fetch(`${API_BASE_URL}/${id}`, {
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
  const response = await fetch(`${API_BASE_URL}/${id}`, {
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


// const API_BASE_URL = "http://localhost:5001/api/events";

// const getAdminHeaders = () => ({
//   "Content-Type": "application/json",
//   Authorization: `Bearer ${localStorage.getItem("token")}`,
// });

// export const createEvent = async (eventData) => {
//   const response = await fetch(API_BASE_URL, {
//     method: "POST",
//     headers: getAdminHeaders(),
//     body: JSON.stringify(eventData),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to create event");
//   }

//   return data;
// };

// export const updateEvent = async (id, eventData) => {
//   const response = await fetch(`${API_BASE_URL}/${id}`, {
//     method: "PUT",
//     headers: getAdminHeaders(),
//     body: JSON.stringify(eventData),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to update event");
//   }

//   return data;
// };

// export const deleteEvent = async (id) => {
//   const response = await fetch(`${API_BASE_URL}/${id}`, {
//     method: "DELETE",
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     },
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to delete event");
//   }

//   return data;
// };