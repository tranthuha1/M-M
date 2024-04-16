import axios, { AxiosInstance } from 'axios';
// eslint-disable-next-line import/no-cycle
import router from '@/router';
import { useUserSession } from './userSession';

let api: AxiosInstance;

export function createApi() {
  // Here we set the base URL for all requests made to the api
  api = axios.create({
    baseURL: process.env.VUE_APP_BASE_API_URL,
  });
  // We set an interceptor for each request to
  // include Bearer token to the request if user is logged in
  api.interceptors.request.use((config: any) => {
    const userSession = useUserSession();
    if (userSession.isLoggedIn) {
      // eslint-disable-next-line no-param-reassign
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${userSession.token}`,
        AppId: process.env.VUE_APP_BASE_APP_ID,
      };
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if ((error.response.status === 401 || error.response.status === 403)) {
        const userSession = useUserSession();
        userSession.logoutUser();
        router.push({
          name: 'login',
        });
      }
      return Promise.reject(error);
    },
  );

  return api;
}

export function useApi() {
  if (!api) {
    createApi();
  }
  return api;
}
