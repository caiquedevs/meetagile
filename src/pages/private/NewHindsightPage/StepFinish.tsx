import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';

import { Header } from '../../../components';
import { IHindsight } from '../../../interfaces/hindsight';
import { IEmployee } from '../../../interfaces/employee';
import { IAction } from '../../../interfaces/action';

interface StepFinishProps {}

interface PropsPage {
  state: {
    hindsight: IHindsight;
    employees: IEmployee[];
    actions: IAction[];
    winningEmployee: IEmployee;
  };
}

function StepFinish({}: StepFinishProps) {
  const navigate = useNavigate();

  const location = useLocation();
  const { state: navigationProps } = location as PropsPage;

  const handleClick = () => {
    navigate('/new-hindsight');
  };

  useEffect(() => {
    if (!navigationProps?.hindsight) navigate('/new-hindsight');
    const audio = new Audio('/music/congrats.mp3');

    const playAudio = () => {
      const audioPromise = audio.play();

      if (audioPromise !== undefined) {
        audioPromise
          .then((_) => {})
          .catch((err) => {
            console.error(err);
          });
      }
    };

    audio.load();
    playAudio();

    return () => audio.pause();
  }, []);

  if (!navigationProps?.hindsight) return <></>;

  return (
    <>
      <Confetti />

      <Header className="before:bg-sky-500 dark:before:bg-sky-500" />

      <div className="flex justify-center mb-9">
        <span className="text-6xl text-white font-roboto font-bold uppercase">
          Destaque da Sprint
        </span>
      </div>

      <div
        className="w-full mx-auto py-9 flex flex-col items-center gap-5 bg-white shadow-md rounded"
        style={{ maxWidth: '399px' }}
      >
        <figure className="flex flex-col items-center justify-center">
          {navigationProps?.winningEmployee?.url ? (
            <div className="avatar">
              <div className="w-20 mask mask-squircle">
                <img src={navigationProps?.winningEmployee.url} />
              </div>
            </div>
          ) : (
            <div className="avatar placeholder">
              <div className="bg-gray-400 dark:bg-gray-400 text-neutral-content mask mask-squircle w-20">
                <span className="text-2xl font-roboto font-medium">
                  {navigationProps?.winningEmployee?.name[0]}
                </span>
              </div>
            </div>
          )}

          <figcaption className="mt-3.5 flex flex-col items-center justify-center gap-2">
            <strong className="text-base text-center">
              {navigationProps?.winningEmployee?.name}
            </strong>
            <span className="text-base text-center">
              {navigationProps?.winningEmployee?.office}
            </span>

            <button
              type="button"
              onClick={handleClick}
              className="btn mt-3 border-none bg-sky-500 hover:bg-sky-500 w-max mx-auto"
            >
              Voltar para o inicio
            </button>
          </figcaption>
        </figure>
      </div>
    </>
  );
}

export default StepFinish;
