import { call, put, all, takeLatest } from 'redux-saga/effects';

import { toast } from 'react-toastify';

import types from '../types';
import * as actions from './actions';
import * as actionsAuth from '../auth/actions';

import { api } from '../../../services/api';

function* dashboardRequestSagas(): any {
  try {
    const response = yield call(api.get, '/hindsights');
    yield put(actions.dashboardSuccess(response.data));
  } catch (error: any) {
    if (error.response.status === 401) {
      yield put(actionsAuth.logoutRequest());
    }
    
    toast.error(error.response.data.msg);
    yield put(actions.dashboardFailure());
  }
}

function* dashboardAdminRequestSagas({ payload }: any): any {
  try {
    const response = yield call(api.get, '/admin/hindsights');
    yield put(actions.dashboardAdminSuccess(response.data));
  } catch (error: any) {
    if (error.response.status === 401) {
      yield put(actionsAuth.logoutRequest());
    }

    toast.error(error.response.data.msg);
    yield put(actions.dashboardAdminFailure());
  }
}

export default all([
  takeLatest(types.DASHBOARD_REQUEST, dashboardRequestSagas),
  takeLatest(types.DASHBOARD_ADMIN_REQUEST, dashboardAdminRequestSagas),
]);
