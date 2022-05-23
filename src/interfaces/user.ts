export interface IUser {
  _id: string;
  teamName: string;
  email: string;
  type?: 'admin' | 'team';
  password?: string;
  cpfCnpj: string;
  createdAt: string;
  updatedAt: string;
  totalHindsights?: number;
  __v: number;
}
