import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../store/modules/rootReducer';
import * as actionsDashboard from '../../store/modules/dashboard/actions';
import * as actionsStep from '../../store/modules/step/actions';

import { useRequest } from '../../hooks/useRequest';
import { IHindsight } from '../../interfaces/hindsight';
import { isUniqueInArray } from '../../utils/isUnique';

import Modal, { ModalInterface } from '../Modal';
import Button from '../Button';
import ShowIf from '../ShowIf';

interface INavigationProps {
  state: {
    formMode: 'create' | 'edit';
    hindsight: IHindsight;
    returnUrl: string;
  };
}

export default function FormHindsight() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const request = useRequest();

  const { state: navigationProps } = location as INavigationProps;

  const { employees, hindsights, actions } = useSelector(
    (state: IRootState) => state.dashboardReducer
  );

  const { hindsightsPending } = useSelector((state: IRootState) => state.stepReducer);

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
    if (employees.length <= 1) {
      return toast.warn('Cadastre mais funcionários para continuar');
    }

    // se tiver pendente no localstorage
    const getCurrent = hindsightsPending?.filter(
      (item) => item.name === navigationProps?.hindsight?.name
    )[0];

    dispatch(actionsStep.setCurrentActions(actions));
    dispatch(actionsStep.setCurrentHindsight(getCurrent || navigationProps?.hindsight));

    // se não tiver setar no estado global que persiste pelo localstorage
    if (!getCurrent) {
      const copyHindsightsPending = hindsightsPending || [];
      copyHindsightsPending.push(navigationProps?.hindsight);
      dispatch(actionsStep.setHindsightsPending([...copyHindsightsPending]));
    }

    navigate('/new-hindsight/step-one', {
      state: { mode: 'update', returnUrl: '/dashboard' },
    });
  };

  const onCreate = () => {
    if (employees.length <= 1) {
      return toast.warn('Cadastre mais funcionários para continuar');
    }

    const isUnique = isUniqueInArray(fields.name, 'name', hindsights);

    if (!isUnique) {
      return toast.warn('Já existe uma retrospectiva com esse nome!');
    }

    const stepThree = employees.map((employee) => ({
      ...employee,
      votedFor: undefined,
      votes: 0,
    }));

    setLoadingSubmit(true);

    request({
      method: 'POST',
      url: '/hindsight/register',
      data: { name: fields.name, stepThree },
    })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess(response: IHindsight) {
      const copyHindsightsPending = [...hindsightsPending];
      copyHindsightsPending.push(response);

      const copyHindsights = [...hindsights];
      copyHindsights.unshift(response);

      dispatch(actionsDashboard.setHindsights(copyHindsights));
      dispatch(actionsStep.setHindsightsPending([...copyHindsightsPending]));
      dispatch(actionsStep.setCurrentHindsight(response));
      dispatch(actionsStep.setCurrentActions(actions));

      navigate('/new-hindsight/step-one', {
        state: { mode: 'create', returnUrl: '/dashboard' },
      });
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

    request({
      method: 'PUT',
      url: `/hindsight`,
      data: { _id: navigationProps.hindsight?._id, name: fields.name },
    })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess() {
      const copyHindsights = hindsights.map((hindsight) => {
        if (hindsight._id === navigationProps.hindsight?._id) {
          hindsight.name = fields.name;
        }
        return hindsight;
      });

      const copyHindsightsPending = hindsightsPending.map((hindsight) => {
        if (hindsight?._id === navigationProps?.hindsight?._id) {
          hindsight.name = fields.name;
        }
        return hindsight;
      });

      dispatch(actionsDashboard.setHindsights(copyHindsights));
      dispatch(actionsStep.setHindsightsPending(copyHindsightsPending));
      setFields({ name: '' });

      modalRef.current?.closeModal();
      toast.success('Alterações salvas com sucesso!', { toastId: 'updateHindsight' });
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
        <div className="inline-block w-full max-w-md px-10 py-12 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-slate-900 shadow-xl rounded-lg">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            {navigationProps.formMode === 'create'
              ? 'Cadastrar retrospectiva'
              : 'Editar retrospectiva'}
          </h3>

          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-white/60">
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
              <Button
                type="submit"
                disabled={fields.name === navigationProps.hindsight?.name}
                loading={loadingSubmit}
                className="btn btn-primary"
              >
                {navigationProps.formMode === 'edit' ? 'Salvar alterações' : 'Começar'}
              </Button>
            </div>

            <ShowIf
              condition={
                navigationProps.formMode === 'edit' &&
                !navigationProps.hindsight.winningEmployee
              }
            >
              <div className="w-full mt-2 flex flex-col gap-3.5">
                <button
                  type="button"
                  onClick={handleClickEditSteps}
                  className="btn btn-outline"
                >
                  Editar etapas
                </button>
              </div>
            </ShowIf>

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
