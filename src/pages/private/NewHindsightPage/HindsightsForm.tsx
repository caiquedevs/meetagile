import { ChangeEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatDistanceStrict } from 'date-fns';
import { toast } from 'react-toastify';
import { pt } from 'date-fns/locale';
import { RiEye2Line } from 'react-icons/ri';

import { IEmployee } from '../../../interfaces/employee';
import { IHindsight } from '../../../interfaces/hindsight';
import { IAction } from '../../../interfaces/action';
import request from '../../../services/api';

import { Table, Header, Options } from '../../../components';

export default function HindsightsForm() {
  const location = useLocation();
  const navigate = useNavigate();

  const whiteList = ['/new-hindsight', '/new-hindsight/'];

  const [hindsight, setHindsights] = useState<IHindsight[]>([]);
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [actions, setActions] = useState<IAction>({} as IAction);

  const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<string>('');
  const [hindsightName, setHindsightName] = useState<string>('');

  const headersTable = [
    {
      label: 'Nome',
      value: 'name',
    },
    {
      label: 'Criado',
      value: 'created_at',
      className: 'hidden sm:table-cell',
    },
    {
      label: 'Alterado',
      value: 'updated_at',
      className: 'hidden lg:table-cell',
    },
    {
      label: 'Status',
      value: 'name',
    },
    {
      label: 'Destaque',
      value: 'name',
      className: 'hidden lg:table-cell',
    },
  ];

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    setHindsightName(event.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const hindMode = 'create';

    if (!Boolean(employees.length)) {
      return toast.warn('Cadastre alguns funcionários primeiro!');
    }

    setLoadingSubmit(true);

    request({ method: 'POST', url: '/hindsight/register', data: { name: hindsightName } })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess(response: IHindsight) {
      navigate('step-one', {
        state: { hindsight: response, employees, actions, hindMode },
      });
    }

    function onError(error: any) {
      toast.error(error.data.msg);
    }

    function onFinally() {
      setLoadingSubmit(false);
    }
  };

  const onEdit = (hindsight: IHindsight) => {
    const hindMode = 'edit';

    if (!Boolean(employees.length)) {
      return toast.warn('Cadastre alguns funcionários primeiro!');
    }

    navigate('step-one', { state: { hindsight, employees, actions, hindMode } });
  };

  const onDelete = (id: string) => {
    setLoadingDelete(id);

    request({ method: 'DELETE', url: `/hindsight/${id}` })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess(response: any) {
      setHindsights((oldData) => oldData.filter((item) => item._id !== id));
      toast.success('Retrospectiva deletada com sucesso!', {
        toastId: 'toastDeleteSuccess',
      });
    }

    function onError(error: any) {
      toast.error(error.data.msg);
    }

    function onFinally() {
      setLoadingDelete('');
    }
  };

  const onPreview = (hindsight: IHindsight) => {
    const hindMode = 'view';
    navigate('step-one', { state: { hindsight, employees, actions, hindMode } });
  };

  useEffect(() => {
    if (!whiteList.includes(location.pathname)) return;

    setLoadingFetch(true);

    request({ method: 'GET', url: '/hindsights' })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess(response: any) {
      setHindsights(response);
    }

    function onError(error: any) {
      toast.error(error.data.msg);
    }

    function onFinally() {
      setLoadingFetch(false);
    }
  }, []);

  useEffect(() => {
    if (!whiteList.includes(location.pathname)) return;
    request({ method: 'GET', url: '/employees' }).then(onSuccess).catch(onError);

    function onSuccess(response: any) {
      setEmployees(response);
    }

    function onError(error: any) {
      toast.error(error.data.msg);
    }
  }, []);

  useEffect(() => {
    if (!whiteList.includes(location.pathname)) return;

    request({ method: 'GET', url: '/actions' }).then(onSuccess).catch(onError);

    function onSuccess(response: IAction) {
      setActions(response);
    }

    function onError(error: any) {
      toast.error(error.data.msg);
    }
  }, []);

  return (
    <>
      <Header subTitle="Minhas retrospectivas" title="Gerenciar retrospectivas" />

      <div className="w-full -mt-16 flex flex-col pb-16 md:pb-16 px-8 md:px-14">
        <div className="flex flex-col">
          <label className="label">
            <span className="label-text font-roboto text-base text-gray-700 dark:text-white">
              Preencha os campos a baixo
            </span>
          </label>

          <form onSubmit={handleSubmit} className="flex gap-2 flex-col sm:flex-row">
            <input
              type="text"
              name="hindsightName"
              value={hindsightName}
              required={true}
              placeholder="Nome da retrospectiva"
              onChange={handleChangeField}
              className="input input-bordered sm:w-full lg:w-7/12 xl:w-4/12 rounded focus:outline-none"
            />

            <button
              type="submit"
              disabled={loadingSubmit}
              className="btn btn-primary px-10 disabled:loading animate-none"
            >
              Iniciar
            </button>
          </form>
        </div>

        <div className="w-full mt-11">
          <Table
            data={hindsight}
            colorHeader="black"
            headers={headersTable}
            loadingFetch={loadingFetch}
            className="animate-fadeIn"
          >
            {(props: { row: IHindsight }) => {
              const handleClickEdit = () => onEdit(props.row);
              const handleClickPreview = () => onPreview(props.row);
              const handleClickDelete = () => onDelete(props.row._id);

              return (
                <tr key={props.row?._id}>
                  <td>
                    <span>{props.row?.name}</span>
                  </td>

                  <td className="hidden sm:table-cell">
                    <span>
                      {formatDistanceStrict(new Date(props.row?.createdAt), new Date(), {
                        locale: pt,
                      })}
                    </span>
                  </td>

                  <td className="hidden lg:table-cell">
                    <span>
                      {formatDistanceStrict(new Date(props.row?.updatedAt), new Date(), {
                        locale: pt,
                      })}
                    </span>
                  </td>

                  <td>
                    {props.row?.winningEmployee?.name ? (
                      <span className="text-green-500 font-medium">Finalizado</span>
                    ) : (
                      <span className="text-yellow-500 font-medium">Pendente</span>
                    )}
                  </td>

                  <td className="hidden lg:table-cell">
                    <span>{props.row?.winningEmployee?.name || 'Nenhum'}</span>
                  </td>

                  <td>
                    <Options
                      loadingDelete={loadingDelete}
                      item={props.row!}
                      onEdit={handleClickEdit}
                      onDelete={handleClickDelete}
                    >
                      {props.row?.winningEmployee?.name ? (
                        <li>
                          <button
                            type="button"
                            onClick={handleClickPreview}
                            className="
                            btn 
                            font-medium text-gray-600 hover:bg-gray-200 active:text-white 
                            border-none bg-transparent active:bg-primary-light dark:active:bg-primary-dark
                          "
                          >
                            Relatório
                          </button>
                        </li>
                      ) : null}
                    </Options>
                  </td>
                </tr>
              );
            }}
          </Table>
        </div>
      </div>
    </>
  );
}
