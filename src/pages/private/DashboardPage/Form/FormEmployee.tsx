import {
  ChangeEvent,
  Dispatch,
  ForwardedRef,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import { IData } from '..';
import { Button, Modal } from '../../../../components';
import { ModalInterface } from '../../../../components/Modal';
import { IEmployee } from '../../../../interfaces/employee';
import request from '../../../../services/api';
import checkChanges from '../../../../utils/checkChanges';

const initialState = {
  name: '',
  office: '',
  url: '',
  _id: '',
};

interface PageProps {
  mode: {
    name: 'create' | 'edit';
    payload: {
      item?: IEmployee;
      data: IData;
      setData: Dispatch<SetStateAction<IData>>;
    };
  };
  modalRef: MutableRefObject<ModalInterface | undefined>;
}

export default function FormEmployee({ mode, modalRef }: PageProps) {
  const { item: currentEmployee, data, setData } = mode.payload;

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [fields, setFields] = useState(initialState);

  const closeModalEmployee = () => modalRef.current?.closeModal();

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFields((oldValue) => ({ ...oldValue, [name]: value }));
  };

  const onCreate = () => {
    setLoadingSubmit(true);

    request({ method: 'POST', url: '/employee/register', data: fields })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess(response: any) {
      const employees = [...data?.employees];
      employees.unshift(response);

      setFields(initialState);
      setData((old) => ({ ...old, employees }));

      modalRef.current?.closeModal();
      toast.success('Funcionário criado com sucesso!');
    }

    function onError(error: any) {
      console.log('error', error);
      toast.success(error.data.msg || 'Opps! não foi possível realizar esta operação');
    }

    function onFinally() {
      setLoadingSubmit(false);
    }
  };

  const onEdit = () => {
    const oldFields = {
      name: currentEmployee?.name!,
      office: currentEmployee?.office!,
      url: currentEmployee?.url!,
      _id: currentEmployee?._id,
    };

    const hasChangedFields = checkChanges(fields, oldFields);

    console.log('hasChangedFields', hasChangedFields);

    if (!hasChangedFields.length) {
      return modalRef.current?.closeModal();
    }

    setLoadingSubmit(true);

    request({ method: 'PUT', url: `/employee/${fields._id}`, data: fields })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess(response: IEmployee) {
      const employees = data.employees.map((employee) => {
        if (employee._id === response._id) return response;
        return employee;
      });

      setData((old) => ({ ...old, employees }));
      modalRef.current?.closeModal();
      toast.success('Dados salvos com sucesso!');
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
    mode.name === 'edit' ? onEdit() : onCreate();
  };

  useEffect(() => {
    if (mode.name === 'edit') {
      setFields({
        name: currentEmployee?.name!,
        office: currentEmployee?.office!,
        url: currentEmployee?.url!,
        _id: currentEmployee?._id!,
      });
    } else {
      setFields(initialState);
    }

    return () => {};
  }, [mode]);

  return (
    <Modal ref={modalRef}>
      <div className="inline-block w-full max-w-md px-10 py-12 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          {mode.name === 'create' ? 'Cadastrar funcionário' : 'Editar funcionário'}
        </h3>

        <div className="mt-2">
          <p className="text-sm text-gray-500">
            {mode.name === 'create'
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
            <Button type="submit" loading={loadingSubmit} className="btn btn-primary">
              {mode.name === 'edit' ? 'Salvar alterações' : 'Cadastrar'}
            </Button>
          </div>

          <div className="w-full mt-2 flex flex-col gap-3.5">
            <button
              type="button"
              onClick={closeModalEmployee}
              className="btn btn-outline"
            >
              Fechar
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
