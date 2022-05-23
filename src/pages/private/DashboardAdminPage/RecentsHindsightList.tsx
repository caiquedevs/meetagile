import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, formatDistanceStrict } from 'date-fns';
import { pt } from 'date-fns/locale';
import { toast } from 'react-toastify';

import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store/modules/rootReducer';
import * as actionsDashboard from '../../../store/modules/dashboard/actions';
import * as actionsStep from '../../../store/modules/step/actions';

import { FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';
import { HiDocumentReport } from 'react-icons/hi';
import { GoPrimitiveDot } from 'react-icons/go';

import { useRequest } from '../../../hooks/useRequest';
import { IHindsight } from '../../../interfaces/hindsight';

import { ShowIf, ConfirmModal } from '../../../components';
import { ModalInterface } from '../../../components/Modal';
import { IUser } from '../../../interfaces/user';

interface PropsPage {
  teamSelected: IUser;
}

export default function ListHindsights({ teamSelected }: PropsPage) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const request = useRequest();

  const { hindsightsAdmin, loadingFetchDashboard, actionsAdmin } = useSelector(
    (state: IRootState) => state.dashboardReducer
  );

  const modalConfirmRef = useRef<ModalInterface>();
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleClickReport = (hindsight: IHindsight) => {
    const filterActionsUser = actionsAdmin.filter(
      (actions) => actions?.user_id === hindsight.user_id?._id
    );

    dispatch(actionsStep.setCurrentHindsight(hindsight));
    dispatch(actionsStep.setCurrentActions(filterActionsUser[0]));

    navigate('/new-hindsight/step-one', {
      state: { mode: 'view', returnUrl: '/dashboard-admin' },
    });
  };

  const onDeleteHindsight = () => {
    const selectedHindsight: IHindsight = modalConfirmRef.current?.payload;

    setLoadingDelete(true);

    request({ method: 'DELETE', url: `/hindsight/${selectedHindsight._id}` })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess() {
      const hindsightsFilter = hindsightsAdmin.filter(
        (hindsightsAdmin) => hindsightsAdmin._id !== selectedHindsight._id
      );

      dispatch(actionsDashboard.setHindsights(hindsightsFilter));
      dispatch(actionsStep.removeHindsightPending(selectedHindsight?._id!));

      modalConfirmRef.current?.closeModalSimple();
      toast.success('Retrospectiva removida com sucesso!', {
        toastId: 'removeHindsight',
      });
    }

    function onError(error: any) {
      toast.error(error.data.msg);
    }

    function onFinally() {
      setLoadingDelete(false);
    }
  };

  return (
    <section className="px-16">
      <div className="pt-6 pb-5">
        <h2 className="flex items-center gap-1 font-medium font-roboto text-base text-slate-600 dark:text-white">
          {teamSelected?.teamName ? (
            <span className="flex gap-1">
              Retrospectivas recentes do time:
              <strong className="text-teal-500 capitalize">
                {teamSelected?.teamName}
              </strong>
            </span>
          ) : (
            'Retrospectivas recentes'
          )}
        </h2>
      </div>

      <ul className="w-full flex flex-col gap-4">
        <ShowIf condition={loadingFetchDashboard}>
          <SkeletonHindsight />
          <SkeletonHindsight />
        </ShowIf>

        <ShowIf condition={!loadingFetchDashboard && hindsightsAdmin?.length === 0}>
          <HindshgtDefault />
        </ShowIf>

        {hindsightsAdmin?.map((hindsight) => {
          const onClickReport = () => handleClickReport(hindsight);

          const hours = hindsight?.timer?.hours || 0;
          const minutes = hindsight?.timer?.minutes || 0;
          const seconds = hindsight?.timer?.seconds || 0;

          const formatedHours = format(
            new Date(0, 0, 0, hours, minutes, seconds),
            "HH'h e 'mm' Minutos'",
            { locale: pt }
          );

          const formatedMinutes = `${minutes} Minutos`;
          const formatedSeconds = `${seconds} Segundos`;

          const timer = hours
            ? formatedHours
            : minutes
            ? formatedMinutes
            : formatedSeconds;

          return (
            <li
              key={hindsight._id}
              className="pl-14 pr-9 py-6 flex bg-white dark:bg-slate-800 shadow-card rounded-md"
            >
              <div className="flex flex-col flex-1">
                <span className="flex items-center gap-1 font-roboto text-lg font-bold text-slate-450 text-slate-600 dark:text-white">
                  Time
                </span>
                <span className="flex items-center gap-2 font-roboto text-base font-medium text-slate-400 dark:text-white/60">
                  {hindsight.user_id?.teamName}
                </span>
              </div>

              <div className="flex-1">
                <span className="font-roboto text-lg font-bold text-slate-600 dark:text-white">
                  {hindsight.name}
                </span>

                {hindsight.winningEmployee?.name ? (
                  <span className="flex items-center font-roboto text-base font-medium text-teal-500">
                    <GoPrimitiveDot />
                    Finalizado
                  </span>
                ) : (
                  <span className="flex items-center font-roboto text-base font-medium text-yellow-500">
                    <GoPrimitiveDot />
                    Pendente
                  </span>
                )}
              </div>

              <div className="flex-1">
                <span className="flex items-center gap-1 font-roboto text-lg font-bold text-slate-600 dark:text-white">
                  <FaRegCalendarAlt className="text-base text-black dark:text-white" />
                  {formatDistanceStrict(new Date(hindsight?.createdAt!), new Date(), {
                    locale: pt,
                  })}
                  {' atrás'}
                </span>

                <span className="flex items-center gap-2 font-roboto text-base font-medium text-slate-400 dark:text-white/60">
                  <FaRegClock className="text-base text-black dark:text-white" />
                  {hindsight?.winningEmployee && hindsight?.timer ? (
                    timer
                  ) : (
                    <span className="text-yellow-500">-</span>
                  )}
                </span>
              </div>

              <div className="lg:flex items-center flex-1 gap-5 hidden">
                <figure className="flex flex-col items-center gap-3">
                  <ShowIf condition={hindsight?.winningEmployee?.url}>
                    <div>
                      <img
                        src={hindsight?.winningEmployee?.url}
                        alt="user image"
                        className="w-11 h-11 object-cover rounded-full"
                      />
                    </div>
                  </ShowIf>

                  <ShowIf condition={!hindsight?.winningEmployee?.url}>
                    <div className="avatar placeholder">
                      <div className="w-11 h-11 text-white flex items-center justify-center rounded-full bg-slate-400">
                        <span className="text-2xl font-roboto font-medium uppercase">
                          {hindsight?.winningEmployee?.name
                            ? hindsight.winningEmployee.name[0]
                            : '?'}
                        </span>
                      </div>
                    </div>
                  </ShowIf>
                </figure>

                <div className="flex flex-col">
                  <span className="flex items-center gap-1 font-roboto text-lg font-bold text-slate-600 dark:text-white">
                    Destaque da Sprint
                  </span>
                  <span className="flex items-center gap-2 font-roboto text-base font-medium text-slate-400 dark:text-white/60">
                    {hindsight.winningEmployee?.name ? (
                      hindsight.winningEmployee?.name
                    ) : (
                      <span className="text-yellow-500">Nenhum</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end flex-1">
                <ShowIf condition={hindsight?.winningEmployee}>
                  <button
                    type="button"
                    onClick={onClickReport}
                    className="
                      w-max px-2 py-2
                      justify-center inline-flex 
                      font-medium text-slate-800 dark:text-white
                      rounded-md hoverbg-slate-300 bg-slate-200 dark:bg-slate-600
                    "
                  >
                    <HiDocumentReport
                      size="23px"
                      className="text-teal-700 dark:text-white "
                    />
                  </button>
                </ShowIf>
              </div>
            </li>
          );
        })}
      </ul>

      <ConfirmModal
        loadingConfirm={loadingDelete}
        onConfirm={onDeleteHindsight}
        modalRef={modalConfirmRef}
      />
    </section>
  );
}

function HindshgtDefault() {
  return (
    <li className="pl-14 pr-9 py-6 flex bg-white dark:bg-slate-800 shadow-card rounded-md">
      <div className="flex-1">
        <span className="font-roboto text-base font-normal text-slate-400 dark:text-white/80">
          Não há retrospectivas por enquanto!
        </span>
      </div>
    </li>
  );
}

function SkeletonHindsight() {
  return (
    <li
      style={{ minHeight: '102px' }}
      className="pl-14 pr-9 py-6 flex bg-white dark:bg-slate-800 shadow-card rounded-md transition-all duration-200 ease-in-out animate-fadeIn"
    >
      <div className="flex justify-center flex-col gap-1 flex-1 ">
        <span className="w-20 h-5 block bg-slate-300 dark:bg-slate-600 rounded animate-pulse-intense" />

        <div className="flex items-center gap-1">
          <small className="w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded animate-pulse-intense" />
          <span className="w-20 h-5 block bg-slate-300 dark:bg-slate-600 rounded animate-pulse-intense" />
        </div>
      </div>

      <div className="flex justify-center flex-col gap-1 flex-1">
        <div className="flex items-center gap-1">
          <small className="w-5 h-5 bg-slate-300 dark:bg-slate-600 rounded animate-pulse-intense" />
          <span className="w-24 h-5 block bg-slate-300 dark:bg-slate-600 rounded animate-pulse-intense" />
        </div>

        <div className="flex items-center gap-1">
          <small className="w-5 h-5 bg-slate-300 dark:bg-slate-600 rounded animate-pulse-intense" />
          <span className="w-12 h-5 block bg-slate-300 dark:bg-slate-600 rounded animate-pulse-intense" />
        </div>
      </div>

      <div className="lg:flex items-center flex-1 gap-5 hidden">
        <figure className="flex flex-col items-center gap-3">
          <div className="avatar placeholder">
            <div className="w-11 h-11 rounded-full bg-slate-300 dark:bg-slate-600 animate-pulse-intense" />
          </div>
        </figure>

        <div className="flex flex-col justify-center gap-1">
          <span className="w-40 h-5 block bg-slate-300 dark:bg-slate-600 rounded animate-pulse-intense" />
          <small className="w-32 h-5 bg-slate-300 dark:bg-slate-600 rounded animate-pulse-intense" />
        </div>
      </div>

      <div className="flex items-center justify-end flex-1">
        <span className="w-9 h-6 bg-slate-300 dark:bg-slate-600 rounded animate-pulse-intense" />
      </div>
    </li>
  );
}
