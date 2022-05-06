import { ChangeEvent, MutableRefObject, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Modal } from '..';
import { ModalInterface } from '../Modal';
import { useSelector, useDispatch } from 'react-redux';
import { IRootState } from '../../store/modules/rootReducer';
import * as actionsStep from '../../store/modules/step/actions';

import { INavigationStepProps } from '../../interfaces/navigationStep';

const initialState = {
  employeeName: '',
  description: '',
};

interface IPropsPage {
  modalRef: MutableRefObject<ModalInterface | undefined>;
}

export default function ModalRandomComment({ modalRef }: IPropsPage) {
  const dispatch = useDispatch();
  const location = useLocation();

  const { state: navigationProps } = location as INavigationStepProps;

  const { currentHindsight } = useSelector((state: IRootState) => state.stepReducer);
  const [fields, setFields] = useState(initialState);

  const onReset = () => {
    setFields(initialState);
  };

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFields((oldValue) => ({ ...oldValue, [name]: value }));
  };

  const onCloseModal = () => {
    modalRef.current?.closeModalSimple();
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const payload = {
      employeeName: fields.employeeName,
      description: fields.description,
      votes: 0,
    };

    const copyHindsight = { ...currentHindsight };

    if (location.pathname.includes('step-one')) {
      copyHindsight.stepOne.push(payload);
    } else if (location.pathname.includes('step-two')) {
      copyHindsight.stepTwo.push(payload);
    }

    dispatch(actionsStep.setCurrentHindsight(copyHindsight));
    onCloseModal();
    onReset();
  };

  if (!navigationProps) return <></>;

  return (
    <Modal ref={modalRef} preventNavigate={true}>
      {() => (
        <div className="inline-block w-full max-w-md px-10 py-12 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-slate-900 shadow-xl rounded-lg">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
            Cadastrar opnião avulsa
          </h3>

          <div className="mt-2">
            <p className="text-sm text-gray-500 dark:text-white/80">
              Preencha os campos abaixo para cadastrar uma nova opnião avulsa
            </p>
          </div>

          <form className="mt-4 flex flex-col flex-1" onSubmit={handleSubmit}>
            <div className="w-full flex flex-col">
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  name="employeeName"
                  value={fields.employeeName}
                  required={true}
                  placeholder="Nome da pessoa *"
                  onChange={handleChangeField}
                  className="input input-primary"
                />

                <input
                  type="text"
                  name="description"
                  value={fields.description}
                  required={true}
                  placeholder="Opnião *"
                  onChange={handleChangeField}
                  className="input input-primary"
                />
              </div>
            </div>

            <div className="w-full mt-5 flex flex-col gap-3.5">
              <button type="submit" disabled={false} className="btn btn-primary">
                Cadastrar
              </button>
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
