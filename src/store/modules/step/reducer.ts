import types from '../types';
import { api } from '../../../services/api';
import { IHindsight } from '../../../interfaces/hindsight';
import { IEmployee } from '../../../interfaces/employee';
import { IAction } from '../../../interfaces/action';

const initialState = {
  hindsightsPending: [] as IHindsight[],
  currentHindsight: {} as IHindsight,
  currentActions: {} as IAction,
};

export default function Reducer(state = initialState, action: any) {
  switch (action.type) {
    case types.SET_HINDSIGHTS_PENDING: {
      const newState = { ...state };
      newState.hindsightsPending = action.payload || [];
      return newState;
    }

    case types.REMOVE_HINDSIGHT_PENDING: {
      const newState = { ...state };

      const copyHindsightsPending = newState.hindsightsPending.filter(
        (hindsight) => hindsight._id !== action.payload
      );

      newState.hindsightsPending = copyHindsightsPending;
      return newState;
    }

    case types.SET_CURRENT_HINDSIGHT: {
      const newState = { ...state };
      newState.currentHindsight = action.payload;
      return newState;
    }

    case types.REMOVE_CURRENT_HINDSIGHT: {
      const newState = { ...state };
      newState.currentHindsight = {} as IHindsight;
      return newState;
    }

    case types.SET_CURRENT_ACTIONS: {
      const newState = { ...state };
      newState.currentActions = action.payload;
      return newState;
    }

    case types.STEP_CLEAR: {
      return initialState;
    }

    case types.SET_TIMER: {
      const newState = { ...state };

      const copyHindsightsPending = newState.hindsightsPending.map((hindsight) => {
        if (hindsight._id === newState.currentHindsight._id) {
          hindsight.timer = action.payload;
        }

        return hindsight;
      });

      newState.hindsightsPending = copyHindsightsPending;
      newState.currentHindsight.timer = action.payload;
      return newState;
    }

    default: {
      return state;
    }
  }
}
