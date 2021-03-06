import { useEffect } from 'react';
import ReactConfetti from 'react-confetti';
import { useLocation, useNavigate } from 'react-router-dom';
import { IAction } from '../../../interfaces/action';
import { IHindsight, IStepThree } from '../../../interfaces/hindsight';
import { INavigationStepProps } from '../../../interfaces/navigationStep';
import { useDispatch } from 'react-redux';
import * as actionsStep from '../../../store/modules/step/actions';

interface FinishPropsPage {
  state: {
    actions: IAction;
    hindsight: IHindsight;
    mode: 'create' | 'view';
    winningEmployee?: IStepThree;
  };
}

export default function StepFinish() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { state: navigationProps } = location as FinishPropsPage & FinishPropsPage;

  const handleClick = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    if (!navigationProps) navigate('/dashboard');

    const audio = new Audio('/music/congrats.mp3');

    const playAudio = () => {
      const audioPromise = audio.play();
      audio.volume = 0.2;

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

  if (!navigationProps) return <></>;

  return (
    <section className="w-full min-h-screen bg-white dark:bg-slate-900">
      <ReactConfetti />

      <header
        className="
          w-full h-64
          before:content-['']
          before:w-full before:h-full
          before:block before:absolute
          before:bg-sky-500 dark:before:bg-sky-900
        "
      >
        <div className="pt-16 md:pt-24 px-8 md:px-14 flex gap-5">
          <div className="w-full flex justify-center gap-1.5">
            <span className=" text-3xl lg:text-6xl text-white font-roboto font-bold uppercase">
              Destaque da Sprint
            </span>
          </div>
        </div>
      </header>

      <div className="w-full max-w-400px mx-auto py-9 -mt-14 flex flex-col items-center gap-5 bg-white dark:bg-slate-800 shadow-md rounded">
        <figure className="flex flex-col items-center justify-center">
          {navigationProps.winningEmployee?.url ? (
            <img
              src={navigationProps.winningEmployee.url}
              alt="user image"
              className="w-20 h-20 rounded-3xl"
            />
          ) : (
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center uppercase text-white bg-gray-400 dark:bg-gray-400 text-neutral-content">
              <span className="text-2xl font-roboto font-medium">
                {navigationProps.winningEmployee?.name[0]}
              </span>
            </div>
          )}

          <figcaption className="mt-3.5 flex flex-col items-center justify-center gap-2">
            <strong className="text-base text-center dark:text-white">
              {navigationProps.winningEmployee?.name}
            </strong>
            <span className="text-base text-center dark:text-white/90">
              {navigationProps.winningEmployee?.office}
            </span>

            <button
              type="button"
              onClick={handleClick}
              className="btn btn-primary px-6 mt-3 !bg-sky-500 !hover:bg-sky-500 dark:!bg-sky-800"
            >
              Voltar para o inicio
            </button>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
