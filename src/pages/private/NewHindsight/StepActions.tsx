import React, { ChangeEvent, MutableRefObject, useRef, useState } from 'react';
import { FaWindowClose } from 'react-icons/fa';
import { IoMdClose, IoMdSend } from 'react-icons/io';
import { MdDeleteForever, MdModeEdit } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { ConfirmModal, Options, ShowIf } from '../../../components';
import Modal, { ModalInterface } from '../../../components/Modal';
import { useDashboard } from '../../../hooks/useDashboard';
import { IAction } from '../../../interfaces/action';
import { IStepProps } from '../../../interfaces/stepProps';

type StepActionsProps = {
  modalRef: MutableRefObject<ModalInterface | undefined>;
};

const colorsSelect: Record<string, string> = {
  'TO DO':
    'select-error text-white bg-red-500 disabled:bg-none disabled:bg-red-500 disabled:text-white',
  'IN PROGRESS':
    'select-warning text-white bg-yellow-500 disabled:bg-none disabled:bg-yellow-500 disabled:text-white',
  DONE: 'select-accent text-white bg-green-500 disabled:bg-none disabled:bg-green-500 disabled:text-white',
};

export default function StepActions({ modalRef }: StepActionsProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const { data, setData } = useDashboard();

  const modalEditRef = useRef<ModalInterface>();
  const modalConfirmRef = useRef<ModalInterface>();

  const { state: navigationProps } = location as IStepProps;

  const [actions, setActions] = useState(navigationProps.actions);
  const [actionName, setActionName] = useState('');
  const [actionNameEdit, setActionNameEdit] = useState({ value: '', index: -1 });

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    setActionName(event.target.value);
  };

  const handleChangeFieldEdit = (event: ChangeEvent<HTMLInputElement>) => {
    setActionNameEdit({ ...actionNameEdit, value: event.target.value });
  };

  const handleClickCloseModal = () => {
    modalRef.current?.closeModalSimple();
  };

  const handleChangeSelect = ({ value, index }: any) => {
    const copyActions = { ...actions };
    copyActions.data[index as number].status = value;
    setActions(copyActions);
  };

  const handleClickDelete = ({ row, index }: any) => {
    modalConfirmRef.current?.openModal({ row, index });
  };

  const onDelete = () => {
    const { row, index } = modalConfirmRef.current?.payload;
    const copyActions = { ...actions };
    copyActions.data.splice(index, 1);

    setActions(copyActions);
    setActionName('');
    modalConfirmRef.current?.closeModalSimple();
  };

  const handleClickEdit = ({ row, index }: any) => {
    modalEditRef.current?.openModal();
    setActionNameEdit({ value: row.name, index });
  };

  const onEdit = () => {
    const copyActions = { ...actions };
    copyActions.data[actionNameEdit.index].name = actionNameEdit.value;

    modalEditRef.current?.closeModalSimple();
    setActions(copyActions);
    setActionNameEdit({ value: '', index: -1 });
  };

  const onCreate = () => {
    const payload = { name: actionName, status: 'TO DO' };
    const copyActions = { ...actions };
    copyActions.data.unshift(payload);

    setActions(copyActions);
    setActionName('');
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    onCreate();
  };

  const handleSubmitEdit = (event: any) => {
    event.preventDefault();
    onEdit();
  };

  const optionsListTable = [
    {
      label: 'Editar',
      icon: MdModeEdit,
      onClick: handleClickEdit,
    },
    {
      label: 'Excluir',
      icon: MdDeleteForever,
      onClick: handleClickDelete,
    },
  ];

  return (
    <Modal
      ref={modalRef}
      preventNavigate={true}
      modalChildren={
        <>
          <EditModal
            modalRef={modalEditRef}
            onConfirm={handleSubmitEdit}
            actionNameEdit={actionNameEdit}
            handleChangeFieldEdit={handleChangeFieldEdit}
          />

          <ConfirmModal
            loadingConfirm={false}
            onConfirm={onDelete}
            modalRef={modalConfirmRef}
          />
        </>
      }
    >
      {() => {
        return (
          <div className="inline-block w-full my-8 max-w-screen-lg px-10 py-12 pb-16  text-left align-middle transition-all transform bg-white dark:!bg-gray-800 rounded">
            <button
              type="button"
              onClick={handleClickCloseModal}
              className="
              w-8 h-8 p-0
              flex items-center justify-center 
              absolute -top-3 -right-3 z-10
              bg-gray-600 rounded-full text-white text-lg
            "
            >
              <IoMdClose />
            </button>

            <div className="w-full text-center flex h-full flex-col justify-between">
              <div className="w-full flex-1 flex flex-col gap-5">
                {navigationProps.mode !== 'view' ? (
                  <form onSubmit={handleSubmit} className="form-control">
                    <label className="label">
                      <span className="label-text text-gray-800 dark:text-gray-800">
                        Criar nova ação
                      </span>
                    </label>

                    <div className="flex w-full">
                      <input
                        type="text"
                        name="hindsightName"
                        value={actionName}
                        required={true}
                        placeholder="Nome da ação"
                        onChange={handleChangeField}
                        className="input input-primary !rounded-r-none"
                      />

                      <button
                        type="submit"
                        className="btn btn-primary !rounded-l-none flex items-center !w-max px-5 !bg-orange-400"
                      >
                        Cadastrar
                      </button>
                    </div>
                  </form>
                ) : null}

                <table style={{ borderSpacing: '0px 8px', borderCollapse: 'separate' }}>
                  <ShowIf condition={actions?.data.length}>
                    <thead className="text-left">
                      <tr>
                        <th className="font-roboto font-medium text-gray-800">Nome</th>
                        <th className="font-roboto font-medium text-gray-800">Opnião</th>
                      </tr>
                    </thead>
                  </ShowIf>

                  <tbody>
                    <ShowIf condition={!actions?.data?.length}>
                      <tr className="bg-white text-gray-800">
                        <td
                          colSpan={3}
                          className="px-5 py-4 rounded-l-md border border-r-0 border-gray-default break-words"
                        >
                          <div className="flex items-center justify-center text-gray-500">
                            Nenhum conteudo a mostrar por enquanto!
                          </div>
                        </td>
                      </tr>
                    </ShowIf>

                    {actions?.data?.map((row, index) => {
                      const onChangeSelect = (event: any) => {
                        const payload = { value: event.target.value, index };
                        handleChangeSelect(payload);
                      };

                      return (
                        <tr key={index} className="tr-actions">
                          <td className="px-5 py-4 rounded-l-md border border-r-0 border-gray-default break-words">
                            <span className="text-left">{row?.name!}</span>
                          </td>

                          <td className="border-y border-gray-default break-words">
                            <select
                              onChange={onChangeSelect}
                              value={row?.status!}
                              style={{ minWidth: 150 }}
                              disabled={navigationProps.mode === 'view'}
                              className={`w-full px-2 min-h-8 h-8 cursor-pointer font-semibold rounded disabled:!cursor-auto ${
                                colorsSelect[row?.status!]
                              }`}
                            >
                              <option className="bg-white text-gray-800 font-normal">
                                TO DO
                              </option>
                              <option className="bg-white text-gray-800 font-normal">
                                IN PROGRESS
                              </option>
                              <option className="bg-white text-gray-800 font-normal">
                                DONE
                              </option>
                            </select>
                          </td>

                          {navigationProps.mode !== 'view' ? (
                            <td className="px-5 py-4 rounded-r-md border border-l-0 border-gray-default break-words">
                              <div className="w-full flex items-center justify-end">
                                <Options
                                  list={optionsListTable}
                                  currentItem={{ row, index }}
                                  iconSize="18px"
                                />
                              </div>
                            </td>
                          ) : null}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      }}
    </Modal>
  );
}

function EditModal({ modalRef, onConfirm, actionNameEdit, handleChangeFieldEdit }: any) {
  const onCloseModal = () => {
    modalRef.current?.closeModalSimple();
  };

  return (
    <Modal ref={modalRef} preventNavigate={true}>
      {() => (
        <div className="inline-block w-full max-w-md px-10 py-12 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <form onSubmit={onConfirm} className="flex flex-col">
            <label className="label">
              <span className="label-text text-gray-700 dark:text-gray-700">
                Editar ação
              </span>
            </label>

            <input
              type="text"
              name="hindsightNameEdit"
              value={actionNameEdit.value}
              required={true}
              placeholder="Nome da retrospectiva"
              onChange={handleChangeFieldEdit}
              className="input input-primary"
              autoFocus={true}
            />

            <div className="w-full mt-5 flex flex-col gap-3.5">
              <button type="submit" className="btn btn-primary">
                Salvar alterações
              </button>
            </div>

            <div className="w-full mt-2 flex flex-col gap-3.5">
              <button type="button" onClick={onCloseModal} className="btn btn-outline">
                Voltar
              </button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  );
}
