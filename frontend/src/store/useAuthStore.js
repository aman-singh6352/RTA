import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (err) {
      console.log("Error in useAuthStore.js:: in checkAuth:", err.message);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully!");
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
      console.log("Error in useAuthStore.js in signup ::", err.message);
    } finally {
      set({ isSigningUp: false });
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";

      toast.error(message);
      console.log("Error in useAuthStore.js in login ::", err.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: () => {
    try {
      axiosInstance.post("/auth/logout");
      toast.success("Logged out successfully");
      set({authUser: null});
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      toast.error(message);
    }
  },
}));
