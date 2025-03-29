import { refreshMyToken } from "../utils/auth";
import axios, { AxiosError } from "axios";

const serverUrl = import.meta.env.VITE_SERVER_URL;
const baseUrl = `${serverUrl}/api`;

// custom property to avoid calling loop
// in response interceptor
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

export const axiosBaseInstance = axios.create({
  baseURL: baseUrl,
});

const axiosSecureInstance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

axiosSecureInstance.interceptors.request.use(
  function (request) {
    // accessToken is send on purpose with request pipe
    // to avoid using extra useEffect hook call
    // imho this is faster and cleaner...
    const accessToken: string | undefined = request.data.accessToken;

    if (!request.headers["Authorization"] && accessToken) {
      request.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    // delete before request hit api endpoint
    if (accessToken) {
      delete request.data["accessToken"];
    }

    return request;
  },
  function (error) {
    Promise.reject(error);
  }
);

axiosSecureInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error: AxiosError) {
    const requestConfig = error.config;
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      requestConfig &&
      !requestConfig._retry
    ) {
      requestConfig._retry = true;

      const newAccessToken = await refreshMyToken();

      if (!newAccessToken) {
        return Promise.reject(error);
      }

      requestConfig.headers["Authorization"] = `Bearer ${newAccessToken}`;

      // axios will now repeat request with new access token
      return axiosSecureInstance(requestConfig);
    }

    return Promise.reject(error);
  }
);

export default axiosSecureInstance;
