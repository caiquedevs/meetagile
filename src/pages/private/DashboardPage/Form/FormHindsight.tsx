import {
  ChangeEvent,
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Modal, ShowIf } from '../../../../components';
import { ModalInterface } from '../../../../components/Modal';
import { IAction } from '../../../../interfaces/action';
import { IEmployee } from '../../../../interfaces/employee';
import { IHindsight } from '../../../../interfaces/hindsight';
import request from '../../../../services/api';

interface IData {
  hindsights: IHindsight[];
  employees: IEmployee[];
  actions: IAction;
}

interface PageProps {
  modalRef: MutableRefObject<ModalInterface | undefined>;
  mode: {
    name: 'create' | 'edit';
    payload: {
      item?: IHindsight;
      data: IData;
      setData: Dispatch<SetStateAction<IData>>;
    };
  };
}

export default function FormHindsight({ mode, modalRef }: PageProps) {
  const navigate = useNavigate();
  const { item: currentHindsight, data, setData } = mode.payload;

  const [fields, setFields] = useState({ name: '' });
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const closeModalEmployee = () => modalRef.current?.closeModal();

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFields((oldValue) => ({ ...oldValue, [name]: value }));
  };

  const handleClickEditSteps = () => {
    if (data.employees.length === 0) {
      return toast.warn('Cadastre alguns funcionários para continuar');
    }

    const payload = {
      state: { ...data, hindsight: currentHindsight, hindMode: 'edit' },
    };

    navigate('/new-hindsight/step-one', payload);
  };

  const onCreate = () => {
    if (data.employees.length === 0) {
      return toast.warn('Cadastre alguns funcionários para continuar');
    }

    setLoadingSubmit(true);

    request({
      method: 'POST',
      url: '/hindsight/register',
      data: { name: fields.name },
    })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess(hindsight: IHindsight) {
      const payload = { state: { ...data, hindsight, hindMode: 'create' } };
      navigate('/new-hindsight/step-one', payload);
    }

    function onError(error: any) {
      toast.error(error.data.msg);
    }

    function onFinally() {
      setLoadingSubmit(false);
    }
  };

  const onEdit = () => {
    if (fields.name === currentHindsight?.name) {
      return modalRef.current?.closeModal();
    }

    setLoadingSubmit(true);

    request({
      method: 'PUT',
      url: `/hindsight/${currentHindsight?._id}`,
      data: { name: fields.name },
    })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess() {
      const hindsights = data.hindsights.map((hindsight) => {
        if (hindsight._id === currentHindsight?._id) {
          hindsight.name = fields.name;
        }

        return hindsight;
      });

      setData((old) => ({ ...old, hindsights }));
      modalRef.current?.closeModal();
      toast.success('Alterações salvas com sucesso!');
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
    mode.name === 'edit'
      ? setFields({ name: currentHindsight?.name! })
      : setFields({ name: '' });
    return () => {};
  }, [mode]);

  return (
    <Modal ref={modalRef}>
      <div className="inline-block w-full max-w-md px-10 py-12 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          {mode.name === 'create' ? 'Cadastrar retrospectiva' : 'Editar retrospectiva'}
        </h3>

        <div className="mt-2">
          <p className="text-sm text-gray-500">
            {mode.name === 'create'
              ? 'Preencha os campos abaixo para cadastrar uma nova retrospectiva.'
              : 'Preencha os campos abaixo para editar esta retrospectiva.'}
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
            </div>
          </div>

          <div className="w-full mt-5 flex flex-col gap-3.5">
            <Button type="submit" loading={loadingSubmit} className="btn btn-primary">
              {mode.name === 'edit' ? 'Salvar' : 'Cadastrar'}
            </Button>
          </div>

          <ShowIf condition={mode.name === 'edit'}>
            <div className="w-full mt-2 flex flex-col gap-3.5">
              <button onClick={handleClickEditSteps} className="btn btn-outline">
                Editar etapas
              </button>
            </div>
          </ShowIf>

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
