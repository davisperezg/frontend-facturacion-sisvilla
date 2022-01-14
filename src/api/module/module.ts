import axios from "axios";
import { Module } from "../../interface/Module";
import { API } from "../../lib/consts/const";

export const postCreateModule = async (module: Module) => {
  return await axios.post(`${API}/api/v1/modules`, module);
};

export const getModules = async () => {
  return await axios.get(`${API}/api/v1/modules`);
};

export const getModuleDeleted = async () => {
  return await axios.get(`${API}/api/v1/modules/removes`);
};

export const deleteModule = async (id: string) => {
  return await axios.delete(`${API}/api/v1/modules/${id}`);
};

export const restoreModule = async (id: string) => {
  return await axios.put(`${API}/api/v1/modules/restore/${id}`);
};

export const updateModule = async (id: string, module: Module) => {
  return await axios.put(`${API}/api/v1/modules/${id}`, module);
};
