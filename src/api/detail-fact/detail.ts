import axios from "axios";
import { DetailsFact } from "../../interface/DetailsFact";
import { API } from "../../lib/consts/const";

export const postCreateDetailsFact = async (details: DetailsFact) => {
  return await axios.post(`${API}/api/v1/details`, details);
};

export const getDetailsFacts = async () => {
  return await axios.get(`${API}/api/v1/details`);
};

export const getDetailsFactDeleted = async () => {
  return await axios.get(`${API}/api/v1/details/removes`);
};

export const deleteDetailsFact = async (id: string) => {
  return await axios.delete(`${API}/api/v1/details/${id}`);
};

export const restoreDetailsFact = async (id: string) => {
  return await axios.put(`${API}/api/v1/details/restore/${id}`);
};

export const updateDetailsFact = async (id: string, details: DetailsFact) => {
  return await axios.put(`${API}/api/v1/details/${id}`, details);
};
