import axios from "axios";
import { API } from "../../lib/consts/const";

export const getServiceData = (type: string, value: string) => {
  return axios.get(`${API}/api/v1/users/services/${type}/${value}`);
};
