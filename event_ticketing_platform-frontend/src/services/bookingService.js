const API_BASE_URL = "http://localhost:5001/api/bookings";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const createBooking = async (bookingData) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Booking failed");
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

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch user bookings");
  }

  return data;
};





// const API_BASE_URL = "http://localhost:5001/api/bookings";

// export const createBooking = async (bookingData) => {
//   const response = await fetch(API_BASE_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(bookingData),
//   });

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Booking failed");
//   }

//   return data;
// };

// export const fetchAllBookings = async () => {
//   const response = await fetch(API_BASE_URL);
//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to fetch bookings");
//   }

//   return data;
// };

// export const fetchBookingsByUser = async (userId) => {
//   const response = await fetch(`${API_BASE_URL}/user/${userId}`);
//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || "Failed to fetch user bookings");
//   }

//   return data;
// };