import { IAction } from './action';
import { IHindsight } from './hindsight';

export interface INavigationStepProps {
  state: {
    name?: string;
    actions: IAction;
    hindsight: IHindsight;
    mode: 'create' | 'update' | 'view';
  };
}
