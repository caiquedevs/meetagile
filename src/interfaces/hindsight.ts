import { IEmployee } from './employee';

export interface StepProps {
  _id?: string;
  employeeName: string;
  description: string;
  votes: number;
}

export interface HindsightProps {
  _id: string;
  name: string;
  stepOne: StepProps[];
  stepTwo: StepProps[];
  employee: IEmployee;
  user: string;
  updatedAt: string;
  createdAt: string;
  __v: number;
}
