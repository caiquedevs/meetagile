import DashboardPage from '../pages/private/DashboardPage';
import StepOne from '../pages/private/NewHindsight/StepOne';
import StepTwo from '../pages/private/NewHindsight/StepTwo';
import StepThree from '../pages/private/NewHindsight/StepThree';
import StepFinish from '../pages/private/NewHindsight/StepFinish';

import IRoute from '../interfaces/route';

import { ModalFormEmployee, ModalShowEmployee, ModalFormHindsight } from '../components';
import NewHindsight from '../pages/private/NewHindsight';

const routes: IRoute[] = [
  {
    icon: null,
    path: '/dashboard',
    name: 'dashboard',
    isPrivate: true,
    component: DashboardPage,
    children: [
      {
        icon: null,
        path: 'form-employee',
        name: 'formEmployee',
        isPrivate: true,
        component: ModalFormEmployee,
      },
      {
        icon: null,
        path: 'show-employee',
        name: 'showEmployee',
        isPrivate: true,
        component: ModalShowEmployee,
      },
      {
        icon: null,
        path: 'form-hindsight',
        name: 'formHindsight',
        isPrivate: true,
        component: ModalFormHindsight,
      },
    ],
  },
  {
    icon: null,
    path: '/new-hindsight',
    name: 'newHindsight',
    isPrivate: true,
    component: NewHindsight,
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
];

export default routes;
