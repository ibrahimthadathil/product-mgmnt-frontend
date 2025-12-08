import instance from "@/utils/axiosInstance";

export const addProduct = async (data: FormData) => {
  try {
    const result = await instance.post("/api/product", data);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const editProduct = async (productId: string, data: FormData) => {
  try {
    const result = await instance.put(`/api/product/${productId}`, data);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async (productId: string) => {
  try {
    const result = await instance.delete(`/api/product/${productId}`);
    return result.data;
  } catch (error) {
    throw error;
  }
};

export const getAllProduct = async () => {
  try {
    const result = await instance.get('/api/product')
    return result.data
  } catch (error) {
    throw error
  }
};

export const getProductById = async (productId: string) => {
  try {
    const result = await instance.get(`/api/product/${productId}`);
    return result.data;
  } catch (error) {
    throw error;
  }
};