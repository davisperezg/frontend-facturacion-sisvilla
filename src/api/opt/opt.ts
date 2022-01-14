import axios from "axios";
import { API } from "../../lib/consts/const";

export const getOptions = async () => {
  return await axios.get(`${API}/api/v1/options`);
};
