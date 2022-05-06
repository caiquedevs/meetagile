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
import { MdDeleteForever, MdModeEdit } from 'react-icons/md';
import { HiDocumentReport } from 'react-icons/hi';
import { GoPrimitiveDot } from 'react-icons/go';

import { useRequest } from '../../../hooks/useRequest';
import { IHindsight } from '../../../interfaces/hindsight';
import { INavigationStepProps } from '../../../interfaces/navigationStep';

import { Options, ShowIf, ConfirmModal } from '../../../components';
import { ModalInterface } from '../../../components/Modal';

export default function ListHindsights() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const request = useRequest();

  const returnUrl = location.pathname;

  const { hindsights, actions, loadingFetchDashboard } = useSelector(
    (state: IRootState) => state.dashboardReducer
  );

  const modalConfirmRef = useRef<ModalInterface>();
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleClickCreateHindsight = () => {
    navigate('form-hindsight', { state: { formMode: 'create', returnUrl } });
  };

  const handleClickEditHindsight = (hindsight: IHindsight) => {
    navigate('form-hindsight', { state: { formMode: 'edit', hindsight, returnUrl } });
  };

  const handleClickReport = (hindsight: IHindsight) => {
    const payload: INavigationStepProps = {
      state: {
        actions,
        hindsight,
        mode: 'view',
      },
    };

    dispatch(actionsStep.setCurrentHindsight(hindsight));
    navigate('/new-hindsight/step-one', { state: { mode: 'view' } });
  };

  const onDeleteHindsight = () => {
    const selectedHindsight: IHindsight = modalConfirmRef.current?.payload;

    setLoadingDelete(true);

    request({ method: 'DELETE', url: `/hindsight/${selectedHindsight._id}` })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess() {
      const hindsightsFilter = hindsights.filter(
        (hindsight) => hindsight._id !== selectedHindsight._id
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

  const onOpenConfirmModal = (hindsight: IHindsight) => {
    modalConfirmRef.current?.openModal(hindsight);
  };

  const optionsListTable = [
    {
      label: 'Editar',
      icon: MdModeEdit,
      onClick: handleClickEditHindsight,
    },
    {
      label: 'Excluir',
      icon: MdDeleteForever,
      onClick: onOpenConfirmModal,
    },
  ];

  return (
    <section className="px-16">
      <div className="pt-6 pb-5">
        <h2 className="flex items-center gap-1 font-medium font-roboto text-base text-gray-600 dark:text-white">
          Retrospectivas -
          <button
            type="button"
            onClick={handleClickCreateHindsight}
            className="font-roboto text-lg font-medium underline text-teal-400 hover:text-teal-600 duration-300 cursor-pointer"
          >
            criar agora
          </button>
        </h2>
      </div>

      <ul className="w-full flex flex-col gap-4">
        <ShowIf condition={loadingFetchDashboard}>
          <SkeletonHindsight />
          <SkeletonHindsight />
        </ShowIf>

        <ShowIf condition={!loadingFetchDashboard && hindsights?.length === 0}>
          <HindshgtDefault />
        </ShowIf>

        {hindsights?.map((hindsight) => {
          const copyOptionsListTable = [...optionsListTable];

          if (hindsight.winningEmployee) {
            copyOptionsListTable.push({
              label: 'Relatório',
              icon: HiDocumentReport,
              onClick: handleClickReport,
            });
          }

          return (
            <li
              key={hindsight._id}
              className="pl-14 pr-9 py-6 flex bg-white dark:bg-slate-800 shadow-card rounded-md"
            >
              <div className="flex-1">
                <span className="font-roboto text-lg font-bold text-gray-450 dark:text-white">
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
                <span className="flex items-center gap-1 font-roboto text-lg font-bold text-gray-450 dark:text-white">
                  <FaRegCalendarAlt className="text-base text-black dark:text-white" />
                  {formatDistanceStrict(new Date(hindsight?.createdAt!), new Date(), {
                    locale: pt,
                  })}
                </span>

                <span className="flex items-center gap-2 font-roboto text-base font-medium text-gray-400 dark:text-white/60">
                  <FaRegClock className="text-base text-black dark:text-white" />
                  {format(new Date(hindsight.createdAt!), "HH'h'mm", {
                    locale: pt,
                  })}
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
                      <div className="w-11 h-11 text-white flex items-center justify-center rounded-full bg-gray-400">
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
                  <span className="flex items-center gap-1 font-roboto text-lg font-bold text-gray-450 dark:text-white">
                    Destaque da Sprint
                  </span>
                  <span className="flex items-center gap-2 font-roboto text-base font-medium text-gray-400 dark:text-white/60">
                    {hindsight.winningEmployee?.name || 'Nenhum'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end flex-1">
                <Options list={copyOptionsListTable} currentItem={hindsight} />
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
        <span className="font-roboto text-base font-normal text-gray-400 dark:text-white/80">
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
        <span className="w-20 h-5 block bg-gray-300 dark:bg-slate-600 rounded animate-pulse-intense" />

        <div className="flex items-center gap-1">
          <small className="w-3 h-3 bg-gray-300 dark:bg-slate-600 rounded animate-pulse-intense" />
          <span className="w-20 h-5 block bg-gray-300 dark:bg-slate-600 rounded animate-pulse-intense" />
        </div>
      </div>

      <div className="flex justify-center flex-col gap-1 flex-1">
        <div className="flex items-center gap-1">
          <small className="w-5 h-5 bg-gray-300 dark:bg-slate-600 rounded animate-pulse-intense" />
          <span className="w-24 h-5 block bg-gray-300 dark:bg-slate-600 rounded animate-pulse-intense" />
        </div>

        <div className="flex items-center gap-1">
          <small className="w-5 h-5 bg-gray-300 dark:bg-slate-600 rounded animate-pulse-intense" />
          <span className="w-12 h-5 block bg-gray-300 dark:bg-slate-600 rounded animate-pulse-intense" />
        </div>
      </div>

      <div className="lg:flex items-center flex-1 gap-5 hidden">
        <figure className="flex flex-col items-center gap-3">
          <div className="avatar placeholder">
            <div className="w-11 h-11 rounded-full bg-gray-300 dark:bg-slate-600 animate-pulse-intense" />
          </div>
        </figure>

        <div className="flex flex-col justify-center gap-1">
          <span className="w-40 h-5 block bg-gray-300 dark:bg-slate-600 rounded animate-pulse-intense" />
          <small className="w-32 h-5 bg-gray-300 dark:bg-slate-600 rounded animate-pulse-intense" />
        </div>
      </div>

      <div className="flex items-center justify-end flex-1">
        <span className="w-9 h-6 bg-gray-300 dark:bg-slate-600 rounded animate-pulse-intense" />
      </div>
    </li>
  );
}
