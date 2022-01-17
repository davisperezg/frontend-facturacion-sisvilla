import axios from "axios";
import { Client } from "../../interface/Client";
import { API } from "../../lib/consts/const";

export const postCreateClient = async (client: Client) => {
  return await axios.post(`${API}/api/v1/clients`, client);
};

export const getClients = async () => {
  return await axios.get(`${API}/api/v1/clients`);
};

export const getClientDeleted = async () => {
  return await axios.get(`${API}/api/v1/clients/removes`);
};

export const deleteClient = async (id: string) => {
  return await axios.delete(`${API}/api/v1/clients/${id}`);
};

export const restoreClient = async (id: string) => {
  return await axios.put(`${API}/api/v1/clients/restore/${id}`);
};

export const updateClient = async (id: string, client: Client) => {
  return await axios.put(`${API}/api/v1/clients/${id}`, client);
};
