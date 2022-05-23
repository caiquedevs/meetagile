import types from '../types';
import { IHindsight } from '../../../interfaces/hindsight';
import { IAction } from '../../../interfaces/action';

export function setHindsightsPending(payload: IHindsight[]) {
  return {
    type: types.SET_HINDSIGHTS_PENDING,
    payload,
  };
}

export function removeHindsightPending(payload: string) {
  return {
    type: types.REMOVE_HINDSIGHT_PENDING,
    payload,
  };
}

export function setCurrentHindsight(payload: IHindsight) {
  return {
    type: types.SET_CURRENT_HINDSIGHT,
    payload,
  };
}

export function removeCurrentHindsight() {
  return {
    type: types.REMOVE_CURRENT_HINDSIGHT,
  };
}

export function setCurrentActions(payload: IAction) {
  return {
    type: types.SET_CURRENT_ACTIONS,
    payload,
  };
}

export function stepClear() {
  return {
    type: types.STEP_CLEAR,
  };
}

export function setTimer(payload: { hours: number; minutes: number; seconds: number }) {
  return {
    type: types.SET_TIMER,
    payload,
  };
}
