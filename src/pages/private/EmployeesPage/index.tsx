import { ChangeEvent, useEffect, useState } from 'react';
import { IEmployee } from '../../../interfaces/employee';
import { toast } from 'react-toastify';

import { Header, EmployeeList, Container } from '../../../components';
import request from '../../../services/api';

import './styles.css';

type IMode = 'edit' | 'create';

const initialState = {
  name: '',
  office: '',
  url: '',
  _id: '',
};

export default function EmployeesPage() {
  const [mode, setMode] = useState('create' as IMode);

  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [fields, setFields] = useState(initialState);

  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState('');

  const handleClickEdit = (employee: IEmployee) => {
    setFields({
      name: employee.name,
      office: employee.office,
      url: employee.url,
      _id: employee._id!,
    });

    setMode('edit');
  };

  const onDelete = (id: string) => {
    setLoadingDelete(id);

    request({ method: 'DELETE', url: `/employee/${id}` })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess() {
      setEmployees(employees.filter((employee) => employee._id !== id));
      toast.success('Funcionário deletado com sucesso!');
    }

    function onError(error: any) {
      toast.error(error.data.msg || 'Opps! não foi possível realizar esta operação');
    }

    function onFinally() {
      setLoadingDelete('');
    }
  };

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFields((oldValue) => ({ ...oldValue, [name]: value }));
  };

  const onEdit = (employee: IEmployee) => {
    request({ method: 'PUT', url: `/employee/${employee._id}`, data: employee })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess(response: IEmployee) {
      const editable = employees.map((item) => {
        if (item._id === response._id) return response;
        return item;
      });

      setEmployees(editable);
      setFields(initialState);
      toast.success('Dados salvos com sucesso!');
    }

    function onError(error: any) {
      toast.error(error.data.msg);
    }

    function onFinally() {
      setMode('create');
      setLoadingCreate(false);
    }
  };

  const onCreate = (payload: any) => {
    request({ method: 'POST', url: '/employee/register', data: payload })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess(response: any) {
      const copyArr = [...employees];
      copyArr.unshift(response);

      setEmployees(copyArr);
      setFields(initialState);
      toast.success('Funcionário criado com sucesso!');
    }

    function onError(error: any) {
      toast.success(error.data.msg || 'Opps! não foi possível realizar esta operação');
    }

    function onFinally() {
      setMode('create');
      setLoadingCreate(false);
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setLoadingCreate(true);

    mode === 'edit' ? onEdit(fields) : onCreate(fields);
  };

  useEffect(() => {
    request({ method: 'GET', url: '/employees' })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess(response: any) {
      setEmployees(response);
    }

    function onError(error: any) {
      toast.error(error.data.msg);
    }

    function onFinally() {
      setLoadingFetch(false);
    }

    return () => {};
  }, []);

  return (
    <section className="container-employees-page">
      <Header title="Gerenciar funcionários" subTitle="Meus funcionários" />

      <section className="w-full flex flex-col lg:flex-row gap-10 lg:gap-16 pb-16 md:pb-16 px-8 md:px-14">
        <form className="flex flex-col flex-1 -mt-16" onSubmit={handleSubmit}>
          <div className="w-full  flex flex-col">
            <label className="label">
              <span className="label-text font-roboto text-base text-gray-700 dark:text-white">
                Preencha os campos a baixo
              </span>
            </label>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                name="name"
                value={fields.name}
                required={true}
                placeholder="Nome *"
                onChange={handleChangeField}
                className="input input-bordered w-full rounded-md focus:outline-none"
              />
              <input
                type="text"
                name="office"
                value={fields.office}
                required={true}
                placeholder="Posição *"
                onChange={handleChangeField}
                className="input input-bordered w-full rounded-md focus:outline-none"
              />

              <input
                type="text"
                name="url"
                value={fields.url}
                placeholder="Url da imagem"
                onChange={handleChangeField}
                className="input input-bordered w-full rounded-md focus:outline-none"
              />
            </div>
          </div>

          <div className="w-full mt-7 flex flex-col gap-3.5">
            <button
              type="submit"
              disabled={loadingCreate}
              className="btn btn-primary disabled:loading animate-none"
            >
              {mode === 'edit' ? 'Salvar alterações' : 'Cadastrar'}
            </button>
          </div>
        </form>

        {loadingFetch || (!loadingFetch && !employees.length) ? (
          <div className="flex flex-col flex-1">
            {loadingFetch ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                style={{
                  margin: 'auto',
                  background: 'none',
                  display: 'block',
                  shapeRendering: 'auto',
                }}
                width="48px"
                height="48px"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid"
              >
                <circle
                  cx="50"
                  cy="50"
                  fill="none"
                  className="stroke-sky-500 dark:stroke-gray-500"
                  stroke-width="10"
                  r="35"
                  stroke-dasharray="164.93361431346415 56.97787143782138"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    repeatCount="indefinite"
                    dur="1s"
                    values="0 50 50;360 50 50"
                    keyTimes="0;1"
                  ></animateTransform>
                </circle>
              </svg>
            ) : null}

            {!loadingFetch && !employees.length ? (
              <div className="flex flex-1">
                <div
                  className="
                w-full h-16 p-6 flex items-center justify-center text-center rounded animate-fadeIn
              bg-white border 
              text-gray-500 "
                >
                  <span>Nenhum conteudo a mostrar por enquanto!</span>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {!loadingFetch && employees.length > 0 ? (
          <EmployeeList
            employees={employees}
            onEdit={handleClickEdit}
            onDelete={onDelete}
            loadingDelete={loadingDelete}
          />
        ) : null}
      </section>
    </section>
  );
}
