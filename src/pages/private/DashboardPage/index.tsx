import { Outlet } from 'react-router-dom';

import { NavigationBar } from '../../../components';

import DashboardProvider from '../../../context/dashboardContext';

import EmployeeList from './EmployeeList';
import HindsightList from './HindsightList';

import 'swiper/css';
import 'swiper/css/pagination';

export default function DashboardPage() {
  return (
    <main className="pb-16">
      <NavigationBar />

      <DashboardProvider>
        <EmployeeList />
        <HindsightList />
        <Outlet />
      </DashboardProvider>
    </main>
  );
}
