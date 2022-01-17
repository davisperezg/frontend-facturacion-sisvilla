import { Unit } from "./../../interface/Unit";
import axios from "axios";
import { API } from "../../lib/consts/const";

export const postCreateUnit = async (unit: Unit) => {
  return await axios.post(`${API}/api/v1/unit-measure`, unit);
};

export const getUnits = async () => {
  return await axios.get(`${API}/api/v1/unit-measure`);
};

export const getUnitDeleted = async () => {
  return await axios.get(`${API}/api/v1/unit-measure/removes`);
};

export const deleteUnit = async (id: string) => {
  return await axios.delete(`${API}/api/v1/unit-measure/${id}`);
};

export const restoreUnit = async (id: string) => {
  return await axios.put(`${API}/api/v1/unit-measure/restore/${id}`);
};

export const updateUnit = async (id: string, unit: Unit) => {
  return await axios.put(`${API}/api/v1/unit-measure/${id}`, unit);
};
