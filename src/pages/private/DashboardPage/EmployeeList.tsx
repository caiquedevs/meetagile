import { Swiper, SwiperSlide } from 'swiper/react';
import { BiPlus } from 'react-icons/bi';
import { FreeMode } from 'swiper';

import { IEmployee } from '../../../interfaces/employee';

import { IoSettingsOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../../../hooks/useDashboard';
import { ShowIf } from '../../../components';

const SkeletonEmployee = (
  <SwiperSlide
    style={{ minHeight: '265px', maxWidth: '200px' }}
    className="cursor-pointer w-full h-auto py-0 px-6 my-3 flex flex-col items-center justify-center gap-5 rounded-xl bg-white shadow-card"
  >
    <div className="absolute origin top-3 right-3 z-10">
      <span className="w-6 h-6 block bg-gray-300 rounded animate-pulse-intense" />
    </div>

    <figure className="flex flex-col items-center justify-center gap-5 select-none">
      <div className="avatar placeholder">
        <div className="w-16 h-16 rounded-3xl bg-gray-300 animate-pulse-intense" />
      </div>

      <figcaption
        style={{ minHeight: '85px' }}
        className="h- flex flex-col items-center justify-center gap-2"
      >
        <span className="w-32 h-5 block bg-gray-300 rounded animate-pulse-intense" />
        <small className="w-20 h-5 bg-gray-300 rounded animate-pulse-intense" />
      </figcaption>
    </figure>
  </SwiperSlide>
);

export default function EmployeeList() {
  const navigate = useNavigate();
  const { data, setData, loadingFetch } = useDashboard();

  const returnUrl = location.pathname;

  const handleClickCreateEmployee = () => {
    navigate('form-employee', { state: { formMode: 'create', returnUrl } });
  };

  const handleClickOptionsEmployee = (employee: IEmployee) => {
    navigate('show-employee', { state: { employee, returnUrl } });
  };

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
          style={{ minHeight: '265px', maxWidth: '200px' }}
          className="cursor-pointer w-full h-auto py-0 px-6 my-3
          flex flex-col items-center justify-center gap-5 
          rounded-xl bg-white shadow-card"
        >
          <article className="flex flex-col items-center justify-center gap-7 select-none">
            <div className="flex items-center justify-center">
              <img src="/images/dashed-border.svg" alt="dashed" />

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

        {loadingFetch ? (
          <>
            {SkeletonEmployee}
            {SkeletonEmployee}
          </>
        ) : null}

        {data?.employees?.map((employee) => {
          const handleClickOptions = () => handleClickOptionsEmployee(employee);

          return (
            <SwiperSlide
              key={employee._id}
              style={{ minHeight: '265px', maxWidth: '200px' }}
              className={`w-full h-auto py-0 px-6 my-3
                flex flex-col items-center justify-center gap-5 
                rounded-xl bg-white shadow-card ${
                  data?.employees.length > 6 ? 'cursor-move' : ''
                }`}
            >
              <div className="absolute origin top-3 right-3 z-10">
                <button
                  type="button"
                  onClick={handleClickOptions}
                  className="btn btn-primary !h-max p-1
                  font-medium !text-gray-400
                  !bg-transparent rounded-md hover:!bg-gray-50 ease-in-out duration-300
                "
                >
                  <IoSettingsOutline size="22px" />
                </button>
              </div>

              <figure className="flex flex-col items-center justify-center gap-5 select-none">
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
    </section>
  );
}
