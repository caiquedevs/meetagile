import { IEmployee } from './employee';
import { IUser } from './user';

export interface StepProps {
  _id?: string;
  employeeName: string;
  description: string;
  votes: number;
  type?: string | undefined;
}

export interface IStepThree extends IEmployee {
  votedFor: IStepThree | null | undefined;
  votes: number;
}

export interface IHindsight {
  _id?: string;
  name: string;
  timer: { hours: number; minutes: number; seconds: number };
  stepOne: StepProps[];
  stepTwo: StepProps[];
  stepThree: IStepThree[];
  winningEmployee?: any;
  user_id?: IUser;
  updatedAt?: string;
  createdAt?: string;
  __v?: number;
}
