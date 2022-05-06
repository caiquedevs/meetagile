import { call, put, all, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import types from '../types';
import * as actions from './actions';
import { api } from '../../../services/api';

function* dashboardRequestSagas(): any {
  try {
    const response = yield call(api.get, '/hindsights');
    yield put(actions.dashboardSuccess(response.data));
  } catch (error: any) {
    toast.error(error.response.data.msg);
    yield put(actions.dashboardFailure());
  }
}

export default all([takeLatest(types.DASHBOARD_REQUEST, dashboardRequestSagas)]);
