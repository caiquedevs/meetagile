import types from '../types';

import { IAction } from '../../../interfaces/action';
import { IEmployee } from '../../../interfaces/employee';
import { IHindsight } from '../../../interfaces/hindsight';

export interface IDashboardSuccess {
  hindsights: IHindsight[];
  employees: IEmployee[];
  actions: IAction;
}

export function dashboardRequest() {
  return { type: types.DASHBOARD_REQUEST };
}

export function dashboardSuccess(payload: IDashboardSuccess) {
  return {
    type: types.DASHBOARD_SUCCESS,
    payload,
  };
}

export function dashboardFailure() {
  return {
    type: types.DASHBOARD_FAILURE,
  };
}

export function dashboardClear() {
  return {
    type: types.DASHBOARD_CLEAR,
  };
}

export function setHindsights(payload: IHindsight[]) {
  return {
    type: types.SET_HINDSIGHT,
    payload,
  };
}

export function setEmployees(payload: IEmployee[]) {
  return {
    type: types.SET_EMPLOYEES,
    payload,
  };
}
export function setActions(payload: IAction) {
  return {
    type: types.SET_ACTIONS,
    payload,
  };
}
