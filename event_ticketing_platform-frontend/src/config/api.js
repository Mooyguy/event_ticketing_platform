const rawBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!rawBaseUrl) {
    throw new Error(
        "Missing VITE_API_BASE_URL. Define it in a .env file or your hosting environment."
    );
}

export const API_BASE_URL = String(rawBaseUrl).replace(/\/+$/, "");
