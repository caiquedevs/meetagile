import types from '../types';

const initialState = {
  theme: 'light',
};

export default function Reducer(state = initialState, action: any) {
  switch (action.type) {
    case types.TOOGLE_THEME: {
      const newState = { ...state };
      const theme = newState.theme === 'light' ? 'dark' : 'light';
      newState.theme = theme;
      console.log('newState', newState);
      return newState;
    }

    default: {
      return state;
    }
  }
}
