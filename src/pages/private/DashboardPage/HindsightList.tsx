import { useRef, useState } from 'react';
import { format, formatDistanceStrict } from 'date-fns';
import { pt } from 'date-fns/locale';

import { FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';
import { MdDeleteForever, MdModeEdit } from 'react-icons/md';
import { HiDocumentReport } from 'react-icons/hi';
import { GoPrimitiveDot } from 'react-icons/go';

import { Options, ShowIf } from '../../../components';
import { ModalInterface } from '../../../components/Modal';

import { IHindsight } from '../../../interfaces/hindsight';
import request from '../../../services/api';
import { toast } from 'react-toastify';
import ConfirmModal from '../../../components/ConfirmModal';
import { useDashboard } from '../../../hooks/useDashboard';
import { useNavigate } from 'react-router-dom';
import { IStepProps } from '../../../interfaces/stepProps';

export default function ListHindsights() {
  const navigate = useNavigate();
  const { data, setData, loadingFetch } = useDashboard();

  const returnUrl = location.pathname;

  const modalConfirmRef = useRef<ModalInterface>();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [selectedHindsight, setSelectedHindsight] = useState({} as IHindsight);

  const handleClickCreateHindsight = () => {
    navigate('form-hindsight', { state: { formMode: 'create', returnUrl } });
  };

  const handleClickEditHindsight = (hindsight: IHindsight) => {
    navigate('form-hindsight', { state: { formMode: 'edit', hindsight, returnUrl } });
  };

  const handleClickReport = (hindsight: IHindsight) => {
    const payload: IStepProps = {
      state: {
        actions: data.actions,
        hindsight,
        mode: 'view',
      },
    };

    navigate('/new-hindsight/step-one', payload);
  };

  const onDeleteHindsight = () => {
    setLoadingDelete(true);

    request({ method: 'DELETE', url: `/hindsight/${selectedHindsight._id}` })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess() {
      const hindsights = data.hindsights.filter(
        (hindsight) => hindsight._id !== selectedHindsight._id
      );

      setData((old) => ({ ...old, hindsights }));
      setSelectedHindsight({} as IHindsight);

      modalConfirmRef.current?.closeModalSimple();
      toast.success('Retrospectiva removida com sucesso!');
    }

    function onError(error: any) {
      toast.error(error.data.msg);
    }

    function onFinally() {
      setLoadingDelete(false);
    }
  };

  const onOpenConfirmModal = (hindsight: IHindsight) => {
    setSelectedHindsight(hindsight);
    modalConfirmRef.current?.openModal();
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
        <h2 className="flex items-center gap-1 font-medium font-roboto text-base text-gray-600">
          Retrospectivas -
          <button
            type="button"
            onClick={handleClickCreateHindsight}
            className="font-roboto text-lg font-medium underline text-teal-500 hover:text-teal-600 cursor-pointer"
          >
            criar agora
          </button>
        </h2>
      </div>

      <ul className="w-full flex flex-col gap-4">
        <ShowIf condition={loadingFetch}>
          <SkeletonHindsight />
        </ShowIf>

        <ShowIf condition={!loadingFetch && data.hindsights?.length === 0}>
          <HindshgtDefault />
        </ShowIf>

        {data?.hindsights?.map((hindsight) => {
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
              className="pl-14 pr-9 py-6 flex bg-white shadow-card rounded-md transition-all duration-200 ease-in-out"
            >
              <div className="flex-1">
                <span className="font-roboto text-lg font-bold text-gray-450">
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
                <span className="flex items-center gap-1 font-roboto text-lg font-bold text-gray-450">
                  <FaRegCalendarAlt className="text-base text-black" />
                  {formatDistanceStrict(new Date(hindsight?.createdAt), new Date(), {
                    locale: pt,
                  })}
                </span>

                <span className="flex items-center gap-2 font-roboto text-base font-medium text-gray-400">
                  <FaRegClock className="text-base text-black" />
                  {format(new Date(hindsight.createdAt), "HH'h'mm", {
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
                          {hindsight?.winningEmployee?.name[0] || '?'}
                        </span>
                      </div>
                    </div>
                  </ShowIf>
                </figure>

                <div className="flex flex-col">
                  <span className="flex items-center gap-1 font-roboto text-lg font-bold text-gray-450">
                    Destaque da Sprint
                  </span>
                  <span className="flex items-center gap-2 font-roboto text-base font-medium text-gray-400">
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
    <li className="pl-14 pr-9 py-6 flex bg-white shadow-card rounded-md transition-all duration-200 ease-in-out">
      <div className="flex-1">
        <span className="font-roboto text-base font-normal text-gray-400">
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
      className="pl-14 pr-9 py-6 flex bg-white shadow-card rounded-md transition-all duration-200 ease-in-out animate-fadeIn"
    >
      <div className="flex justify-center flex-col gap-1 flex-1 ">
        <span className="w-20 h-5 block bg-gray-300 rounded animate-pulse-intense" />

        <div className="flex items-center gap-1">
          <small className="w-3 h-3 bg-gray-300 rounded animate-pulse-intense" />
          <span className="w-20 h-5 block bg-gray-300 rounded animate-pulse-intense" />
        </div>
      </div>

      <div className="flex justify-center flex-col gap-1 flex-1">
        <div className="flex items-center gap-1">
          <small className="w-5 h-5 bg-gray-300 rounded animate-pulse-intense" />
          <span className="w-24 h-5 block bg-gray-300 rounded animate-pulse-intense" />
        </div>

        <div className="flex items-center gap-1">
          <small className="w-5 h-5 bg-gray-300 rounded animate-pulse-intense" />
          <span className="w-12 h-5 block bg-gray-300 rounded animate-pulse-intense" />
        </div>
      </div>

      <div className="lg:flex items-center flex-1 gap-5 hidden">
        <figure className="flex flex-col items-center gap-3">
          <div className="avatar placeholder">
            <div className="w-11 h-11 rounded-full bg-gray-300 animate-pulse-intense" />
          </div>
        </figure>

        <div className="flex flex-col justify-center gap-1">
          <span className="w-40 h-5 block bg-gray-300 rounded animate-pulse-intense" />
          <small className="w-32 h-5 bg-gray-300 rounded animate-pulse-intense" />
        </div>
      </div>

      <div className="flex items-center justify-end flex-1">
        <span className="w-9 h-6 bg-gray-300 rounded animate-pulse-intense" />
      </div>
    </li>
  );
}
