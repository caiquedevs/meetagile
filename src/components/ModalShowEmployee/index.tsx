import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BsFillTrashFill } from 'react-icons/bs';
import { toast } from 'react-toastify';

import { useDispatch, useSelector } from 'react-redux';
import * as actionsDashboard from '../../store/modules/dashboard/actions';

import { useRequest } from '../../hooks/useRequest';
import { IEmployee } from '../../interfaces/employee';

import ConfirmModal from '../ConfirmModal';
import Modal, { ModalInterface } from '../Modal';
import { IRootState } from '../../store/modules/rootReducer';

interface INavigationProps {
  state: {
    employee: IEmployee;
    returnUrl: string;
  };
}

export default function EmployeeModal() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const request = useRequest();

  const { state: navigationProps } = location as INavigationProps;

  const modalRef = useRef<ModalInterface>();
  const modalConfirmRef = useRef<ModalInterface>();

  const { employees } = useSelector((state: IRootState) => state.dashboardReducer);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const handleClickCloseModal = () => modalRef.current?.closeModal();

  const handleClickDelete = () => modalConfirmRef.current?.openModal();

  const handleClickEdit = () => {
    const payload = { ...navigationProps, formMode: 'edit' };
    navigate('../form-employee', { state: payload });
  };

  const onDeleteEmployee = () => {
    setLoadingDelete(true);

    request({ method: 'DELETE', url: `/employee/${navigationProps.employee._id}` })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess() {
      const copyEmployees = employees.filter(
        (employee) => employee._id !== navigationProps.employee._id
      );

      dispatch(actionsDashboard.setEmployees(copyEmployees));

      modalConfirmRef.current?.closeModal();
      toast.success('Funcionário removido com sucesso!', { toastId: 'removeEmployee' });
    }

    function onError(error: any) {
      toast.error(error.data.msg);
    }

    function onFinally() {
      setLoadingDelete(false);
    }
  };

  useEffect(() => {
    if (!navigationProps) return navigate('/dashboard');

    modalRef.current?.openModal();
    return () => {};
  }, []);

  if (!navigationProps) return <></>;

  return (
    <>
      <Modal
        ref={modalRef}
        returnUrl={navigationProps.returnUrl}
        modalChildren={
          <ConfirmModal
            loadingConfirm={loadingDelete}
            onConfirm={onDeleteEmployee}
            modalRef={modalConfirmRef}
          />
        }
      >
        {() => (
          <div className="inline-block w-full max-w-md px-10 py-12 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-slate-900 shadow-xl rounded-lg">
            <button
              type="button"
              onClick={handleClickDelete}
              className="p-2 absolute top-5 right-4 border border-gray-300 dark:bg-gray-600 dark:border-transparent rounded-lg"
            >
              <BsFillTrashFill className="w-5 h-5 text-red-500 dark:text-red-400 text-5xl" />
            </button>

            <figure className="flex flex-col items-center justify-center gap-5 select-none">
              {navigationProps?.employee?.url ? (
                <div className="avatar">
                  <img
                    src={navigationProps?.employee?.url}
                    alt="user image"
                    className="w-16 h-16 rounded-3xl"
                  />
                </div>
              ) : (
                <div className="avatar placeholder">
                  <div className="w-16 h-16 flex items-center justify-center text-white uppercase rounded-3xl bg-gray-400">
                    <span className="text-2xl font-roboto font-medium">
                      {navigationProps?.employee?.name
                        ? navigationProps?.employee?.name[0]
                        : null}
                    </span>
                  </div>
                </div>
              )}

              <figcaption
                style={{ minHeight: '85px' }}
                className="h- flex flex-col items-center justify-center gap-2"
              >
                <strong className="text-base text-center text-black dark:text-white">
                  {navigationProps?.employee?.name}
                </strong>

                <span className="text-base text-center text-black dark:text-white/80">
                  {navigationProps?.employee?.office}
                </span>
              </figcaption>
            </figure>

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
                Voltar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
