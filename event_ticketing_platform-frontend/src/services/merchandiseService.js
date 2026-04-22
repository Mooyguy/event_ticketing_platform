const API_BASE_URL = "http://localhost:5001/api/merchandise";
const EVENTS_API_URL = "http://localhost:5001/api/events";

const getAdminHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const fetchAllMerchandise = async () => {
    const response = await fetch(API_BASE_URL);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch merchandise");
    }

    return data;
};

export const fetchMerchandiseById = async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch merchandise item");
    }

    return data;
};

export const fetchMerchandiseByEvent = async (eventId) => {
    const response = await fetch(`${API_BASE_URL}/event/${eventId}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch event merchandise");
    }

    return data;
};

export const fetchAllEventsForMerchForm = async () => {
    const response = await fetch(EVENTS_API_URL);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch events");
    }

    return data;
};

export const createMerchandise = async (merchData) => {
    const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify(merchData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to create merchandise");
    }

    return data;
};

export const updateMerchandise = async (id, merchData) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: getAdminHeaders(),
        body: JSON.stringify(merchData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to update merchandise");
    }

    return data;
};

export const fetchRecommendedMerchandise = async (category) => {
    const response = await fetch(`${API_BASE_URL}/recommended/${encodeURIComponent(category)}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to fetch recommended merchandise");
    }

    return data;
};

export const deleteMerchandise = async (id) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to delete merchandise");
    }

    return data;
};