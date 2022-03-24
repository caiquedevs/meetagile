import { useState, useEffect, ReactNode } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

import { IEmployee } from '../../interfaces/employee';
import { shuffleArray } from '../../utils/shuffleArray';

type VotingUserProps = {
  onFinish?: () => void;
  current?: [any, any];
  loadingFinish?: boolean;
  children?: ReactNode;
};

export function VotingUser({
  onFinish,
  loadingFinish,
  current,
  children,
}: VotingUserProps) {
  const { state }: any = useLocation();

  const [index, setIndex] = useState(0);
  const [randomEmployees, setRandomEmployees] = useState<IEmployee[]>([]);
  const [currentEmployee, setCurrentEmployee] = current || [];

  if (children) {
    return (
      <div
        className="py-9 flex flex-col items-center justify-center gap-5 bg-white border border-gray-300 rounded"
        style={{ minWidth: '399px', minHeight: '252px' }}
      >
        {children}
      </div>
    );
  }

  const handleClickNext = () => {
    if (index + 1 === randomEmployees.length) return;
    setIndex(index + 1);
  };

  const handleClickPrev = () => {
    if (index + 1 === 1) return;
    setIndex(index - 1);
  };

  const handleClickFinish = () => {
    onFinish && onFinish();
  };

  useEffect(() => {
    setRandomEmployees(shuffleArray(state.employees));
    return () => {};
  }, []);

  useEffect(() => {
    if (randomEmployees.length === 0) return;
    setCurrentEmployee(randomEmployees[index]);
    return () => {};
  }, [index, randomEmployees]);

  return (
    <div
      style={{ minWidth: '300px' }}
      className="py-9 flex flex-col items-center gap-5 bg-white border border-gray-300 rounded lg:!min-w-400px"
    >
      <div className="w-full px-9 flex justify-between absolute top-24 left-0">
        <button
          type="button"
          disabled={index + 1 === 1}
          onClick={handleClickPrev}
          className="btn btn-ghost p-0 disabled:bg-transparent"
        >
          <FiChevronLeft size="30px" color={index + 1 === 1 ? '#bdbdbd' : '#19202a'} />
        </button>

        <button
          type="button"
          disabled={index + 1 === randomEmployees.length}
          onClick={handleClickNext}
          className="btn btn-ghost p-0 disabled:bg-transparent"
        >
          <FiChevronRight size="30px" />
        </button>
      </div>

      <figure className="flex flex-col items-center justify-center animate-fadeIn select-none">
        {currentEmployee?.url && currentEmployee?.url !== 'null' ? (
          <div className="avatar">
            <div className="w-20 h-20 mask mask-squircle">
              <img src={currentEmployee?.url} />
            </div>
          </div>
        ) : (
          <div className="avatar placeholder">
            <div className="w-20 h-20 bg-gray-400 dark:bg-gray-400 text-neutral-content mask mask-squircle ">
              <span className="text-2xl font-roboto font-medium">
                {currentEmployee?.name[0]}
              </span>
            </div>
          </div>
        )}

        <figcaption
          className="mt-3.5 flex flex-col items-center justify-center gap-2 animate-fadeIn"
          style={{ minHeight: '84px' }}
        >
          <strong className="text-base text-center">{currentEmployee?.name}</strong>
          <span className="text-base text-center">{currentEmployee?.office}</span>

          <small className="flex text-sm text-center text-gray-800">
            {index + 1} / {randomEmployees.length}
          </small>
        </figcaption>
      </figure>

      {index + 1 === randomEmployees.length ? (
        <button
          type="button"
          onClick={handleClickFinish}
          disabled={loadingFinish}
          className="btn btn-outline px-6 py-2 hover:!text-gray-500 hover:!border-gray-500 rounded disabled:loading"
        >
          Concluir Etapa
        </button>
      ) : null}
    </div>
  );
}

export default VotingUser;
