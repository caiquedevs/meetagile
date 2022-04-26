import { Dispatch, MutableRefObject, SetStateAction, useRef, useState } from 'react';
import { FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';
import { MdDeleteForever, MdModeEdit } from 'react-icons/md';
import { HiDocumentReport } from 'react-icons/hi';
import { GoPrimitiveDot } from 'react-icons/go';
import { pt } from 'date-fns/locale';

import { Options, ShowIf } from '../../../../components';

import { format, formatDistanceStrict } from 'date-fns';
import { ModalInterface } from '../../../../components/Modal';
import { IData, IMode } from '..';
import { IHindsight } from '../../../../interfaces/hindsight';
import request from '../../../../services/api';
import { toast } from 'react-toastify';
import ConfirmModal from '../../../../components/ConfirmModal';

type PageProps = {
  useMode: [mode: IMode, setMode: Dispatch<SetStateAction<IMode>>];
  useData: [data: IData, setData: Dispatch<SetStateAction<IData>>];
  modalRef: MutableRefObject<ModalInterface | undefined>;
};

export default function ListHindsights(props: PageProps) {
  const { useMode, useData, modalRef } = props;

  const [, setMode] = useMode;
  const [data, setData] = useData;

  const confirmModalRef = useRef<ModalInterface>();
  const [loadingDelete, setLoadingDelete] = useState('');

  const openModalHindsight = () => modalRef.current?.openModal();
  const openConfirmModal = (payload?: any) => confirmModalRef.current?.openModal(payload);

  const handleClickCreateHindsight = () => {
    setMode({ name: 'create', payload: { data, setData } });
    openModalHindsight();
  };

  const handleClickEditHindsight = (item: IHindsight) => {
    setMode({ name: 'edit', payload: { item, data, setData } });
    openModalHindsight();
  };

  const onDeleteHindsight = (item: IHindsight) => {
    setLoadingDelete(item._id);

    request({ method: 'DELETE', url: `/hindsight/${item._id}` })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess() {
      const hindsights = data.hindsights.filter(
        (hindsight) => hindsight._id !== item._id
      );
      setData((old) => ({ ...old, hindsights }));
    }

    function onError(error: any) {
      toast.error(error.data.msg);
    }

    function onFinally() {
      setLoadingDelete('');
    }
  };

  const handleClickOpenConfirmModal = (item: IHindsight) => {
    openConfirmModal(item);
  };

  const handleClickReport = () => {};

  const optionsListTable = [
    {
      label: 'Editar',
      icon: MdModeEdit,
      onClick: handleClickEditHindsight,
    },
    {
      label: 'Excluir',
      icon: MdDeleteForever,
      onClick: handleClickOpenConfirmModal,
    },
  ];

  return (
    <section className="px-16">
      <div className="pt-6 pb-5">
        <h2 className="flex gap-1 font-medium font-roboto text-base text-gray-600">
          Retrospectivas -
          <button
            type="button"
            onClick={handleClickCreateHindsight}
            className="font-roboto text-base font-medium underline text-black/25 hover:text-teal-500 cursor-pointer"
          >
            criar agora
          </button>
        </h2>
      </div>

      <ul className="w-full flex flex-col gap-4">
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
              className={`pl-14 pr-9 py-6 flex bg-white shadow-card rounded-md transition-all duration-200 ease-in-out animate-fadeIn ${
                loadingDelete === hindsight._id && 'animate-pulse bg-black/5'
              }`}
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
                  {format(new Date(hindsight.createdAt), "hh'h'mm", {
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
                        <span className="text-2xl font-roboto font-medium">
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

      <ConfirmModal onConfirm={onDeleteHindsight} modalRef={confirmModalRef} />
    </section>
  );
}
