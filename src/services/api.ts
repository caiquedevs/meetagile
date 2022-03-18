// tslint:disable:no-console
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { redirect401 } from '../utils/redirect401';

export const api: any = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});

api.interceptors.request.use(
  (config: any) => {
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

const request = (options: Partial<AxiosRequestConfig>) => {
  const onSuccess = (response: AxiosResponse) => {
    console.debug('Request Successful!', response);
    return response.data;
  };

  const onError = (error: any) => {
    redirect401(error.response.status);

    console.error('Request Failed HERE:', error.config);

    if (error.response) {
      // Requisição aconteceu mas o servidor respondeu com algo diferente de status code 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else {
      // Aconteceu algum erro inesperado quando tentava montar a requisição
      console.error('Error Message:', error.message);
    }
    return Promise.reject(error.response || error.message);
  };
  
  return api(options).then(onSuccess).catch(onError);
};

export default request;
