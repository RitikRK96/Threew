// src/services/api.js
import axios from "axios";

const isDev = typeof import.meta !== "undefined" && import.meta.env && import.meta.env.DEV;
const baseUrl =
  (import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  (isDev ? "http://localhost:5000/api/users" : `${window.location.origin}/api/users`);

const API = axios.create({
  baseURL: baseUrl,
});

// Add a new user
export const addUser = (data) => API.post("/add", data);

// Claim points for a user
export const claimPoints = (userId) => API.post(`/claim/${userId}`);

// Get leaderboard
export const getLeaderboard = () => API.get("/leaderboard");

// Get claim history
export const getHistory = (params = {}) => API.get("/history", { params });
