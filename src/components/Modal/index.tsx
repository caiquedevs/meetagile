import { Dialog, Transition } from '@headlessui/react';
import {
  ForwardedRef,
  forwardRef,
  Fragment,
  ReactNode,
  useImperativeHandle,
  useState,
} from 'react';

export interface ModalInterface {
  closeModal: () => any;
  openModal: (payload?: any) => void;
  toogleModal: () => void;
  getPayload: () => void;
}

interface PageProps {
  children: ReactNode;
  modalChildren?: any;
}

function ModalComponent(props: PageProps, ref: ForwardedRef<ModalInterface | undefined>) {
  let [isOpen, setIsOpen] = useState(false);
  let [payload, setPayload] = useState<any>(undefined);
  console.log('payload', payload);

  const toogleModal = () => setIsOpen(!isOpen);
  const getPayload = () => payload;

  const closeModal = () => {
    setIsOpen(false);
    return payload;
  };

  const openModal = (info: any) => {
    setPayload(info);
    setIsOpen(true);
  };

  useImperativeHandle(
    ref,
    () => ({
      closeModal,
      openModal,
      toogleModal,
      getPayload,
      payload,
    }),
    [payload]
  );

  if (!isOpen) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeModal}
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

          {/* This element is to trick the browser into centering the modal contents. */}
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
            {props.children}
          </Transition.Child>
        </div>

        {props?.modalChildren}
      </Dialog>
    </Transition>
  );
}

export default forwardRef(ModalComponent);
