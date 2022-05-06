import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useDispatch } from 'react-redux';
import * as actionsAuth from '../store/modules/auth/actions';
import { api } from '../services/api';

export function useRequest() {
  const dispatch = useDispatch();

  const request = (options: Partial<AxiosRequestConfig>) => {
    const onSuccess = (response: AxiosResponse) => {
      console.debug('Request Successful!', response);
      return response.data;
    };

    const onError = (error: any) => {
      if (error.response.status === 401) {
        dispatch(actionsAuth.logoutRequest());
      }

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

  return request;
}
