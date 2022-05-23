import { useEffect, useState } from 'react';
import { NavigationBar } from '../../../components';

import { useDispatch, useSelector } from 'react-redux';
import * as actionsDashboard from '../../../store/modules/dashboard/actions';
import * as actionsAuth from '../../../store/modules/auth/actions';

import RecentsHindsightList from './RecentsHindsightList';
import UsersList from './UsersList';
import { IRootState } from '../../../store/modules/rootReducer';
import { useNavigate } from 'react-router-dom';

import { IUser } from '../../../interfaces/user';
import { toast } from 'react-toastify';

const initalCategory = { all: '', amount: '', admins: '' };

export default function DashboardAdmin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state: IRootState) => state.authReducer);
  const { hindsights, users } = useSelector(
    (state: IRootState) => state.dashboardReducer
  );

  const [category, setCategory] = useState({ ...initalCategory, all: 'active' });
  const [teamSelected, setTeamSelected] = useState({} as IUser);

  const onAllFilter = () => {
    dispatch(actionsDashboard.setUsersAdmin(users));
  };

  const onAmountFilter = () => {
    const admins = users.filter((user) => user.type !== 'admin');
    const filtered = admins.sort((a, b) => b?.totalHindsights! - a?.totalHindsights!);

    dispatch(actionsDashboard.setUsersAdmin(filtered));
  };

  const onAdminFilter = () => {
    const admins = users.filter((user) => user.type === 'admin');
    dispatch(actionsDashboard.setUsersAdmin(admins));
  };

  const handleClickLi = (event: any) => {
    setCategory({ ...initalCategory, [event.target.id]: 'active' });

    switch (event.target.id) {
      case 'all':
        onAllFilter();
        break;

      case 'amount':
        onAmountFilter();
        break;

      case 'admins':
        onAdminFilter();
        break;

      default:
        toast.warn('Filtro inválido');
    }
  };

  useEffect(() => {
    if (user.type !== 'admin') navigate('/dashboard');

    if (user.type === 'admin' && !Boolean(hindsights.length)) {
      dispatch(actionsDashboard.dashboardAdminRequest(navigate));
    }

    return () => {};
  }, []);

  if (user.type !== 'admin') return <></>;

  return (
    <main className="min-h-screen pb-16">
      <NavigationBar />

      <section className="px-16 pt-10 pb-3 flex gap-20">
        <h2 className="font-medium font-roboto text-base text-slate-600 dark:text-white">
          Usuários / Times
        </h2>

        <ul className="flex items-center gap-20 text-gray-400 dark:text-slate-400 users-filter-nav text-base select-none">
          <li id="all" onClick={handleClickLi} className={category.all}>
            Todos
          </li>
          <li id="amount" onClick={handleClickLi} className={category.amount}>
            Quantidade
          </li>
          <li id="admins" onClick={handleClickLi} className={category.admins}>
            Admins
          </li>
        </ul>
      </section>

      <UsersList teamSelected={teamSelected} setTeamSelected={setTeamSelected} />
      <RecentsHindsightList teamSelected={teamSelected} />
    </main>
  );
}
