import { ChangeEvent, MutableRefObject, useEffect, useRef, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { MdDeleteForever, MdModeEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ConfirmModal, Options, ShowIf } from '../../../components';
import Modal, { ModalInterface } from '../../../components/Modal';
import { INavigationStepProps } from '../../../interfaces/navigationStep';
import { IAction } from '../../../interfaces/action';

import { IRootState } from '../../../store/modules/rootReducer';
import * as actionsStep from '../../../store/modules/step/actions';
import * as actionsDashboard from '../../../store/modules/dashboard/actions';

import { useRequest } from '../../../hooks/useRequest';
import { toast } from 'react-toastify';

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
  const dispatch = useDispatch();
  const location = useLocation();
  const request = useRequest();

  const modalEditRef = useRef<ModalInterface>();
  const modalConfirmRef = useRef<ModalInterface>();

  const { state } = location as INavigationStepProps;
  const navigationProps = state || { mode: 'create' };

  const { actions } = useSelector((state: IRootState) => state.dashboardReducer);
  const { currentActions, currentHindsight } = useSelector(
    (state: IRootState) => state.stepReducer
  );
  const { user } = useSelector((state: IRootState) => state.authReducer);

  const [actionName, setActionName] = useState('');
  const [actionNameEdit, setActionNameEdit] = useState({ value: '', index: -1 });
  const [finallyActions, setFinallyActions] = useState({} as IAction);

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    setActionName(event.target.value);
  };

  const handleChangeFieldEdit = (event: ChangeEvent<HTMLInputElement>) => {
    setActionNameEdit({ ...actionNameEdit, value: event.target.value });
  };

  const handleClickCloseModal = () => {
    modalRef.current?.closeModalSimple();
    if (user.type === 'admin' || navigationProps?.mode === 'view') return;

    request({
      method: 'PUT',
      url: `/action/${finallyActions._id}`,
      data: actions,
    }).catch(onError);

    function onError(error: any) {
      toast.error(
        'Houve um erro ao salvar as ações, por favor, contate um administrador'
      );
    }
  };

  const handleChangeSelect = ({ value, index }: any) => {
    const copyActions = { ...finallyActions };
    copyActions.data[index as number].status = value;

    dispatch(actionsStep.setCurrentActions(copyActions));
    dispatch(actionsDashboard.setActions(copyActions));
  };

  const handleClickDelete = ({ row, index }: any) => {
    modalConfirmRef.current?.openModal({ row, index });
  };

  const onDelete = () => {
    const { row, index } = modalConfirmRef.current?.payload;
    const copyActions = { ...finallyActions };
    copyActions.data.splice(index, 1);

    dispatch(actionsStep.setCurrentActions(copyActions));
    dispatch(actionsDashboard.setActions(copyActions));

    setActionName('');
    modalConfirmRef.current?.closeModalSimple();
  };

  const handleClickEdit = ({ row, index }: any) => {
    modalEditRef.current?.openModal();
    setActionNameEdit({ value: row.name, index });
  };

  const onEdit = () => {
    const copyActions = { ...finallyActions };
    copyActions.data[actionNameEdit.index].name = actionNameEdit.value;

    modalEditRef.current?.closeModalSimple();

    dispatch(actionsStep.setCurrentActions(copyActions));
    dispatch(actionsDashboard.setActions(copyActions));

    setActionNameEdit({ value: '', index: -1 });
  };

  const onCreate = () => {
    const payload = { name: actionName, status: 'TO DO' };
    const copyActions = { ...finallyActions };
    copyActions.data.unshift(payload);

    dispatch(actionsStep.setCurrentActions(copyActions));
    dispatch(actionsDashboard.setActions(copyActions));

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

  useEffect(() => {
    // Feito caso actions seja chamada no dashboard ou nas etapas
    const decisionActions = actions._id ? actions : currentActions;
    setFinallyActions(decisionActions);

    return () => {};
  }, [actions, currentActions]);

  return (
    <Modal
      ref={modalRef}
      preventNavigate={true}
      callbackBackDrop={handleClickCloseModal}
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
          <div className="inline-block w-full my-8 max-w-screen-lg px-10 py-12 pb-16  text-left align-middle transition-all transform bg-white dark:!bg-gray-900 rounded">
            <button
              type="button"
              onClick={handleClickCloseModal}
              className="
              w-8 h-8 p-0
              flex items-center justify-center 
              absolute -top-3 -right-3 z-10
              bg-gray-600 dark:bg-white rounded-full text-white dark:text-black text-lg
            "
            >
              <IoMdClose />
            </button>

            <div className="w-full flex h-full flex-col justify-between">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                {navigationProps?.mode === 'view'
                  ? 'Visualizar ações do time - ' + currentHindsight.user_id?.teamName
                  : 'Gerenciar ações do time'}
              </h3>

              <div className="mt-2">
                <p className="text-sm text-gray-500 dark:text-white/80">
                  {navigationProps?.mode === 'view' ? (
                    <span className="mb-5">
                      Navegue para baixo para visualizar as ações do time
                    </span>
                  ) : (
                    'Preencha os campos abaixo para cadastrar uma nova ação'
                  )}
                </p>
              </div>
              <div className="w-full flex-1 flex flex-col gap-5">
                {navigationProps.mode !== 'view' ? (
                  <form onSubmit={handleSubmit} className="mt-4">
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
                  <ShowIf condition={finallyActions?.data?.length}>
                    <thead className="text-left">
                      <tr>
                        <th className="font-roboto font-medium text-gray-800 dark:text-white">
                          Nome
                        </th>
                        <th className="font-roboto font-medium text-gray-800 dark:text-white">
                          Opnião
                        </th>
                      </tr>
                    </thead>
                  </ShowIf>

                  <tbody>
                    <ShowIf condition={!finallyActions?.data?.length}>
                      <tr className="bg-white text-gray-800 dark:bg-slate-800">
                        <td
                          colSpan={3}
                          className="px-5 py-4 rounded-l-md border border-r-0 border-gray-default dark:border-transparent break-words"
                        >
                          <div className="flex items-center justify-center text-gray-500 dark:text-white/80">
                            Nenhum conteudo a mostrar por enquanto!
                          </div>
                        </td>
                      </tr>
                    </ShowIf>

                    {finallyActions?.data?.map((row, index) => {
                      const onChangeSelect = (event: any) => {
                        const payload = { value: event.target.value, index };
                        handleChangeSelect(payload);
                      };

                      return (
                        <tr key={index} className="tr-actions dark:bg-slate-800">
                          <td className="px-5 py-4 rounded-l-md border border-r-0 border-gray-default dark:border-transparent break-words">
                            <span className="text-left dark:text-white">
                              {row?.name!}
                            </span>
                          </td>

                          <td className="border-y border-gray-default dark:border-transparent break-words">
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

                          <td className="px-5 py-4 rounded-r-md border border-l-0 border-gray-default dark:border-transparent break-words">
                            <div className="w-full flex items-center justify-end">
                              {navigationProps.mode !== 'view' ? (
                                <Options
                                  list={optionsListTable}
                                  currentItem={{ row, index }}
                                  iconSize="18px"
                                />
                              ) : null}
                            </div>
                          </td>
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
