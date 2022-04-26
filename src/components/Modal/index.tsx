import { useNavigate } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { ForwardedRef, forwardRef, Fragment, useImperativeHandle, useState } from 'react';

export interface ModalInterface {
  closeModal: () => any;
  openModal: (payload?: any) => void;
  toogleModal: () => void;
  closeModalSimple: () => void;
  payload: any;
  setPayload: (payload: any) => void;
}

interface PageProps {
  children: any;
  preventNavigate?: boolean;
  modalChildren?: any;
  returnUrl?: string;
}

function ModalComponent(props: PageProps, ref: ForwardedRef<ModalInterface | undefined>) {
  const navigate = useNavigate();

  let [isOpen, setIsOpen] = useState(false);
  let [payloadModal, setPayloadModal] = useState<any>(undefined);

  const setPayload = (value: any) => {
    setPayloadModal(value);
  };

  const openModal = (payload?: any) => {
    setPayloadModal(payload);
    setIsOpen(true);
  };

  const closeModal = () => {
    const url: any = props.returnUrl || -1;

    setPayloadModal(undefined);
    setIsOpen(false);
    navigate(url);
  };

  const closeModalSimple = () => setIsOpen(false);
  const toogleModal = () => setIsOpen(!isOpen);

  useImperativeHandle(
    ref,
    () => ({
      payload: payloadModal,
      setPayload: setPayload,
      openModal,
      toogleModal,
      closeModal,
      closeModalSimple,
    }),
    [payloadModal]
  );

  if (!isOpen) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={props.preventNavigate ? closeModalSimple : closeModal}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {props.children(payloadModal)}
          </Transition.Child>
        </div>

        {props?.modalChildren}
      </Dialog>
    </Transition>
  );
}

export default forwardRef(ModalComponent);
