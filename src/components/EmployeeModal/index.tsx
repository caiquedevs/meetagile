import { MutableRefObject, useEffect, useRef } from 'react';
import { IEmployee } from '../../interfaces/employee';
import Button from '../Button';
import ConfirmModal from '../ConfirmModal';
import Modal, { ModalInterface } from '../Modal';

type Props = {
  modalRef: MutableRefObject<ModalInterface | undefined>;
  employeeSelected: IEmployee;
  onEdit: (employee: IEmployee) => void;
  onRemove: (employee: IEmployee) => void;
};

export default function EmployeeModal({ modalRef, employeeSelected, ...props }: Props) {
  const confirmModalRef = useRef<ModalInterface>();

  const openConfirmModal = (payload?: any) => confirmModalRef.current?.openModal(payload);

  const onDeleteEmployee = (employee: IEmployee) => {
    console.log('employee', employee);
  };

  const handleClickEdit = () => {
    modalRef.current?.closeModal();
    props.onEdit(employeeSelected);
  };

  const handleClickDelete = () => {
    openConfirmModal(employeeSelected);
    // props.onRemove(employeeSelected);
  };

  const handleClickCloseModal = () => {
    modalRef.current?.closeModal();
  };

  if (!employeeSelected) return null;

  return (
    <>
      <Modal
        ref={modalRef}
        modalChildren={
          <ConfirmModal onConfirm={onDeleteEmployee} modalRef={confirmModalRef} />
        }
      >
        <div className="inline-block w-full max-w-md px-10 py-12 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          <figure className="flex flex-col items-center justify-center gap-5 select-none">
            {employeeSelected?.url ? (
              <div className="avatar">
                <img
                  src={employeeSelected?.url}
                  alt="user image"
                  className="w-16 h-16 rounded-3xl"
                />
              </div>
            ) : (
              <div className="avatar placeholder">
                <div className="w-16 h-16 flex items-center justify-center text-white uppercase rounded-3xl bg-gray-400">
                  <span className="text-2xl font-roboto font-medium">
                    {employeeSelected?.name ? employeeSelected?.name[0] : null}
                  </span>
                </div>
              </div>
            )}

            <figcaption
              style={{ minHeight: '85px' }}
              className="h- flex flex-col items-center justify-center gap-2"
            >
              <strong className="text-base text-center">{employeeSelected.name}</strong>
              <span className="text-base text-center">{employeeSelected.office}</span>
            </figcaption>
          </figure>

          <div className="w-full mt-5 flex flex-col gap-3.5">
            <button
              type="button"
              onClick={handleClickDelete}
              className="btn btn-primary !bg-orange-600"
            >
              Remover
            </button>
          </div>

          <div className="w-full mt-2 flex flex-col gap-3.5">
            <button type="button" onClick={handleClickEdit} className="btn btn-primary">
              Editar
            </button>
          </div>

          <div className="w-full mt-2 flex flex-col gap-3.5">
            <button
              type="button"
              onClick={handleClickCloseModal}
              className="btn btn-outline"
            >
              Fechar
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
