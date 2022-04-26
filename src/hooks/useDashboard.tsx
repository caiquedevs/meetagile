import { useContext } from 'react';
import { DashboardContext } from '../context/dashboardContext';

export function useDashboard() {
  const { data, setData, loadingFetch } = useContext(DashboardContext);
  return { data, setData, loadingFetch };
}
