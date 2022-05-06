import { all } from 'redux-saga/effects';
import authSagas from './auth/sagas';
import dashBoardSagas from './dashboard/sagas';

export default function* rootSaga(): any {
  return yield all([authSagas, dashBoardSagas]);
}
