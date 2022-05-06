import types from '../types';

import { IAction } from '../../../interfaces/action';
import { IEmployee } from '../../../interfaces/employee';
import { IHindsight } from '../../../interfaces/hindsight';
import { toast } from 'react-toastify';

const initialState = {
  hindsights: [] as IHindsight[],
  employees: [] as IEmployee[],
  actions: {} as IAction,
  loadingFetchDashboard: false,
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

    case types.SET_HINDSIGHT: {
      const newState = { ...state };
      newState.hindsights = action.payload;
      return newState;
    }

    case types.SET_EMPLOYEES: {
      const newState = { ...state };
      newState.employees = action.payload;
      return newState;
    }

    case types.SET_ACTIONS: {
      const newState = { ...state };
      newState.actions = action.payload;
      return newState;
    }

    case types.DASHBOARD_CLEAR: {
      return initialState;
    }

    default: {
      return state;
    }
  }
}
