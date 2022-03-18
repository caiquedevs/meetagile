import { Grid, Row } from 'cdevs-ui';
import { ChangeEvent, useEffect, useState } from 'react';
import { FiMoreHorizontal } from 'react-icons/fi';
import { IoMdSend } from 'react-icons/io';
import { MdPendingActions } from 'react-icons/md';
import { toast } from 'react-toastify';
import { Options, Table } from '../../../components';
import { IActions } from '../../../interfaces/action';
import request from '../../../services/api';
import dataTable from '../../../utils/dataTable';

interface ActionsModalProps {
  autoShow?: boolean;
}

const colorsSelect: Record<string, string> = {
  'TO DO': 'select-error text-white bg-red-500',
  'IN PROGRESS': 'select-warning text-white bg-yellow-500',
  DONE: 'select-accent text-white bg-green-500',
};

function ActionsModal({ autoShow }: ActionsModalProps) {
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [data, setData] = useState<any[]>([]);

  const [name, setName] = useState('');
  const [mode, setMode] = useState<'create' | number>('create');

  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const onReset = () => {
    setMode('create');
    setName('');
  };

  const onCreate = () => {
    const payload = { name, status: 'TO DO' };

    const copyData = [...data];
    copyData.unshift(payload);
    setData(copyData);
    onReset();
  };

  const onDelete = (index: number) => {
    const payload = [...data];
    payload.splice(index, 1);
    setData(payload);
    onReset();
  };

  const onEdit = () => {
    const payload = [...data];
    payload[mode as number].name = name;
    setData(payload);
    onReset();
  };

  const handleChangeSelect = ({ value, index, id }: any) => {
    const payload = [...data];
    payload[index as number].status = value;
    setData(payload);
  };

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    mode === 'create' ? onCreate() : onEdit();
  };

  useEffect(() => {
    setLoadingFetch(true);

    request({ method: 'GET', url: '/actions' })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess(response: any) {
      setData(response);
    }

    function onError(error: any) {
      toast.error(error.data.msg);
    }

    function onFinally() {
      setLoadingFetch(false);
    }
  }, []);

  return (
    <>
      <label
        htmlFor="my-modal-4"
        className="
          btn w-max
          border-none  bg-orange-400 hover:bg-orange-400 text-white 
          absolute bottom-10 right-10
        "
      >
        <MdPendingActions size="23px" />
      </label>

      <input type="checkbox" id="my-modal-4" className="modal-toggle" />

      <label htmlFor="my-modal-4" className="modal">
        <label className="modal-box rounded overflow-visible max-w-4xl" htmlFor="">
          <label
            htmlFor="my-modal-4"
            className="btn btn-sm btn-circle absolute"
            style={{ top: '-13px', right: '-13px' }}
          >
            ✕
          </label>

          <div className="overflow-y-auto" style={{ height: 'calc(100vh - 8em)' }}>
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
                  placeholder="Nome da retroespectiva"
                  onChange={handleChangeField}
                  className="input w-full input-bordered rounded focus:outline-none"
                />

                <button type="submit" disabled={loadingSubmit} className="btn btn-square">
                  <IoMdSend size="20px" color="#ffffff" />
                </button>
              </div>
            </form>

            <div className="w-full mt-5 overflow-hidden h-auto">
              <Table data={data} colorHeader="white" headers={['Ação', 'Status']}>
                {({ row, index }: { row: IActions; index: number }) => {
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
                    <tr key={row._id}>
                      <td>
                        <span>{row.name}</span>
                      </td>

                      <td>
                        <select
                          onChange={onChangeSelect}
                          value={row.status}
                          style={{ minWidth: 160 }}
                          className={`select w-full focus:outline-none ${
                            colorsSelect[row.status]
                          }`}
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
                        <Options
                          loadingDelete={'a'}
                          item={'a'}
                          onEdit={handleClickEdit}
                          onDelete={handleClickDelete}
                        />
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

export default ActionsModal;
