import DashboardPage from '../pages/private/DashboardPage';
import StepOne from '../pages/private/NewHindsight/StepOne';
import StepTwo from '../pages/private/NewHindsight/StepTwo';
import StepThree from '../pages/private/NewHindsight/StepThree';
import StepFinish from '../pages/private/NewHindsight/StepFinish';

import IRoute from '../interfaces/route';

const routes: IRoute[] = [
  {
    icon: null,
    path: '/dashboard',
    name: 'dashboard',
    isPrivate: true,
    component: DashboardPage,
  },
  {
    icon: null,
    path: '/new-hindsight/step-one',
    name: 'stepOne',
    isPrivate: true,
    component: StepOne,
  },
  {
    icon: null,
    path: '/new-hindsight/step-two',
    name: 'stepTwo',
    isPrivate: true,
    component: StepTwo,
  },
  {
    icon: null,
    path: '/new-hindsight/step-three',
    name: 'stepThree',
    isPrivate: true,
    component: StepThree,
  },
  {
    icon: null,
    path: '/new-hindsight/step-finish',
    name: 'stepFinish',
    isPrivate: true,
    component: StepFinish,
  },
];

export const pathsForNavigationBar = routes
  .filter((route) => route.icon)
  .map((route) => route.path);

export default routes;
