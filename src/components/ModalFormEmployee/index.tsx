import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Modal } from '..';
import { ModalInterface } from '../Modal';
import { IEmployee } from '../../interfaces/employee';
import { useRequest } from '../../hooks/useRequest';
import checkChanges from '../../utils/checkChanges';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '../../store/modules/rootReducer';
import * as actionsDashboard from '../../store/modules/dashboard/actions';

const initialState = {
  name: '',
  office: '',
  url: '',
  _id: '',
};

interface PropsPage {
  state: {
    formMode: 'create' | 'edit';
    employee: IEmployee;
    returnUrl: string;
  };
}

export default function FormEmployee({}: any) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const request = useRequest();

  const { state: navigationProps } = location as PropsPage;

  const modalRef = useRef<ModalInterface>();

  const { employees } = useSelector((state: IRootState) => state.dashboardReducer);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [fields, setFields] = useState(initialState);

  const oldFields = {
    name: navigationProps.employee?.name!,
    office: navigationProps.employee?.office!,
    url: navigationProps.employee?.url!,
    _id: navigationProps.employee?._id,
  };

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFields((oldValue) => ({ ...oldValue, [name]: value }));
  };

  const onCloseModal = () => {
    navigate(-1);
  };

  const onCreate = () => {
    setLoadingSubmit(true);

    request({ method: 'POST', url: '/employee/register', data: fields })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess(response: any) {
      const copyEmployees = [...employees];
      copyEmployees.unshift(response);

      dispatch(actionsDashboard.setEmployees(copyEmployees));
      setFields(initialState);

      modalRef.current?.closeModal();
      toast.success('Funcionário criado com sucesso!', { toastId: 'createEmployee' });
    }

    function onError(error: any) {
      toast.error(error.data.msg);
    }

    function onFinally() {
      setLoadingSubmit(false);
    }
  };

  const onEdit = () => {
    setLoadingSubmit(true);

    request({ method: 'PUT', url: `/employee/${fields._id}`, data: fields })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess(response: IEmployee) {
      const copyEmployees = employees.map((employee) => {
        if (employee._id === response._id) return response;
        return employee;
      });

      dispatch(actionsDashboard.setEmployees(copyEmployees));
      setFields(initialState);

      modalRef.current?.closeModal();
      toast.success('Dados salvos com sucesso!', { toastId: 'updateEmployee' });
    }

    function onError(error: any) {
      toast.error(error.data.msg);
    }

    function onFinally() {
      setLoadingSubmit(false);
    }
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    navigationProps.formMode === 'edit' ? onEdit() : onCreate();
  };

  useEffect(() => {
    if (!navigationProps) return navigate('/dashboard');

    modalRef.current?.openModal();

    if (navigationProps.formMode === 'edit') {
      setFields({
        name: navigationProps.employee?.name!,
        office: navigationProps.employee?.office!,
        url: navigationProps.employee?.url!,
        _id: navigationProps.employee?._id!,
      });
    } else {
      setFields(initialState);
    }

    return () => {};
  }, [navigationProps?.formMode]);

  if (!navigationProps) return <></>;

  return (
    <Modal ref={modalRef} returnUrl={navigationProps.returnUrl}>
      {() => (
        <div className="inline-block w-full max-w-md px-10 py-12 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:!bg-slate-900 shadow-xl rounded-lg">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            {navigationProps.formMode === 'create'
              ? 'Cadastrar funcionário'
              : 'Editar funcionário'}
          </h3>

          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-white/60">
              {navigationProps.formMode === 'create'
                ? 'Preencha os campos abaixo para cadastrar uma novo funcionário para suas próximas retrospectivas.'
                : 'Preencha os campos abaixo para editar este funcionário.'}
            </p>
          </div>

          <form className="mt-4 flex flex-col flex-1" onSubmit={handleSubmit}>
            <div className="w-full flex flex-col">
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  name="name"
                  value={fields.name}
                  required={true}
                  placeholder="Nome *"
                  onChange={handleChangeField}
                  className="input input-primary"
                />

                <input
                  type="text"
                  name="office"
                  value={fields.office}
                  required={true}
                  placeholder="Posição *"
                  onChange={handleChangeField}
                  className="input input-primary"
                />

                <input
                  type="text"
                  name="url"
                  value={fields.url}
                  placeholder="Url da imagem"
                  onChange={handleChangeField}
                  className="input input-primary"
                />
              </div>
            </div>

            <div className="w-full mt-5 flex flex-col gap-3.5">
              <Button
                type="submit"
                loading={loadingSubmit}
                disabled={!checkChanges(fields, oldFields).length}
                className="btn btn-primary"
              >
                {navigationProps.formMode === 'edit' ? 'Salvar alterações' : 'Cadastrar'}
              </Button>
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
