import { IUser } from '../../../interfaces/user';
import { api } from '../../../services/api';
import types from '../types';

const initialState = {
  user: {} as IUser,
  token: false,
  isLoggedIn: false,
};

export default function Reducer(state = initialState, action: any) {
  switch (action.type) {
    case types.LOGIN_SUCCESS: {
      const newState = { ...state };

      newState.token = action.payload.token;
      newState.user = action.payload.currentUser;
      newState.isLoggedIn = true;

      return newState;
    }

    case types.LOGIN_FAILURE: {
      const newState = { ...initialState };
      return newState;
    }

    case types.LOGOUT_REQUEST: {
      api.defaults.headers.Authorization = '';
      return initialState;
    }

    default: {
      return state;
    }
  }
}
