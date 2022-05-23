import types from '../types';

import { IAction } from '../../../interfaces/action';
import { IEmployee } from '../../../interfaces/employee';
import { IHindsight } from '../../../interfaces/hindsight';
import { IUser } from '../../../interfaces/user';

const initialState = {
  hindsights: [] as IHindsight[],
  hindsightsAdmin: [] as IHindsight[],

  actions: {} as IAction,
  actionsAdmin: [] as IAction[],

  users: [] as IUser[],
  users_admin: [] as IUser[],

  employees: [] as IEmployee[],
  loadingFetchDashboard: true,
};

export default function Reducer(state = initialState, action: any) {
  switch (action.type) {
    case types.DASHBOARD_REQUEST: {
      const newState = { ...state };

      newState.loadingFetchDashboard = true;

      return newState;
    }

    case types.DASHBOARD_SUCCESS: {
      const newState = { ...initialState };

      newState.hindsights = action.payload.hindsights.reverse();
      newState.employees = action.payload.employees;
      newState.actions = action.payload.actions;
      newState.loadingFetchDashboard = false;

      return newState;
    }

    case types.DASHBOARD_FAILURE: {
      return initialState;
    }

    case types.DASHBOARD_ADMIN_REQUEST: {
      const newState = { ...state };
      newState.loadingFetchDashboard = true;
      return newState;
    }

    case types.DASHBOARD_ADMIN_SUCCESS: {
      const newState = { ...initialState };

      newState.hindsights = action.payload.hindsights.reverse();
      newState.hindsightsAdmin = action.payload.hindsights.slice(0, 5);

      newState.users = action.payload.users;
      newState.users_admin = action.payload.users;

      newState.actionsAdmin = action.payload.actions;
      newState.loadingFetchDashboard = false;

      return newState;
    }

    case types.DASHBOARD_ADMIN_FAILURE: {
      return initialState;
    }

    case types.SET_HINDSIGHT: {
      const newState = { ...state };
      newState.hindsights = action.payload;
      return newState;
    }

    case types.SET_HINDSIGHT_ADMIN: {
      const newState = { ...state };
      newState.hindsightsAdmin = action.payload;
      return newState;
    }

    case types.SET_ACTIONS: {
      const newState = { ...state };
      newState.actions = action.payload;
      return newState;
    }

    case types.SET_ACTIONS_ADMIN: {
      const newState = { ...state };
      newState.actionsAdmin = action.payload;
      return newState;
    }

    case types.SET_USERS: {
      const newState = { ...state };
      newState.users = action.payload;
      return newState;
    }

    case types.SET_USERS_ADMIN: {
      const newState = { ...state };
      newState.users_admin = action.payload;
      return newState;
    }

    case types.SET_EMPLOYEES: {
      const newState = { ...state };
      newState.employees = action.payload;
      return newState;
    }

    case types.SET_LOADING_DASHBOARD: {
      const newState = { ...state };
      newState.loadingFetchDashboard = action.payload;
      return newState;
    }

    case types.DASHBOARD_CLEAR: {
      return initialState;
    }

    case types.DASHBOARD_ADMIN_CLEAR: {
      return initialState;
    }

    default: {
      return state;
    }
  }
}
