import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { get } from 'lodash';
import { api } from '../../../services/api';
import * as actions from './actions';
import types from '../types';
import { Action } from 'redux';

interface ILoginRequestSagas extends Action {
  payload: actions.ILoginRequest;
}

interface IRegisterRequestSagas extends Action {
  payload: actions.IRegisterRequest;
}

function* registerRequestSagas({ payload }: IRegisterRequestSagas): any {
  const { navigate, data, setLoading } = payload;

  setLoading(true);

  try {
    const response = yield call(api.post, '/user/register', data);
    yield put(actions.loginSuccess(response.data));

    api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
    navigate('/register/success', { state: true });
  } catch (error: any) {
    toast.warn(error?.response?.data?.msg!);
    yield put(actions.loginFailure());
  } finally {
    setLoading(false);
  }
}

function* loginRequestSagas({ payload }: ILoginRequestSagas): any {
  const { navigate, data, setLoading } = payload;

  setLoading(true);

  try {
    const response = yield call(api.post, '/user/login', data);
    yield put(actions.loginSuccess(response.data));

    api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
    navigate('/dashboard');

    toast.success('Seja bem vindo!', { toastId: 'wellcome' });
  } catch (error: any) {
    toast.warn(error.response.data.msg);
    yield put(actions.loginFailure());
  } finally {
    setLoading(false);
  }
}

function persistRehydrate({ payload }: any) {
  const token = get(payload, 'authReducer.token', '');
  if (!token) return;
  api.defaults.headers.Authorization = `Bearer ${token}`;
}

export default all([
  takeLatest(types.REGISTER_REQUEST, registerRequestSagas),
  takeLatest(types.LOGIN_REQUEST, loginRequestSagas),
  takeLatest(types.PERSIST_REHYDRATE, persistRehydrate),
]);
