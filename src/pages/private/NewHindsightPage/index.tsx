import { ChangeEvent, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { IEmployee } from '../../../interfaces/employee';
import { HindsightProps } from '../../../interfaces/hindsight';
import request from '../../../services/api';

import { Table, Header, Container, Options } from '../../../components';
import { format, formatDistance, formatDistanceStrict } from 'date-fns';
import { pt } from 'date-fns/locale';

function NewHindsightPages() {
  const location = useLocation();
  const navigate = useNavigate();

  const whiteList = ['/new-hindsight', '/new-hindsight/'];

  const [data, setData] = useState<HindsightProps[]>([]);
  const [employees, setEmployees] = useState<IEmployee[]>();
  const [loadingDelete, setLoadingDelete] = useState<string>('');
  const [loadingFetch, setLoadingFetch] = useState<boolean>(false);
  const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false);
  const [hindsightName, setHindsightName] = useState('');

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    setHindsightName(event.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoadingSubmit(true);

    request({ method: 'POST', url: '/hindsight/register', data: { name: hindsightName } })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess(response: HindsightProps) {
      navigate('step-one', { state: { hindsight: response, employees } });
    }

    function onError(error: any) {
      toast.error(error.data.msg);
    }

    function onFinally() {
      setLoadingSubmit(false);
    }
  };

  const onEdit = (hindsight: HindsightProps) => {
    navigate('step-one', { state: { hindsight, employees } });
  };

  const onDelete = (id: string) => {
    setLoadingDelete(id);

    request({ method: 'DELETE', url: `/hindsight/${id}` })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess(response: any) {
      setData((oldData) => oldData.filter((item) => item._id !== id));
      toast.success('Retroespectiva deletada com sucesso!', {
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
      setData(response);
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

  if (whiteList.includes(location.pathname)) {
    return (
      <Container className="bg-white dark:bg-gray-50">
        <Header title="Minhas retroespectivas" subTitle="Criar nova retroespectiva" />

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
                placeholder="Nome da retroespectiva"
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
              data={data}
              colorHeader="black"
              headers={['Nome', 'Criado', 'Alterado', 'Status', 'Destaque']}
              loadingFetch={loadingFetch}
              className="animate-fadeIn"
            >
              {(props: { row: HindsightProps }) => {
                const handleClickEdit = () => onEdit(props.row);
                const handleClickDelete = () => onDelete(props.row._id);

                return (
                  <tr key={props.row?._id}>
                    <td>
                      <span>{props.row?.name}</span>
                    </td>

                    <td>
                      <span>
                        {formatDistanceStrict(
                          new Date(props.row?.createdAt),
                          new Date(),
                          {
                            locale: pt,
                          }
                        )}
                      </span>
                    </td>

                    <td>
                      <span>
                        {formatDistanceStrict(
                          new Date(props.row?.updatedAt),
                          new Date(),
                          {
                            locale: pt,
                          }
                        )}
                      </span>
                    </td>

                    <td>
                      {props.row?.employee?.name ? (
                        <span className="text-green-500 font-medium">Finalizado</span>
                      ) : (
                        <span className="text-yellow-500 font-medium">Pendente</span>
                      )}
                    </td>
                    <td>
                      <span>{props.row?.employee?.name || 'Nenhum'}</span>
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
        <Outlet />
      </Container>
    );
  }

  return (
    <Container>
      <Outlet />
    </Container>
  );
}

export default NewHindsightPages;
