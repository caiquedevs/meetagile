import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import request from '../../services/api';

import { ModalInterface } from '../Modal';
import { IHindsight } from '../../interfaces/hindsight';
import { useDashboard } from '../../hooks/useDashboard';

import { Button, Modal, ShowIf } from '..';
import { IStepProps } from '../../interfaces/stepProps';

interface PropsPage {
  state: {
    formMode: 'create' | 'edit';
    hindsight: IHindsight;
    returnUrl: string;
  };
}

export default function FormHindsight() {
  const navigate = useNavigate();
  const location = useLocation();

  const { data, setData } = useDashboard();
  const { state: navigationProps } = location as PropsPage;

  const modalRef = useRef<ModalInterface>();

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [fields, setFields] = useState({ name: '' });

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFields((oldValue) => ({ ...oldValue, [name]: value }));
  };

  const onCloseModal = () => {
    navigate(navigationProps.returnUrl);
  };

  const handleClickEditSteps = () => {
    if (data.employees.length <= 1) {
      return toast.warn('Cadastre mais funcionários para continuar');
    }

    const payload: IStepProps = {
      state: {
        actions: data.actions,
        hindsight: { ...navigationProps.hindsight },
        mode: 'update',
      },
    };

    navigate('/new-hindsight/step-one', payload);
  };

  const onCreate = () => {
    if (data.employees.length <= 1) {
      return toast.warn('Cadastre mais funcionários para continuar');
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
      const payload: IStepProps = {
        state: {
          actions: data.actions,
          hindsight: hindsight,
          mode: 'create',
        },
      };

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
    if (fields.name === navigationProps.hindsight?.name) {
      return modalRef.current?.closeModal();
    }

    setLoadingSubmit(true);

    request({
      method: 'PUT',
      url: `/hindsight/${navigationProps.hindsight?._id}`,
      data: { name: fields.name },
    })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess() {
      const hindsights = data.hindsights.map((hindsight) => {
        if (hindsight._id === navigationProps.hindsight?._id) {
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
    navigationProps.formMode === 'edit' ? onEdit() : onCreate();
  };

  useEffect(() => {
    if (!navigationProps) return navigate('/dashboard');

    modalRef.current?.openModal();

    navigationProps.formMode === 'edit'
      ? setFields({ name: navigationProps.hindsight?.name! })
      : setFields({ name: '' });
    return () => {};
  }, [navigationProps?.formMode]);

  if (!navigationProps) return <></>;

  return (
    <Modal ref={modalRef} returnUrl={navigationProps.returnUrl}>
      {() => (
        <div className="inline-block w-full max-w-md px-10 py-12 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {navigationProps.formMode === 'create'
              ? 'Cadastrar retrospectiva'
              : 'Editar retrospectiva'}
          </h3>

          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {navigationProps.formMode === 'create'
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
                {navigationProps.formMode === 'edit' ? 'Salvar' : 'Cadastrar'}
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
