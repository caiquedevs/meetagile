import { useEffect } from 'react';
import { ReactNode, useState, createContext, Dispatch } from 'react';
import { IEmployee } from '../interfaces/employee';
import { UserProps } from '../interfaces/user';
import { api } from '../services/api';

interface EmployeePropsContext {
  employees: IEmployee[];
  setEmployees: Dispatch<React.SetStateAction<IEmployee[]>>;
}

const DEFAULT_VALUE: EmployeePropsContext = {
  employees: [],
  setEmployees: () => {},
};

export const EmployeeContext = createContext(DEFAULT_VALUE);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [employees, setEmployees] = useState<IEmployee[]>([]);

  return (
    <EmployeeContext.Provider value={{ employees, setEmployees }}>
      {children}
    </EmployeeContext.Provider>
  );
}
