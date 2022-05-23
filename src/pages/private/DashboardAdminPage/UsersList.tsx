import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store/modules/rootReducer';
import { formatDistanceStrict } from 'date-fns';
import { pt } from 'date-fns/locale';
import { ShowIf } from '../../../components';
import * as actionsDashboard from '../../../store/modules/dashboard/actions';

import { IUser } from '../../../interfaces/user';

type PropsPage = {
  setTeamSelected: React.Dispatch<React.SetStateAction<IUser>>;
  teamSelected: IUser;
};

export default function UsersList({ teamSelected, setTeamSelected }: PropsPage) {
  const dispatch = useDispatch();

  const { users_admin, hindsights, loadingFetchDashboard } = useSelector(
    (state: IRootState) => state.dashboardReducer
  );

  const handleClickUser = (user: IUser) => {
    const filterHindsightsUser = hindsights.filter(
      (hindsight) => hindsight.user_id?._id === user?._id
    );

    setTeamSelected(user);

    dispatch(actionsDashboard.setHindsightsAdmin(filterHindsightsUser));
  };

  return (
    <section className="px-16 pt-3 pb-3 w-full flex flex-wrap gap-11 select-none ">
      <ShowIf condition={loadingFetchDashboard}>
        <SkeletonAdminCard />
      </ShowIf>

      {users_admin.map((user) => {
        if (user.type === 'admin') {
          return (
            <div className="admin-card-wrap min-w-245px h-44 rounded-xl">
              <div className="admin-card flex flex-col justify-between px-8 pt-7 pb-5 min-w-245px h-44  bg-white dark:bg-slate-800 rounded-xl">
                <header>
                  <small className="font-roboto text-sm text-gray-400 dark:text-slate-400 font-medium">
                    {formatDistanceStrict(new Date(user?.createdAt!), new Date(), {
                      locale: pt,
                    })}
                  </small>

                  <span className="font-roboto text-base text-gray-700 dark:text-white font-bold">
                    {user?.teamName}
                  </span>
                </header>

                <footer className="flex items-end gap-5">
                  <strong className="font-roboto text-base text-gray-700 dark:text-slate-400 font-bold after:content-[''] after:w-full after:h-1 after:flex after:bg-yellow-400">
                    Admin
                  </strong>
                </footer>
              </div>
            </div>
          );
        }
      })}

      <ShowIf condition={loadingFetchDashboard}>
        <SkeletonTeamCard />
      </ShowIf>

      {users_admin.map((user, index) => {
        const handleClick = () => handleClickUser(user);

        const isActive = teamSelected?._id === user?._id;

        if (user.type !== 'admin') {
          return (
            <div
              onClick={handleClick}
              className={`team-card ${
                isActive ? 'active' : ''
              } h-44 px-8 pt-7 pb-5 min-w-245px flex flex-col justify-between shadow-card dark:border-none bg-white dark:bg-slate-800 rounded-xl cursor-pointer`}
            >
              <header>
                <small className="font-roboto text-sm text-gray-400 dark:text-slate-400 font-medium">
                  {formatDistanceStrict(new Date(user?.createdAt!), new Date(), {
                    locale: pt,
                  })}
                </small>

                <span className="font-roboto text-base text-gray-700 dark:text-white font-bold">
                  {user.teamName}
                </span>
              </header>

              <footer className="flex items-end gap-4">
                <strong
                  className={`font-roboto text-6xl font-bold ${
                    isActive ? 'text-teal-500' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {user?.totalHindsights}
                </strong>

                <span className="pb-1 font-roboto text-sm text-slate-400 font-bold">
                  Retrospectivas
                </span>
              </footer>
            </div>
          );
        }
      })}
    </section>
  );
}

function SkeletonAdminCard() {
  return (
    <div className="admin-card-wrap min-w-245px h-44 rounded-xl">
      <div className="admin-card flex flex-col justify-between px-8 pt-7 pb-5 min-w-245px h-44 border-2 border-gray-default bg-white dark:bg-slate-800 rounded-xl">
        <header className="flex flex-col gap-1">
          <small className="w-14 h-4 flex bg-gray-300 dark:bg-slate-600 rounded animate-pulse-intense" />

          <span className="w-28 h-4 flex bg-gray-300 dark:bg-slate-600 rounded animate-pulse-intense" />
        </header>

        <footer className="flex flex-col items-start gap-1">
          <span className="w-16 h-4 flex bg-gray-300 dark:bg-slate-600 rounded animate-pulse-intense"></span>
          <span className="w-16 h-1 flex bg-gray-300 dark:bg-slate-600 rounded animate-pulse-intense" />
        </footer>
      </div>
    </div>
  );
}

function SkeletonTeamCard() {
  return (
    <div className="team-card h-44 px-8 pt-7 pb-5 min-w-245px flex flex-col justify-between  border-2 border-gray-default dark:border-none bg-white dark:bg-slate-800 rounded-xl cursor-pointer">
      <header className="flex flex-col gap-1">
        <small className="w-14 h-4 flex bg-gray-300 dark:bg-slate-600 rounded animate-pulse-intense" />

        <span className="w-28 h-4 flex bg-gray-300 dark:bg-slate-600 rounded animate-pulse-intense" />
      </header>

      <footer className="flex items-end gap-5">
        <span className="w-9 h-14 flex bg-gray-300 dark:bg-slate-600 rounded animate-pulse-intense" />

        <span className="w-28 h-4 flex bg-gray-300 dark:bg-slate-600 rounded animate-pulse-intense" />
      </footer>
    </div>
  );
}
