"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { BackendCartResponse } from "@/types/types";

type CartItemState = {
  productId: string;
  quantity: number;
};

type CartState = {
  items: CartItemState[];
  itemCount: number;
  setCartFromResponse: (cart?: BackendCartResponse | null) => void;
  incrementCount: (qty?: number) => void;
  addOrUpdateItem: (productId: string, qty?: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      itemCount: 0,
      setCartFromResponse: (cart) =>
        set(() => {
          if (!cart?.items) {
            return { items: [], itemCount: 0 };
          }
          const items = cart.items.map((item) => ({
            productId: typeof item.product === "string" ? item.product : item.product._id,
            quantity: item.quantity,
          }));
          const itemCount = cart.items.reduce((acc, item) => acc + item.quantity, 0);
          return { items, itemCount };
        }),
      incrementCount: (qty = 1) =>
        set((state) => ({
          itemCount: Math.max(0, state.itemCount + qty),
        })),
      addOrUpdateItem: (productId, qty = 1) =>
        set((state) => {
          const exists = state.items.some((item) => item.productId === productId);
          if (exists) {
            return state;
          }
          const items = [...state.items, { productId, quantity: qty }];
          return {
            items,
            itemCount: Math.max(0, state.itemCount + qty),
          };
        }),
      clearCart: () => set({ items: [], itemCount: 0 }),
    }),
    {
      name: "cart-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        itemCount: state.itemCount,
      }),
    }
  )
);


