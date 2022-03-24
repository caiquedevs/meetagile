import { memo, ChangeEvent, useState, Dispatch } from 'react';
import { IoMdSend } from 'react-icons/io';
import { useLocation } from 'react-router-dom';
import { MdPendingActions } from 'react-icons/md';

import { Options, Table } from '../../../components';
import { IAction } from '../../../interfaces/action';
import { IHindsight } from '../../../interfaces/hindsight';
import { IEmployee } from '../../../interfaces/employee';

interface ActionsModalProps {
  useActions: [IAction, Dispatch<React.SetStateAction<IAction>>];
}

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

function ActionsModal({ useActions }: ActionsModalProps) {
  const location = useLocation();
  const { state: navigationProps } = location as PropsPage;

  const [name, setName] = useState('');
  const [toogleModal, setToogleModal] = useState(false);

  const [mode, setMode] = useState<'create' | number>('create');
  const [actions, setActions] = useActions;

  const onReset = () => {
    setMode('create');
    setName('');
  };

  const onCreate = () => {
    const payload = { name, status: 'TO DO' };

    const copyActions = { ...actions };
    copyActions.data.unshift(payload);
    setActions(copyActions);
    onReset();
  };

  const onDelete = (index: number) => {
    const copyActions = { ...actions };
    copyActions.data.splice(index, 1);
    setActions(copyActions);
    onReset();
  };

  const onEdit = () => {
    const copyActions = { ...actions };
    copyActions.data[mode as number].name = name;
    setActions(copyActions);
    onReset();
  };

  const handleChangeSelect = ({ value, index, id }: any) => {
    const copyActions = { ...actions };
    copyActions.data[index as number].status = value;
    setActions(copyActions);
  };

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleChangeToogle = () => {
    setToogleModal(!toogleModal);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    mode === 'create' ? onCreate() : onEdit();
  };

  return (
    <>
      <label
        htmlFor="my-modal-4"
        onClick={handleChangeToogle}
        className="
          btn w-max
          border-none  bg-orange-400 hover:bg-orange-400 text-white 
          fixed bottom-10 right-10
        "
      >
        <MdPendingActions size="23px" />
      </label>

      <input
        type="checkbox"
        id="my-modal-4"
        className="modal-toggle"
        checked={toogleModal}
      />

      <label htmlFor="my-modal-4" className="modal">
        <label
          className="modal-box rounded overflow-visible max-w-4xl"
          htmlFor="my-modal-4"
        >
          <label
            htmlFor="my-modal-4"
            onClick={handleChangeToogle}
            className="btn btn-sm btn-circle absolute"
            style={{ top: '-13px', right: '-13px', lineHeight: 0 }}
          >
            ✕
          </label>

          <div className="overflow-y-auto" style={{ height: 'calc(100vh - 8em)' }}>
            {navigationProps.hindMode !== 'view' ? (
              <form onSubmit={handleSubmit} className="form-control mt-3">
                <label className="label">
                  <span className="label-text">Gerenciar ações</span>
                </label>

                <div className="input-group w-full">
                  <input
                    type="text"
                    name="hindsightName"
                    value={name}
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

            <div className="w-full mt-5 h-auto">
              <Table
                data={actions?.data || []}
                colorHeader="white"
                headers={['Ação', 'Status']}
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
                    setMode(index!);
                    setName(row.name!);
                  };

                  const onChangeSelect = (event: any) => {
                    const payload = { value: event.target.value, index, id: row._id };
                    handleChangeSelect(payload);
                  };

                  return (
                    <tr key={row?._id!}>
                      <td>
                        <span>{row?.name!}</span>
                      </td>

                      <td>
                        <select
                          onChange={onChangeSelect}
                          value={row?.status!}
                          style={{ minWidth: 150 }}
                          disabled={true}
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

                      <td>
                        {navigationProps.hindMode !== 'view' ? (
                          <Options
                            loadingDelete=""
                            item=""
                            onEdit={handleClickEdit}
                            onDelete={handleClickDelete}
                          />
                        ) : null}
                      </td>
                    </tr>
                  );
                }}
              </Table>
            </div>
          </div>
        </label>
      </label>
    </>
  );
}

export default memo(ActionsModal);
