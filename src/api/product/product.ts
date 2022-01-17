import axios from "axios";
import { Product } from "../../interface/Product";
import { API } from "../../lib/consts/const";

export const postCreateProduct = async (model: Product) => {
  return await axios.post(`${API}/api/v1/products`, model);
};

export const getProducts = async () => {
  return await axios.get(`${API}/api/v1/products`);
};

export const getProductDeleted = async () => {
  return await axios.get(`${API}/api/v1/products/removes`);
};

export const deleteProduct = async (id: string) => {
  return await axios.delete(`${API}/api/v1/products/${id}`);
};

export const restoreProduct = async (id: string) => {
  return await axios.put(`${API}/api/v1/products/restore/${id}`);
};

export const updateProduct = async (id: string, model: Product) => {
  return await axios.put(`${API}/api/v1/products/${id}`, model);
};
