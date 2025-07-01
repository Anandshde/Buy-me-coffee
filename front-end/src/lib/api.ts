// client/lib/api.ts
import axios from "axios";

// Adjust this base URL to match your backend's URL
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
