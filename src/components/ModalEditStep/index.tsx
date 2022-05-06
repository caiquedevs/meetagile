import React, {
  ChangeEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useState,
} from 'react';
import Modal, { ModalInterface } from '../Modal';

interface IPayloadModal {
  index: number;
  description?: string;
}

interface PropsPage {
  modalRef: MutableRefObject<ModalInterface | undefined>;
  onConfirm: () => void;
}

export default function ModalEditStep({ modalRef, onConfirm }: PropsPage) {
  const onCloseModal = () => {
    modalRef.current?.closeModalSimple();
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    onConfirm();
  };

  return (
    <Modal ref={modalRef} preventNavigate={true}>
      {(payloadModal: IPayloadModal) => {
        const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
          const { value } = event.currentTarget;
          modalRef.current?.setPayload({ ...payloadModal, description: value });
        };

        return (
          <div className="inline-block w-full max-w-md px-10 py-12 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-slate-900 shadow-xl rounded-lg">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Editar opnião
            </h3>

            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-white/80">
                Preencha os campos abaixo para editar esta opnião.
              </p>
            </div>

            <form className="mt-4 flex flex-col flex-1" onSubmit={handleSubmit}>
              <div className="w-full flex flex-col">
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    name="description"
                    value={payloadModal.description}
                    required={true}
                    placeholder="Opnião *"
                    onChange={handleChangeField}
                    className="input input-primary"
                  />
                </div>
              </div>

              <div className="w-full mt-5 flex flex-col gap-3.5">
                <button type="submit" className="btn btn-primary">
                  Salvar alterações
                </button>
              </div>

              <div className="w-full mt-2 flex flex-col gap-3.5">
                <button type="button" onClick={onCloseModal} className="btn btn-outline">
                  Voltar
                </button>
              </div>
            </form>
          </div>
        );
      }}
    </Modal>
  );
}
