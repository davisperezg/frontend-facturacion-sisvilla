import axios from "axios";
import { Supplier } from "../../interface/Supplier";
import { API } from "../../lib/consts/const";

export const postCreateSupplier = async (supplier: Supplier) => {
  return await axios.post(`${API}/api/v1/suppliers`, supplier);
};

export const getSuppliers = async () => {
  return await axios.get(`${API}/api/v1/suppliers`);
};

export const getSupplierDeleted = async () => {
  return await axios.get(`${API}/api/v1/suppliers/removes`);
};

export const deleteSupplier = async (id: string) => {
  return await axios.delete(`${API}/api/v1/suppliers/${id}`);
};

export const restoreSupplier = async (id: string) => {
  return await axios.put(`${API}/api/v1/suppliers/restore/${id}`);
};

export const updateSupplier = async (id: string, supplier: Supplier) => {
  return await axios.put(`${API}/api/v1/suppliers/${id}`, supplier);
};
