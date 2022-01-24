import axios from "axios";
import { DetailsFact } from "../../interface/DetailsFact";
import { API } from "../../lib/consts/const";

export const postCreateDetailsFact = async (details: DetailsFact) => {
  return await axios.post(`${API}/api/v1/fact-details`, details);
};

export const getDetailsFacts = async () => {
  return await axios.get(`${API}/api/v1/fact-details`);
};

export const getDetailsFactDeleted = async () => {
  return await axios.get(`${API}/api/v1/fact-details/removes`);
};

export const deleteDetailsFact = async (id: string) => {
  return await axios.delete(`${API}/api/v1/fact-details/${id}`);
};

export const restoreDetailsFact = async (id: string) => {
  return await axios.put(`${API}/api/v1/fact-details/restore/${id}`);
};

export const updateDetailsFact = async (id: string, details: DetailsFact) => {
  return await axios.put(`${API}/api/v1/fact-details/${id}`, details);
};
