import { useState, useEffect, ReactNode, memo, Dispatch, SetStateAction } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperClass } from 'swiper/types';
import { useLocation } from 'react-router-dom';

import { INavigationStepProps } from '../../interfaces/navigationStep';
import { shuffleArray } from '../../utils/shuffleArray';
import Button from '../Button';

import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation } from 'swiper';
import { IStepThree } from '../../interfaces/hindsight';

import { useDispatch, useSelector } from 'react-redux';
import * as actionsStep from '../../store/modules/step/actions';
import { IRootState } from '../../store/modules/rootReducer';

export interface ICurrentEmployee {
  current: IStepThree;
  indexSlide: number;
}

type VotingEmployeeProps = {
  useIndexSlide: [number, Dispatch<SetStateAction<number>>];
  loadingFinish?: boolean;
  children?: ReactNode;
  onFinish?: () => void;
};

function VotingEmployeeCarousel({ useIndexSlide, ...props }: VotingEmployeeProps) {
  const dispatch = useDispatch();

  const { currentHindsight } = useSelector((state: IRootState) => state.stepReducer);

  const [indexSlide, setIndexSlide] = useIndexSlide;

  const handleChangeIndex = (swipper: SwiperClass) => {
    setIndexSlide(swipper.activeIndex);
  };

  useEffect(() => {
    const copyCurrentHindsight = { ...currentHindsight };
    copyCurrentHindsight.stepThree = shuffleArray([...copyCurrentHindsight?.stepThree]);

    dispatch(actionsStep.setCurrentHindsight(copyCurrentHindsight));
    return () => {};
  }, []);

  if (props.children) {
    return (
      <div
        className="-mt-36 py-9 flex h-max flex-col items-center justify-center gap-5 bg-white dark:bg-slate-800 dark:border-transparent border border-gray-300 rounded"
        style={{ minWidth: '400px', minHeight: '252px' }}
      >
        {props.children}
      </div>
    );
  }

  return (
    <div className="lg:max-w-300px bottom-0 left-0 py-9 flex flex-col items-center bg-white dark:bg-slate-800 border border-gray-300 dark:border-transparent rounded lg:!min-w-400px">
      <Swiper
        onActiveIndexChange={handleChangeIndex}
        navigation={true}
        modules={[Navigation]}
        className="voting-employee-swiper"
      >
        {currentHindsight?.stepThree?.map((employee) => (
          <SwiperSlide key={employee._id}>
            <figure className="flex flex-col items-center justify-center animate-fadeIn select-none">
              {employee?.url && employee?.url !== 'null' ? (
                <div className="avatar">
                  <div className="w-20 h-20 mask mask-squircle">
                    <img
                      src={employee?.url}
                      alt="user image"
                      className="w-20 h-20 rounded-3xl"
                    />
                  </div>
                </div>
              ) : (
                <div className="avatar placeholder">
                  <div className="w-20 h-20 flex items-center justify-center text-white uppercase rounded-3xl bg-gray-400">
                    <span className="text-2xl font-roboto font-medium">
                      {employee?.name && employee?.name[0]}
                    </span>
                  </div>
                </div>
              )}

              <figcaption
                style={{ minHeight: '84px' }}
                className="mt-3.5 flex flex-col items-center justify-center gap-2 animate-fadeIn"
              >
                <strong className="text-base text-center dark:text-white">
                  {employee?.name}
                </strong>
                <span className="text-base text-center dark:text-white/80">
                  {employee?.office}
                </span>
              </figcaption>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>

      <small className="flex text-sm text-center text-gray-800 dark:text-white">
        {indexSlide + 1} / {currentHindsight?.stepThree?.length}
      </small>

      {indexSlide + 1 === currentHindsight?.stepThree?.length ? (
        <Button
          type="button"
          onClick={props.onFinish}
          loading={props.loadingFinish}
          className="btn btn-outline mt-4 px-6 !w-max !border-gray-500 dark:!border-white !text-gray-500 dark:!text-white hover:opacity-50 disabled:bg-gray-400 disabled:!text-white disabled:border-0"
        >
          Concluir Etapa
        </Button>
      ) : null}
    </div>
  );
}

export default memo(VotingEmployeeCarousel);
