import axios from "axios";
import { API } from "../../lib/consts/const";

export const postResource = async (data: any) => {
  return await axios.post(`${API}/api/v1/module-options`, data);
};

export const getResourceByRol = async (rol: string) => {
  return await axios.get(`${API}/api/v1/module-options/resource/role/${rol}`);
};

export const putResource = async (data: any, id: string) => {
  return await axios.put(`${API}/api/v1/module-options/${id}`, data);
};
