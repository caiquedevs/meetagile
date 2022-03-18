import { useContext } from 'react';
import { EmployeeContext } from '../context/employeeContext';

export function useEmployees() {
  const { employees, setEmployees } = useContext(EmployeeContext);
  return { employees, setEmployees };
}
