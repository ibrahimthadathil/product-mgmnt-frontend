import { CartItem } from "@/types/types";
import instance from "@/utils/axiosInstance";

export const addToCart = async (
  data: Partial<Omit<CartItem, "user" | "created_at">>
) => {
  try {
    const result = await instance.post("/api/cart", data);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const updateCart = async (data: {
  cartId: string;
  quantity: number;
}) => {
  try {
    const result = await instance.put(`/api/cart/${data.cartId}`, data);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const deleteCart = async (cartId: string) => {
  try {
    const result = await instance.delete(`/api/cart/${cartId}`);
    return result.data;
  } catch (error) {
    throw error;
  }
};
