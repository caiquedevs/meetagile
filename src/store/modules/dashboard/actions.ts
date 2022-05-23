import types from '../types';

import { IAction } from '../../../interfaces/action';
import { IEmployee } from '../../../interfaces/employee';
import { IHindsight } from '../../../interfaces/hindsight';
import { IUser } from '../../../interfaces/user';
import { NavigateFunction } from 'react-router-dom';

export interface IDashboardSuccess {
  hindsights: IHindsight[];
  employees: IEmployee[];
  actions: IAction;
}

export interface IDashboardAdminSuccess {
  hindsights: IHindsight[];
  users: IUser[];
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

export function dashboardAdminRequest(payload: NavigateFunction) {
  return {
    type: types.DASHBOARD_ADMIN_REQUEST,
    payload,
  };
}

export function dashboardAdminSuccess(payload: IDashboardAdminSuccess) {
  return {
    type: types.DASHBOARD_ADMIN_SUCCESS,
    payload,
  };
}

export function dashboardAdminFailure() {
  return {
    type: types.DASHBOARD_ADMIN_FAILURE,
  };
}

export function dashboardAdminClear() {
  return {
    type: types.DASHBOARD_ADMIN_CLEAR,
  };
}

export function setHindsights(payload: IHindsight[]) {
  return {
    type: types.SET_HINDSIGHT,
    payload,
  };
}

export function setHindsightsAdmin(payload: IHindsight[]) {
  return {
    type: types.SET_HINDSIGHT_ADMIN,
    payload,
  };
}

export function setActions(payload: IAction) {
  return {
    type: types.SET_ACTIONS,
    payload,
  };
}

export function setActionsAdmin(payload: IAction[]) {
  return {
    type: types.SET_ACTIONS_ADMIN,
    payload,
  };
}

export function setUsers(payload: IUser[]) {
  return {
    type: types.SET_USERS,
    payload,
  };
}

export function setUsersAdmin(payload: IUser[]) {
  return {
    type: types.SET_USERS_ADMIN,
    payload,
  };
}

export function setEmployees(payload: IEmployee[]) {
  return {
    type: types.SET_EMPLOYEES,
    payload,
  };
}

export function setLoadingDashboard(payload: boolean) {
  return {
    type: types.SET_LOADING_DASHBOARD,
    payload,
  };
}
