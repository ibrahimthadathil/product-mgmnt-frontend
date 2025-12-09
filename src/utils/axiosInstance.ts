import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});


instance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const session = await getSession();    
    const token = (session?.user as { token?: string })?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// instance.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as InternalAxiosRequestConfig & {
//       _retry?: boolean;
//     };

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             if (originalRequest.headers) {
//               originalRequest.headers.Authorization = `Bearer ${token}`;
//             }
//             return instance(originalRequest);
//           })
//           .catch((err) => {
//             return Promise.reject(err);
//           });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const refreshResponse = await axios.post(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
//           {},
//           {
//             withCredentials: true,
//           }
//         );

//         const { accessToken } = refreshResponse.data;

//         if (accessToken) {
//           const session = await getSession();
//           if (session) {
//             processQueue(null, accessToken);

//             if (originalRequest.headers) {
//               originalRequest.headers.Authorization = `Bearer ${accessToken}`;
//             }

//             isRefreshing = false;
//             return instance(originalRequest);
//           }
//         }
//       } catch (refreshError) {
//         processQueue(refreshError as AxiosError, null);
//         isRefreshing = false;

//         if (typeof window !== "undefined") {
//           window.location.href = "/login";
//         }
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default instance;
