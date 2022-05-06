import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import * as actionsDashboard from '../../../store/modules/dashboard/actions';

import { NavigationBar } from '../../../components';

import EmployeeList from './EmployeeList';
import HindsightList from './HindsightList';
import { IRootState } from '../../../store/modules/rootReducer';

export default function DashboardPage(props: any) {
  const dispatch = useDispatch();

  const { hindsights } = useSelector((state: IRootState) => state.dashboardReducer);

  useEffect(() => {
    if (!Boolean(hindsights.length)) {
      dispatch(actionsDashboard.dashboardRequest());
    }
  }, []);

  return (
    <main className="min-h-screen pb-16">
      <NavigationBar />

      <EmployeeList />
      <HindsightList />
      <Outlet />
    </main>
  );
}
