import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { IAction } from '../../../interfaces/action';
import { IEmployee } from '../../../interfaces/employee';
import { IHindsight } from '../../../interfaces/hindsight';

import './styles.css';

export interface PropsNavigate {
  state: {
    hindsight: IHindsight;
    employees: IEmployee[];
    actions: IAction;
    hindMode: 'create' | 'edit' | 'view';
  };
}

function NewHindsightPages() {
  const whiteList = ['/new-hindsight', '/new-hindsight/'];
  const navigate = useNavigate();

  useEffect(() => {
    if (
      location.pathname === '/new-hindsight' ||
      location.pathname === '/new-hindsight/'
    ) {
      navigate('/dashboard');
    }

    return () => {};
  }, []);

  if (location.pathname === '/new-hindsight' || location.pathname === '/new-hindsight/') {
    return null;
  }

  return <Outlet />;
}

export default NewHindsightPages;
