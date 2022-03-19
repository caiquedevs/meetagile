import { IEmployee } from './employee';

export interface StepProps {
  _id?: string;
  employeeName: string;
  description: string;
  votes: number;
}

export interface IHindsight {
  _id: string;
  name: string;
  stepOne: StepProps[];
  stepTwo: StepProps[];
  employee_id: IEmployee;
  user_id: string;
  updatedAt: string;
  createdAt: string;
  __v: number;
}
