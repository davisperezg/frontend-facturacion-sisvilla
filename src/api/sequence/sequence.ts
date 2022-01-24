import axios from "axios";
import { Sequence } from "../../interface/Sequence";
import { API } from "../../lib/consts/const";

export const postSequence = async (sequence: Sequence) => {
  return await axios.post(`${API}/api/v1/sequences`, sequence);
};

export const getSequences = async () => {
  return await axios.get(`${API}/api/v1/sequences`);
};

export const updateSequence = async (id: string, sequence: Sequence) => {
  return await axios.put(`${API}/api/v1/sequences/${id}`, sequence);
};

export const getSequenceFact = async (id: string) => {
  return await axios.get(`${API}/api/v1/sequences/area/${id}`);
};
