import types from '../types';
import { IUser } from '../../../interfaces/user';
import { Dispatch, SetStateAction } from 'react';
import { NavigateFunction } from 'react-router-dom';

export interface IRegisterRequest {
  navigate: NavigateFunction;
  data: { teamName: string; email: string; password: string; cpfCnpj: string };
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export interface IRegisterSucess {
  token: string;
  user: IUser;
}

export interface ILoginRequest {
  navigate: NavigateFunction;
  data: { email: string; password: string };
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export interface ILoginSucess {
  token: string;
  user: IUser;
}

export function registerRequest(payload: IRegisterRequest) {
  return {
    type: types.REGISTER_REQUEST,
    payload,
  };
}

export function registerSuccess(payload: IRegisterSucess) {
  return {
    type: types.REGISTER_SUCCESS,
    payload,
  };
}

export function registerFailure() {
  return { type: types.REGISTER_FAILURE };
}

export function loginRequest(payload: ILoginRequest) {
  return {
    type: types.LOGIN_REQUEST,
    payload,
  };
}

export function loginSuccess(payload: ILoginSucess) {
  return {
    type: types.LOGIN_SUCCESS,
    payload,
  };
}

export function loginFailure() {
  return { type: types.LOGIN_FAILURE };
}

export function logoutRequest() {
  return { type: types.LOGOUT_REQUEST };
}
