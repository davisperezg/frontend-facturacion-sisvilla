import axios from "axios";
import { DetailsFact } from "../../interface/DetailsFact";
import { API } from "../../lib/consts/const";

export const postCreateDetailsFact = async (details: DetailsFact) => {
  return await axios.post(`${API}/api/v1/fact-details`, details);
};

export const getDetailsFacts = async (id: string) => {
  return await axios.get(`${API}/api/v1/fact-details/nro/${id}`);
};
