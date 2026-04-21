const API_BASE_URL = "http://localhost:5001/api/bookings";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const handleUnauthorized = (response) => {
  if (response.status === 401) {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
    return true;
  }

  return false;
};

export const createBooking = async (bookingData) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingData),
  });

  const data = await response.json();

  if (handleUnauthorized(response)) return;

  if (!response.ok) {
    const error = new Error(data.message || "Booking failed");
    error.data = data;
    error.status = response.status;
    throw error;
  }

  return data;
};

export const fetchAllBookings = async () => {
  const response = await fetch(API_BASE_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await response.json();

  if (handleUnauthorized(response)) return;

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch bookings");
  }

  return data;
};

export const fetchBookingsByUser = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await response.json();

  if (handleUnauthorized(response)) return;

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch user bookings");
  }

  return data;
};

export const deleteBookingById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await response.json();

  if (handleUnauthorized(response)) return;

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete booking");
  }

  return data;
};

export const addTicketsToBooking = async (bookingId, quantity) => {
  const response = await fetch(`${API_BASE_URL}/${bookingId}/add-tickets`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ quantity }),
  });

  const data = await response.json();

  if (handleUnauthorized(response)) return;

  if (!response.ok) {
    throw new Error(data.message || "Failed to update booking");
  }

  return data;
};