import axios from "axios";

// Dynamically chooses local development port or falls back to production domain
const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// 1. Create a dedicated Axios instance
const API = axios.create({
  baseURL: API_URL,
});

// 2. THE CRUCIAL FIX: Intercept every single outgoing request and inject the Bearer Token
API.interceptors.request.use(
  (config) => {
    // Pull the logged-in user profile from local storage cache
    const userInfo = localStorage.getItem("userInfo");
    
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      // If a valid signed token exists, place it in the secure Authorization header
      if (parsedUser && parsedUser.token) {
        config.headers.Authorization = `Bearer ${parsedUser.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Activity API Calls (Updated to use our secure interceptor instance)
export const createActivity = (activity) => API.post("/activities", activity);
export const getActivities = () => API.get("/activities");
export const updateActivity = (id, activity) => API.put(`/activities/${id}`, activity);
export const deleteActivity = (id) => API.delete(`/activities/${id}`);

// 4. Goal API Calls (Updated to use our secure interceptor instance)
export const createGoal = (goal) => API.post("/goals", goal);
export const getGoals = () => API.get("/goals");
export const updateGoal = (id, goal) => API.put(`/goals/${id}`, goal);
export const deleteGoal = (id) => API.delete(`/goals/${id}`);

// ... double-check that these exact names are exported at the bottom of api.js:

export const getChallenges = () => API.get("/challenges");
export const createChallenge = (challengeData) => API.post("/challenges", challengeData);
export const updateChallenge = (id, progressData) => API.put(`/challenges/${id}`, progressData);
export const deleteChallenge = (id) => API.delete(`/challenges/${id}`);
export const joinChallengeAPI = (id, paymentData) => API.post(`/challenges/${id}/join`, paymentData);
export const sendContactMessage = (messageData) => API.post("/messages", messageData);
