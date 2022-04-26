import { IEmployee } from './employee';

export interface StepProps {
  _id?: string;
  employeeName: string;
  description: string;
  votes: number;
}

export interface StepThreeProps {
  employee: IEmployee;
  votes: number;
  votedFor: string | null | undefined;
}

export interface IHindsight {
  _id: string;
  name: string;
  stepOne: StepProps[];
  stepTwo: StepProps[];
  stepThree: StepThreeProps[];
  winningEmployee: any;
  user_id: string;
  updatedAt: string;
  createdAt: string;
  __v: number;
}
