import axios from "axios";
import { User } from "../../interface/User";
import { API } from "../../lib/consts/const";

export const whois = async (): Promise<any> => {
  return await axios.get(`${API}/api/v1/users/whois`);
};

export const postCreateUser = async (user: User) => {
  return await axios.post(`${API}/api/v1/users`, user);
};

export const getUsers = async () => {
  return await axios.get(`${API}/api/v1/users`);
};

export const getUsersDeleted = async () => {
  return await axios.get(`${API}/api/v1/users/removes`);
};

export const deleteUser = async (id: string) => {
  return await axios.delete(`${API}/api/v1/users/${id}`);
};

export const restoreUser = async (id: string) => {
  return await axios.put(`${API}/api/v1/users/restore/${id}`);
};

export const updateUser = async (id: string, user: User) => {
  return await axios.put(`${API}/api/v1/users/${id}`, user);
};
