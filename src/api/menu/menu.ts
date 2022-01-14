import axios from "axios";
import { API } from "../../lib/consts/const";

export const getMenus = async () => {
  return await axios.get(`${API}/api/v1/menus`);
};
