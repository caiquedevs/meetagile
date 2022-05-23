import { IUser } from './user';

export interface IAction {
  _id?: string;
  user_id?: string;
  createdAt?: string;
  updatedAt?: string;
  data: { name: string; status: string }[];
  __v?: number;
}
