import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import classNames from 'classnames';
import { IoMdClose } from 'react-icons/io';

export interface ModalInterface {
  onOpen: () => void;
  onClose: () => void;
  onToogle: () => void;
}

interface Props {
  children: any;
  hiddenScrollBody?: boolean;
  modalStyle?: string;
  containerStyle?: string;
  backDropStyle?: string;
}

function Modal(props: Props, ref: ForwardedRef<ModalInterface | undefined>) {
  const [isOpen, setIsOpen] = useState(false);
  console.log({ isOpen, ref });

  const classContainer = classNames(
    'w-full h-screen fixed inset-0 z-20',
    props.containerStyle
  );

  const classBackDrop = classNames(
    'w-full h-full bg-black/50 overflow-y-scroll z-10 scroll-smooth',
    props.backDropStyle
  );

  const classModal = classNames('mx-auto z-10 animate-scale', props.modalStyle);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  const onToogle = () => setIsOpen(!isOpen);

  useImperativeHandle(
    ref,
    () => ({
      onOpen,
      onClose,
      onToogle,
    }),
    []
  );

  useEffect(() => {
    if (!props.hiddenScrollBody) return;

    let scrollbarWidth = window.innerWidth - document.body.clientWidth + 'px';

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = scrollbarWidth;
    }

    return () => {
      document.body.style.overflow = 'initial';
      document.body.style.paddingRight = 'initial';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <section className={classContainer}>
      <div id="backdrop-modal" className={classBackDrop}>
        <div className={classModal}>
          <button
            type="button"
            onClick={onClose}
            className="
              w-8 h-8 p-0
              flex items-center justify-center 
              absolute -top-3 -right-3 z-10
              bg-gray-700 rounded-full text-white text-lg
            "
          >
            <IoMdClose />
          </button>
          {props.children}
        </div>
      </div>
    </section>
  );
}

export default forwardRef(Modal);
