import axios from "axios";
import { Rol } from "../../interface/Rol";
import { API } from "../../lib/consts/const";

export const postCreateRole = async (role: Rol) => {
  return await axios.post(`${API}/api/v1/roles`, role);
};

export const getRoles = async () => {
  return await axios.get(`${API}/api/v1/roles`);
};

export const getDataRole = async (name: any) => {
  return await axios.post(`${API}/api/v1/roles/data`, name);
};

export const getRolesDeleted = async () => {
  return await axios.get(`${API}/api/v1/roles/removes`);
};

export const deleteRole = async (id: string) => {
  return await axios.delete(`${API}/api/v1/roles/${id}`);
};

export const restoreRole = async (id: string) => {
  return await axios.put(`${API}/api/v1/roles/restore/${id}`);
};

export const updateRole = async (id: string, role: Rol) => {
  return await axios.put(`${API}/api/v1/roles/${id}`, role);
};
