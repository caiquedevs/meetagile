import { memo, MutableRefObject, ReactNode } from 'react';
import { BsFillTrashFill } from 'react-icons/bs';
import Modal, { ModalInterface } from '../Modal';

interface ConfirmModalProps {
  modalRef: MutableRefObject<ModalInterface | undefined>;
  onConfirm: (payload: any) => void;
}

function ConfirmModal({ modalRef, onConfirm }: ConfirmModalProps) {
  const handleClickConfirm = () => {
    const payload = modalRef.current?.closeModal();
    onConfirm(payload);
  };

  const handleClickCancel = () => modalRef.current?.closeModal();

  return (
    <Modal ref={modalRef}>
      <div className="inline-block w-80 max-w-md px-5 py-5 overflow-hidden text-left align-middle transition-all transform bg-white dark:!bg-gray-800 shadow-xl rounded-2xl">
        <div className="w-full text-center flex h-full flex-col justify-between">
          <BsFillTrashFill className="mt-4 w-12 h-12 m-auto text-red-500 text-5xl" />

          <p className="text-gray-800 dark:text-gray-200 text-xl font-bold mt-4">
            Remover
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-base py-2 px-6">
            Você deseja remover este item?
          </p>

          <footer className="flex items-center justify-between gap-4 w-full mt-8">
            <button
              type="button"
              onClick={handleClickConfirm}
              className="btn btn-primary !bg-red-500"
            >
              Remover
            </button>

            <button type="button" onClick={handleClickCancel} className="btn btn-outline">
              Fechar
            </button>
          </footer>
        </div>
      </div>
    </Modal>
  );
}

export default memo(ConfirmModal);
