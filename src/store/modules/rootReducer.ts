import { combineReducers } from 'redux';

import authReducer from './auth/reducer';
import dashboardReducer from './dashboard/reducer';
import stepReducer from './step/reducer';
import themeReducer from './theme/reducer';

const rootReducer = combineReducers({
  authReducer,
  dashboardReducer,
  stepReducer,
  themeReducer,
});

export type IRootState = ReturnType<typeof rootReducer>;

export default rootReducer;
