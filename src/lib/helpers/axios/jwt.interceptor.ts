import axios from "axios";
import { getRefresh } from "../../../api/auth/auth";
import { API } from "../../consts/const";
import {
  deleteSesions,
  getsesionLocal,
  setsesionLocal,
} from "../sesion/sesion";

export function jwtInterceptor() {
  axios.interceptors.request.use((request) => {
    // add auth header with jwt if account is logged in and request is to the api url
    const isLoggedIn = getsesionLocal("token");
    const isApiUrl = request.url?.startsWith(String(API));

    if (isLoggedIn && isApiUrl) {
      request.headers!["Authorization"] = `Bearer ${isLoggedIn}`;
    }

    return request;
  });

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error) {
      const originalRequest = error.config;
      if (
        error.response.status === 401 &&
        originalRequest.url === `${API}/api/v1/auth/token`
      ) {
        return Promise.reject(error);
      }

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const { username } = JSON.parse(String(localStorage.getItem("user")));
          const refreshToken = getsesionLocal("refresh");
          const resToken: any = await getRefresh(
            String(username),
            String(refreshToken)
          );

          if (resToken.status === 201) {
            setsesionLocal("token", resToken.data.access_token);
            const token = getsesionLocal("token");
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
            return axios(originalRequest);
          }
        } catch (e) {
          window.location.href = "/login";
          deleteSesions();
        }
      }

      return Promise.reject(error);
    }
  );
}
