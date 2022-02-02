import axios from "axios";

export const getServiceData = (type: string, value: string) => {
  return axios.get(`http://localhost:3001/api/v1/${type}?numero=${value}`, {
    headers: {
      Authorization: `Bearer apis-token-1541.jEQrwuQ-d3dwGzF4B627X15xuNEN2mio`,
    },
  });
};
