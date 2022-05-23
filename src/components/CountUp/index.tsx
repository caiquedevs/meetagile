import { useEffect } from 'react';
import { BiReset } from 'react-icons/bi';
import { IoPauseSharp, IoPlaySharp } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { useStopwatch } from 'react-timer-hook';
import ShowIf from '../ShowIf';
import * as actionsStep from '../../store/modules/step/actions';
import { IRootState } from '../../store/modules/rootReducer';

function MyStopwatch() {
  const dispatch = useDispatch();

  const { currentHindsight, hindsightsPending } = useSelector(
    (state: IRootState) => state.stepReducer
  );

  const { hours, minutes, seconds, isRunning, start, pause, reset } = useStopwatch({
    autoStart: true,
  });

  // const hoursr = 2;
  // const minutesr = 10;
  // const secondsr = 20;

  // const handleClickReset = () => {
  //   const time = new Date();
  //   time.setSeconds(time.getSeconds() + 3600 * hoursr + 60 * minutesr + secondsr);
  //   reset(time);
  // };

  const handleClickReset = () => {
    const time = new Date();
    time.setSeconds(time.getSeconds());
    reset(time);
  };

  useEffect(() => {
    const time = new Date();

    time.setSeconds(
      time.getSeconds() +
        3600 * currentHindsight?.timer?.hours +
        60 * currentHindsight?.timer?.minutes +
        currentHindsight?.timer?.seconds
    );

    reset(time);

    return () => {};
  }, []);

  useEffect(() => {
    dispatch(actionsStep.setTimer({ hours, minutes, seconds }));
    return () => {};
  }, [seconds]);

  useEffect(() => {
    console.log('currentHindsight', currentHindsight);
    console.log('hindsightsPending', hindsightsPending);

    return () => {};
  }, [seconds]);

  return (
    <div style={{ minWidth: 160 }} className="flex items-center justify-end gap-2">
      <div className="flex items-center text-lg text-white font-poppins">
        <span>{hours.toString().padStart(2, '0')}</span>:
        <span>{minutes.toString().padStart(2, '0')}</span>:
        <span>{seconds.toString().padStart(2, '0')}</span>
      </div>

      <div className="flex items-center gap-1">
        <ShowIf condition={!isRunning}>
          <button
            onClick={start}
            className="w-8 h-8 flex items-center justify-center hover:bg-white/30 rounded-full"
          >
            <IoPlaySharp size="16px" className="text-white" />
          </button>
        </ShowIf>

        <ShowIf condition={isRunning}>
          <button
            onClick={pause}
            className="w-8 h-8 flex items-center justify-center hover:bg-white/30 rounded-full"
          >
            <IoPauseSharp size="18px" className="text-white" />
          </button>
        </ShowIf>

        <button
          onClick={handleClickReset}
          className="w-8 h-8 pb-0.5 flex items-center justify-center hover:bg-white/30 rounded-full"
        >
          <BiReset size="18px" className="text-white" />
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <MyStopwatch />
    </div>
  );
}
