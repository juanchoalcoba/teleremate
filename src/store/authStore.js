import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: localStorage.getItem("tr_token") || null,
  user: JSON.parse(localStorage.getItem("tr_user") || "null"),
  isAuthenticated: !!localStorage.getItem("tr_token"),

  setAuth: (token, user) => {
    localStorage.setItem("tr_token", token);
    localStorage.setItem("tr_user", JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("tr_token");
    localStorage.removeItem("tr_user");
    set({ token: null, user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
