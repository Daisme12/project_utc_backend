export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:8080";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || `${BASE_URL}/api/v1`;

export const API_URL = API_BASE_URL;

