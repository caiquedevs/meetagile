import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { BiPlus } from 'react-icons/bi';
import { FreeMode } from 'swiper';

import { ModalInterface } from '../../../../components/Modal';
import { IData, IMode } from '..';
import { IEmployee } from '../../../../interfaces/employee';
import { ConfirmModal, EmployeeModal } from '../../../../components';

import { IoSettingsOutline } from 'react-icons/io5';

type PropsPage = {
  useMode: [mode: IMode, setMode: Dispatch<SetStateAction<IMode>>];
  useData: [data: IData, setData: Dispatch<SetStateAction<IData>>];
  modalRef: MutableRefObject<ModalInterface | undefined>;
};

export default function EmployeeList(props: PropsPage) {
  const { useMode, useData, modalRef } = props;

  const [, setMode] = useMode;
  const [data, setData] = useData;

  const EmployeeModalRef = useRef<ModalInterface>();

  const [employeeSelected, setEmployeeSelected] = useState({} as IEmployee);

  const openModalCreateEmployee = () => modalRef.current?.openModal();

  const openEmployeeModal = (payload?: any) => {
    EmployeeModalRef.current?.openModal(payload);
  };

  const handleClickOptionsEmployee = (employee: IEmployee) => {
    setEmployeeSelected(employee);
    openEmployeeModal(employee);
  };

  const handleClickCreateEmployee = () => {
    setMode({ name: 'create', payload: { data, setData } });
    openModalCreateEmployee();
  };

  const handleClickEditEmployee = (employee: IEmployee) => {
    setMode({ name: 'edit', payload: { item: employee, data, setData } });
    openModalCreateEmployee();
  };

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <section>
      <div className="px-16 pt-10 pb-3">
        <h2 className="font-medium font-roboto text-base text-gray-600">Funcionários</h2>
      </div>

      <Swiper
        slidesPerView="auto"
        spaceBetween={15}
        freeMode={true}
        modules={[FreeMode]}
        className="mySwiper employees-dashboard"
      >
        <SwiperSlide
          onClick={handleClickCreateEmployee}
          className="shadow-card cursor-pointer"
        >
          <article className="flex flex-col items-center justify-center gap-7 animate-fadeIn select-none">
            <div className="flex items-center justify-center">
              <img src="images/dashed-border.svg" alt="dashed" />

              <div className="w-12 h-12 flex items-center justify-center absolute bg-teal-350 rounded-full text-3xl text-white">
                <BiPlus />
              </div>
            </div>

            <span className="font-roboto text-base font-medium text-center text-black/60 leading-normal">
              Adicionar
              <br />
              funcionário
            </span>
          </article>
        </SwiperSlide>

        {data?.employees?.map((employee) => {
          const handleClickOptions = () => handleClickOptionsEmployee(employee);

          return (
            <SwiperSlide
              key={employee._id}
              className={
                data?.employees.length > 6 ? 'shadow-card cursor-move' : 'shadow-card'
              }
            >
              <div className="absolute origin top-3 right-3 z-10">
                <button
                  type="button"
                  onClick={handleClickOptions}
                  className="btn btn-primary !h-max p-1
                  font-medium !text-gray-400
                  !bg-transparent rounded-md hover:!bg-gray-300 ease-in-out duration-300
                "
                >
                  <IoSettingsOutline size="22px" />
                </button>
              </div>

              <figure className="flex flex-col items-center justify-center gap-5 animate-fadeIn select-none">
                {employee?.url ? (
                  <div className="avatar">
                    <img
                      src={employee.url}
                      alt="user image"
                      className="w-16 h-16 rounded-3xl"
                    />
                  </div>
                ) : (
                  <div className="avatar placeholder">
                    <div className="w-16 h-16 flex items-center justify-center text-white uppercase rounded-3xl bg-gray-400">
                      <span className="text-2xl font-roboto font-medium">
                        {employee.name[0]}
                      </span>
                    </div>
                  </div>
                )}

                <figcaption
                  style={{ minHeight: '85px' }}
                  className="h- flex flex-col items-center justify-center gap-2"
                >
                  <strong className="text-base text-center">{employee.name}</strong>
                  <span className="text-base text-center">{employee.office}</span>
                </figcaption>
              </figure>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <EmployeeModal
        onEdit={handleClickEditEmployee}
        onRemove={() => {}}
        employeeSelected={employeeSelected}
        modalRef={EmployeeModalRef}
      />
    </section>
  );
}
