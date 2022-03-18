import NavigationPage from '../pages/private/NavigationPage';
import NewHindsightPage from '../pages/private/NewHindsightPage';
import StepOne from '../pages/private/NewHindsightPage/StepOne';
import StepTwo from '../pages/private/NewHindsightPage/StepTwo';
import StepThree from '../pages/private/NewHindsightPage/StepThree';
import StepFinish from '../pages/private/NewHindsightPage/StepFinish';
import EmployeesPage from '../pages/private/EmployeesPage';

import IRoute from '../interfaces/route';

import { FiHome, FiPlusCircle, FiUsers } from 'react-icons/fi';

const routes: IRoute[] = [
  {
    icon: FiHome,
    path: '/navigation',
    name: 'navigation',
    isPrivate: true,
    component: NavigationPage,
  },
  {
    icon: FiPlusCircle,
    path: '/new-hindsight',
    name: 'newHindsight',
    isPrivate: true,
    component: NewHindsightPage,
    children: [
      {
        icon: null,
        path: 'step-one',
        name: 'stepOne',
        isPrivate: true,
        component: StepOne,
      },
      {
        icon: null,
        path: 'step-two',
        name: 'stepTwo',
        isPrivate: true,
        component: StepTwo,
      },
      {
        icon: null,
        path: 'step-three',
        name: 'stepThree',
        isPrivate: true,
        component: StepThree,
      },
      {
        icon: null,
        path: 'step-finish',
        name: 'stepFinish',
        isPrivate: true,
        component: StepFinish,
      },
    ],
  },
  {
    icon: FiUsers,
    path: '/employees',
    name: 'employees',
    isPrivate: true,
    component: EmployeesPage,
  },
];

export default routes;
