import axios from "axios";
import { API } from "../../consts/const";
import { getsesionLocal } from "../sesion/sesion";

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
}
