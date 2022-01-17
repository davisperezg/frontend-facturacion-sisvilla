import axios from "axios";
import { Model } from "../../interface/Model";
import { API } from "../../lib/consts/const";

export const postCreateModel = async (model: Model) => {
  return await axios.post(`${API}/api/v1/models`, model);
};

export const getModels = async () => {
  return await axios.get(`${API}/api/v1/models`);
};

export const getModelDeleted = async () => {
  return await axios.get(`${API}/api/v1/models/removes`);
};

export const deleteModel = async (id: string) => {
  return await axios.delete(`${API}/api/v1/models/${id}`);
};

export const restoreModel = async (id: string) => {
  return await axios.put(`${API}/api/v1/models/restore/${id}`);
};

export const updateModel = async (id: string, model: Model) => {
  return await axios.put(`${API}/api/v1/models/${id}`, model);
};
