import { IAction } from './action';
import { IHindsight } from './hindsight';

export interface INavigationStepProps {
  state: {
    name?: string;
    actions: IAction;
    hindsight: IHindsight;
    returnUrl?: string;
    mode: 'create' | 'update' | 'view';
  };
}
