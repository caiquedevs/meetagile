import { memo, MutableRefObject, ReactNode } from 'react';
import { BsFillTrashFill } from 'react-icons/bs';
import Button from '../Button';
import Modal, { ModalInterface } from '../Modal';

interface ConfirmModalProps {
  modalRef: MutableRefObject<ModalInterface | undefined>;
  onConfirm: () => void;
  loadingConfirm?: boolean;
}

function ConfirmModal({ modalRef, onConfirm, loadingConfirm }: ConfirmModalProps) {
  const handleClickCancel = () => modalRef.current?.closeModalSimple();

  return (
    <Modal ref={modalRef} preventNavigate={true}>
      {() => {
        return (
          <div className="inline-block w-80 max-w-md px-5 py-5 overflow-hidden text-left align-middle transition-all transform bg-white dark:!bg-slate-900 shadow-xl rounded-2xl">
            <div className="w-full text-center flex h-full flex-col justify-between">
              <BsFillTrashFill className="mt-4 w-12 h-12 m-auto text-red-500 text-5xl" />

              <p className="text-black dark:text-white text-xl font-bold mt-4">Remover</p>
              <p className="text-gray-600 dark:text-white/80 text-base py-2 px-6">
                Você deseja remover este item?
              </p>

              <footer className="flex items-center justify-between gap-4 w-full mt-8">
                <Button
                  type="button"
                  onClick={onConfirm}
                  loading={loadingConfirm}
                  className="btn btn-primary !bg-red-500 disabled:!bg-gray-500"
                >
                  Remover
                </Button>

                <button
                  type="button"
                  onClick={handleClickCancel}
                  className="btn btn-outline"
                >
                  Voltar
                </button>
              </footer>
            </div>
          </div>
        );
      }}
    </Modal>
  );
}

export default memo(ConfirmModal);
