"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type UserInfo = {
  id?: string;
  email?: string;
  name?: string;
  role?: string;
};

type AuthState = {
  user: UserInfo | null;
  isAuthenticated: boolean;
  setUser: (user: UserInfo) => void;
  clearUser: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),
      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
 