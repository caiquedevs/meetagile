import { IAction } from './action';
import { IHindsight } from './hindsight';

export interface IStepProps {
  state: {
    actions: IAction;
    hindsight: IHindsight;
    mode: 'create' | 'update' | 'view';
  };
}
