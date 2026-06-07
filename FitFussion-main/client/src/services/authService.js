// client/src/services/authService.js
import axios from "axios";

export const signup = async (userData) => {
  const response = await axios.post("/api/auth/signup", userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await axios.post("/api/auth/login", userData);
  return response.data;
};
