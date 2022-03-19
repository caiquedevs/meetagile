import { ChangeEvent, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';

import { IEmployee } from '../../../interfaces/employee';
import { IHindsight } from '../../../interfaces/hindsight';
import request from '../../../services/api';

import { Table, Header, Options } from '../../../components';

import { formatDistanceStrict } from 'date-fns';
import { pt } from 'date-fns/locale';
import { IAction } from '../../../interfaces/action';

type HindsightFormProps = {};

export default function HindsightsForm({}: HindsightFormProps) {
  const whiteList = ['/new-hindsight', '/new-hindsight/'];

  const location = useLocation();
  const navigate = useNavigate();

  const [hindsight, setHindsights] = useState<IHindsight[]>([]);
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [actions, setActions] = useState<IAction>({} as IAction);

  const [hindsightName, setHindsightName] = useState('');
  const [loadingDelete, setLoadingDelete] = useState<string>('');
  const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    setHindsightName(event.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (!Boolean(employees.length)) {
      return toast.warn('Cadastre alguns funcionários primeiro!');
    }

    setLoadingSubmit(true);

    request({ method: 'POST', url: '/hindsight/register', data: { name: hindsightName } })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess(response: IHindsight) {
      navigate('step-one', { state: { hindsight: response, employees, actions } });
    }

    function onError(error: any) {
      toast.error(error.data.msg);
    }

    function onFinally() {
      setLoadingSubmit(false);
    }
  };

  const onEdit = (hindsight: IHindsight) => {
    if (!Boolean(employees.length)) {
      return toast.warn('Cadastre alguns funcionários primeiro!');
    }

    navigate('step-one', { state: { hindsight, employees, actions } });
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
      <Header title="Minhas retrospectivas" subTitle="Criar nova retrospectiva" />

      <div className="w-full mt-8 flex flex-col">
        <div className="flex flex-col">
          <label className="label">
            <span className="label-text font-roboto text-base text-gray-700 dark:text-white">
              Preencha os campos a baixo
            </span>
          </label>

          <form onSubmit={handleSubmit} className="flex gap-2">
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
            headers={['Nome', 'Criado', 'Alterado', 'Status', 'Destaque']}
            loadingFetch={loadingFetch}
            className="animate-fadeIn"
          >
            {(props: { row: IHindsight }) => {
              const handleClickEdit = () => onEdit(props.row);
              const handleClickDelete = () => onDelete(props.row._id);

              return (
                <tr key={props.row?._id}>
                  <td>
                    <span>{props.row?.name}</span>
                  </td>

                  <td>
                    <span>
                      {formatDistanceStrict(new Date(props.row?.createdAt), new Date(), {
                        locale: pt,
                      })}
                    </span>
                  </td>

                  <td>
                    <span>
                      {formatDistanceStrict(new Date(props.row?.updatedAt), new Date(), {
                        locale: pt,
                      })}
                    </span>
                  </td>

                  <td>
                    {props.row?.employee_id?.name ? (
                      <span className="text-green-500 font-medium">Finalizado</span>
                    ) : (
                      <span className="text-yellow-500 font-medium">Pendente</span>
                    )}
                  </td>
                  <td>
                    <span>{props.row?.employee_id?.name || 'Nenhum'}</span>
                  </td>

                  <td>
                    <Options
                      loadingDelete={loadingDelete}
                      item={props.row!}
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
    </>
  );
}
