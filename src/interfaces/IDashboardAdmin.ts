import { IHindsight } from './hindsight';
import { IUser } from './user';

export interface IDashboardAdmin {
  hindsights: IHindsight[];
  users: IUser[];
}
