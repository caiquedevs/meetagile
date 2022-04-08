import { memo, ChangeEvent, useState } from 'react';
import { IoMdSend } from 'react-icons/io';
import { useLocation } from 'react-router-dom';
import { MdPendingActions } from 'react-icons/md';

import { Header, Modal, Options, Table } from '../../../components';
import { IAction } from '../../../interfaces/action';
import { IHindsight } from '../../../interfaces/hindsight';
import { IEmployee } from '../../../interfaces/employee';

interface PropsPage {
  state: {
    hindsight: IHindsight;
    employees: IEmployee[];
    actions: IAction;
    hindMode: 'create' | 'edit' | 'view';
  };
}

const colorsSelect: Record<string, string> = {
  'TO DO':
    'select-error text-white bg-red-500 disabled:bg-none disabled:bg-red-500 disabled:text-white',
  'IN PROGRESS':
    'select-warning text-white bg-yellow-500 disabled:bg-none disabled:bg-yellow-500 disabled:text-white',
  DONE: 'select-accent text-white bg-green-500 disabled:bg-none disabled:bg-green-500 disabled:text-white',
};

function StepActions() {
  const location = useLocation();
  const { state: navigationProps } = location as PropsPage;

  const [actions, setActions] = useState(navigationProps.actions);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false);

  const [actionName, setActionName] = useState('');
  const [actionNameEdit, setActionNameEdit] = useState({ value: '', index: -1 });

  const headersTable = [
    {
      label: 'Ação',
      value: 'name',
    },
    {
      label: 'Status',
      value: 'status',
    },
  ];

  const onOpenModal = () => setIsOpenModal(true);
  const onOpenModalEdit = () => setIsOpenModalEdit(true);
  const onCloseModalEdit = () => setIsOpenModalEdit(false);

  const onDelete = (index: number) => {
    const copyActions = { ...actions };
    copyActions.data.splice(index, 1);

    setActions(copyActions);
    setActionName('');
  };

  const onEdit = () => {
    const copyActions = { ...actions };
    copyActions.data[actionNameEdit.index].name = actionNameEdit.value;

    onCloseModalEdit();
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

  const handleChangeSelect = ({ value, index, id }: any) => {
    const copyActions = { ...actions };
    copyActions.data[index as number].status = value;
    setActions(copyActions);
  };

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    setActionName(event.target.value);
  };

  const handleChangeFieldEdit = (event: ChangeEvent<HTMLInputElement>) => {
    setActionNameEdit({ ...actionNameEdit, value: event.target.value });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    onCreate();
  };

  const handleSubmitEdit = (event: any) => {
    event.preventDefault();
    onEdit();
  };

  return (
    <>
      <footer className="w-full pb-10 pr-10 flex justify-end align-end fixed bottom-0 left-0">
        <div className="w-14 h-14 flex items-center justify-center">
          <button
            type="button"
            onClick={onOpenModal}
            className="btn-open-modal btn text-white border-none bg-orange-400 hover:bg-orange-400"
          >
            <MdPendingActions size="23px" />
          </button>
        </div>

        <Modal
          hiddenScrollBody={true}
          useIsOpen={[isOpenModal, setIsOpenModal]}
          modalStyle="w-full lg:max-w-4xl max-w-full min-h-screen pb-8 bg-white radius rounded-md"
          backDropStyle="p-9 px-5 lg:px-9"
        >
          <div>
            <Header
              subTitle="Minhas ações"
              title="Gerenciar minhas ações"
              className="dark:before:!bg-orange-400 before:!bg-orange-400 !text-white before:rounded-tr before:rounded-tl"
            />

            {navigationProps.hindMode !== 'view' ? (
              <form onSubmit={handleSubmit} className="form-control -mt-14 px-8">
                <label className="label">
                  <span className="label-text text-white dark:text-white">
                    Criar nova ação
                  </span>
                </label>

                <div className="input-group w-full">
                  <input
                    type="text"
                    name="hindsightName"
                    value={actionName}
                    required={true}
                    placeholder="Nome da retrospectiva"
                    onChange={handleChangeField}
                    className="input w-full input-bordered rounded focus:outline-none"
                  />

                  <button type="submit" className="btn btn-square">
                    <IoMdSend size="20px" color="#ffffff" />
                  </button>
                </div>
              </form>
            ) : null}

            <div
              className={`w-full mt-5 h-auto px-8 ${
                navigationProps.hindMode === 'view' ? '!-mt-14' : ''
              }`}
            >
              <Table
                data={actions?.data || []}
                colorHeader={navigationProps.hindMode === 'view' ? 'text-white' : ''}
                headers={headersTable}
              >
                {({
                  row,
                  index,
                }: {
                  row: { name: string; _id: string; status: string };
                  index: number;
                }) => {
                  const handleClickDelete = () => onDelete(index);

                  const handleClickEdit = () => {
                    setActionNameEdit({ value: row.name, index });
                    onOpenModalEdit();
                  };

                  const onChangeSelect = (event: any) => {
                    const payload = { value: event.target.value, index, id: row._id };
                    handleChangeSelect(payload);
                  };

                  return (
                    <tr key={row?._id!} className="tr-actions">
                      <td className="py-3 px-5">
                        <span>{row?.name!}</span>
                      </td>

                      <td className="py-3 px-5">
                        <select
                          onChange={onChangeSelect}
                          value={row?.status!}
                          style={{ minWidth: 150 }}
                          disabled={navigationProps.hindMode === 'view'}
                          className={`
                            select w-full min-h-8 h-8 
                            focus:outline-none 
                            ${colorsSelect[row?.status!]}
                          `}
                        >
                          <option className="bg-white text-gray-500 font-bold">
                            TO DO
                          </option>
                          <option className="bg-white text-gray-500 font-bold">
                            IN PROGRESS
                          </option>
                          <option className="bg-white text-gray-500 font-bold">
                            DONE
                          </option>
                        </select>
                      </td>

                      <td className="py-3 px-5">
                        {navigationProps.hindMode !== 'view' ? (
                          <Options
                            item=""
                            loadingDelete=""
                            onEdit={handleClickEdit}
                            onDelete={handleClickDelete}
                          />
                        ) : null}
                      </td>
                    </tr>
                  );
                }}
              </Table>

              <Modal
                useIsOpen={[isOpenModalEdit, setIsOpenModalEdit]}
                backDropStyle="p-9 px-5 lg:px-9 flex flex-col items-center justify-center"
                modalStyle="w-max h-max lg:max-w-4xl max-w-max p-8 flex flex-col bg-white radius rounded-md"
              >
                <form onSubmit={handleSubmitEdit} className="flex flex-col">
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
                    className="input w-96 input-bordered rounded focus:outline-none"
                    autoFocus
                  />

                  <button
                    type="submit"
                    className="btn w-full mt-3 bg-orange-500 border-none hover:bg-orange-600"
                  >
                    Salvar alterações
                  </button>
                </form>
              </Modal>
            </div>
          </div>
        </Modal>
      </footer>
    </>
  );
}

export default memo(StepActions);
