import { useState, useEffect, ReactNode, memo, Dispatch, SetStateAction } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper/types';
import { useLocation } from 'react-router-dom';

import { IStepProps } from '../../interfaces/stepProps';
import { shuffleArray } from '../../utils/shuffleArray';
import Button from '../Button';

import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper';
import { StepThreeProps } from '../../interfaces/hindsight';

export interface ICurrentEmployee {
  current: StepThreeProps;
  indexSlide: number;
}

type VotingEmployeeProps = {
  useEmployeesVoting: [StepThreeProps[], Dispatch<SetStateAction<StepThreeProps[]>>];
  useIndexSlide: [number, Dispatch<SetStateAction<number>>];
  loadingFinish?: boolean;
  children?: ReactNode;
  onFinish?: () => void;
};

function VotingEmployeeCarousel(props: VotingEmployeeProps) {
  const location = useLocation();

  const { state: navigationProps } = location as IStepProps;

  const [employeesVoting, setEmployeesVoting] = props.useEmployeesVoting;
  const [indexSlide, setIndexSlide] = props.useIndexSlide;

  const handleChangeIndex = (swipper: SwiperClass) => {
    setIndexSlide(swipper.activeIndex);
  };

  useEffect(() => {
    const filterEmployees = navigationProps.hindsight?.stepThree.filter(
      (item) => item.employee
    );

    const random = shuffleArray([...filterEmployees]);
    console.log('random', random);
    setEmployeesVoting(random);

    return () => {};
  }, []);

  if (props.children) {
    return (
      <div
        className="-mt-24 py-9 flex h-max flex-col items-center justify-center gap-5 bg-white border border-gray-300 rounded"
        style={{ minWidth: '400px', minHeight: '252px' }}
      >
        {props.children}
      </div>
    );
  }

  return (
    <div className="lg:max-w-300px bottom-0 left-0 py-9 flex flex-col items-center bg-white border border-gray-300 rounded lg:!min-w-400px">
      <Swiper
        onActiveIndexChange={handleChangeIndex}
        navigation={true}
        modules={[Navigation]}
        className="voting-employee-swiper"
      >
        {employeesVoting.map((employee) => (
          <SwiperSlide>
            <figure className="flex flex-col items-center justify-center animate-fadeIn select-none">
              {employee?.employee?.url && employee?.employee?.url !== 'null' ? (
                <div className="avatar">
                  <div className="w-20 h-20 mask mask-squircle">
                    <img
                      src={employee?.employee?.url}
                      alt="user image"
                      className="w-20 h-20 rounded-3xl"
                    />
                  </div>
                </div>
              ) : (
                <div className="avatar placeholder">
                  <div className="w-20 h-20 flex items-center justify-center text-white uppercase rounded-3xl bg-gray-400">
                    <span className="text-2xl font-roboto font-medium">
                      {employee?.employee?.name && employee?.employee?.name[0]}
                    </span>
                  </div>
                </div>
              )}

              <figcaption
                style={{ minHeight: '84px' }}
                className="mt-3.5 flex flex-col items-center justify-center gap-2 animate-fadeIn"
              >
                <strong className="text-base text-center">
                  {employee?.employee?.name}
                </strong>
                <span className="text-base text-center">
                  {employee?.employee?.office}
                </span>
              </figcaption>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>

      <small className="flex text-sm text-center text-gray-800">
        {indexSlide + 1} / {employeesVoting.length}
      </small>

      {indexSlide + 1 === employeesVoting.length ? (
        <Button
          type="button"
          onClick={props.onFinish}
          loading={props.loadingFinish}
          className="btn btn-outline mt-4 px-6 !w-max !border-gray-500 !text-gray-500 hover:opacity-50 disabled:bg-gray-400 disabled:!text-white disabled:border-0"
        >
          Concluir Etapa
        </Button>
      ) : null}
    </div>
  );
}

export default memo(VotingEmployeeCarousel);
