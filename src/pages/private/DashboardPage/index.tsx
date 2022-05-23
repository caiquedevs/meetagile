import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import * as actionsDashboard from '../../../store/modules/dashboard/actions';
import { useNavigate } from 'react-router-dom';

import { NavigationBar } from '../../../components';

import EmployeeList from './EmployeeList';
import HindsightList from './HindsightList';
import { IRootState } from '../../../store/modules/rootReducer';

export default function DashboardPage(props: any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state: IRootState) => state.authReducer);
  const { hindsights } = useSelector((state: IRootState) => state.dashboardReducer);

  useEffect(() => {
    if (user.type === 'admin') navigate('/dashboard-admin');

    if (user.type !== 'admin' && !Boolean(hindsights.length)) {
      dispatch(actionsDashboard.dashboardRequest());
    }

    return () => {};
  }, []);

  if (user.type === 'admin') return <></>;

  return (
    <main className="min-h-screen pb-16">
      <NavigationBar />

      <EmployeeList />
      <HindsightList />
      <Outlet />
    </main>
  );
}
