import axios from "axios";
import { Mark } from "../../interface/Mark";
import { API } from "../../lib/consts/const";

export const postCreateMark = async (mark: Mark) => {
  return await axios.post(`${API}/api/v1/marks`, mark);
};

export const getMarks = async () => {
  return await axios.get(`${API}/api/v1/marks`);
};

export const getMarkDeleted = async () => {
  return await axios.get(`${API}/api/v1/marks/removes`);
};

export const deleteMark = async (id: string) => {
  return await axios.delete(`${API}/api/v1/marks/${id}`);
};

export const restoreMark = async (id: string) => {
  return await axios.put(`${API}/api/v1/marks/restore/${id}`);
};

export const updateMark = async (id: string, mark: Mark) => {
  return await axios.put(`${API}/api/v1/marks/${id}`, mark);
};
