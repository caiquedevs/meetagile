import { ForwardedRef, forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  returnUrl?: string;
  callbackBackDrop?: () => void;
  blockScroll?: boolean;
  disableBackdrop?: boolean;
}

function ModalGeneric(props: PageProps, ref: ForwardedRef<ModalInterface | undefined>) {
  const navigate = useNavigate();

  const backdropRef = useRef<HTMLDivElement>(null);
  let [isOpen, setIsOpen] = useState(false);
  let [payloadModal, setPayloadModal] = useState<any>(undefined);

  if (backdropRef.current) {
    backdropRef.current.onclick = (e: any) => alert('id ' + e.target.id);
  }

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

  const closeModalSimple = () => {
    setPayloadModal(undefined);
    setIsOpen(false);
  };

  const toogleModal = () => setIsOpen(!isOpen);

  const handleClickBackdrop = () => {
    if (props.disableBackdrop) return;

    if (props.callbackBackDrop) {
      props.callbackBackDrop();
    } else {
      props.preventNavigate ? closeModalSimple() : closeModal();
    }
  };

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

  useEffect(() => {
    if (isOpen && props.blockScroll) document.body.style.overflow = 'hidden';
    if (!isOpen && props.blockScroll) document.body.style.overflow = 'initial';

    return () => {};
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="flex flex-col items-center justify-center z-10 animate-fadeIn !duration-75 ">
      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center text-center">
          <div
            onClick={handleClickBackdrop}
            className="fixed inset-0 bg-black/70 dark:bg-white/20 transition-opacity"
          />

          <div className="flex justify-center min-w-max bg-transparent my-8 bg-white">
            {props.children(payloadModal)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default forwardRef(ModalGeneric);
