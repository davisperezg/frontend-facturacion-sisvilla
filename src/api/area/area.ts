import axios from "axios";
import { Area } from "../../interface/Area";
import { API } from "../../lib/consts/const";

export const postArea = async (area: Area) => {
  return await axios.post(`${API}/api/v1/areas`, area);
};

export const getAreas = async () => {
  return await axios.get(`${API}/api/v1/areas`);
};

export const getAreaDeleted = async () => {
  return await axios.get(`${API}/api/v1/areas/removes`);
};

export const deleteArea = async (id: string) => {
  return await axios.delete(`${API}/api/v1/areas/${id}`);
};

export const restoreArea = async (id: string) => {
  return await axios.put(`${API}/api/v1/areas/restore/${id}`);
};

export const updateArea = async (id: string, area: Area) => {
  return await axios.put(`${API}/api/v1/areas/${id}`, area);
};
