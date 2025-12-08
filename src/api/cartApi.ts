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

export const getCart = async () => {
  try {
    const result = await instance.get("/api/cart");
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

export const deleteCart = async (productId: string) => {
  try {
    const result = await instance.delete(`/api/cart/${productId}`);
    return result.data;
  } catch (error) {
    throw error;
  }
};
