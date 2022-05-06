import { useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import {
  MdArrowBackIosNew,
  MdOutlineDarkMode,
  MdOutlineLightMode,
  MdPendingActions,
} from 'react-icons/md';
import { RiPlayListAddLine } from 'react-icons/ri';

import { INavigationStepProps } from '../../../interfaces/navigationStep';

import { ModalRandomComment, ShowIf } from '../../../components';
import { ModalInterface } from '../../../components/Modal';
import StepActions from './StepActions';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store/modules/rootReducer';
import * as actionsTheme from '../../../store/modules/theme/actions';

type Props = {};

export default function NewHindsight({}: Props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { state: navigationProps } = location as INavigationStepProps;

  const { currentHindsight } = useSelector((state: IRootState) => state.stepReducer);
  const { theme } = useSelector((state: IRootState) => state.themeReducer);

  const modalConfirmRef = useRef<ModalInterface>();
  const modalRandomCommentRef = useRef<ModalInterface>();

  const whiteListSingleComment = ['/new-hindsight/step-one', '/new-hindsight/step-two'];

  const noHasStep =
    location.pathname === '/new-hindsight' || location.pathname === '/new-hindsight/';

  const handleClickNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  const handleClickShowActions = () => {
    modalConfirmRef.current?.openModal();
  };

  const handleClickShowModalRandomComment = () => {
    modalRandomCommentRef.current?.openModal();
  };

  const handleClickToogleTheme = () => {
    dispatch(actionsTheme.toogleTheme());
  };

  useEffect(() => {
    if (
      noHasStep ||
      !navigationProps?.mode ||
      (!location.pathname.includes('step-finish') && !currentHindsight?._id)
    )
      navigate('/dashboard');
    return () => {};
  }, []);

  useEffect(() => {
    document.body.className = theme;
    return () => {};
  }, [theme]);

  if (
    noHasStep ||
    !navigationProps?.mode ||
    (!location.pathname.includes('step-finish') && !currentHindsight?._id)
  )
    return <></>;

  return (
    <main>
      <ShowIf condition={location.pathname !== '/new-hindsight/step-finish'}>
        <nav
          style={{ backdropFilter: 'blur(10px)' }}
          className="w-full absolute top-0 left-0 z-10 bg-white/20"
        >
          <header className="w-full h-14  flex items-center justify-between">
            <button
              type="button"
              onClick={handleClickNavigateToDashboard}
              style={{ backdropFilter: 'blur(10px)' }}
              className="px-5 h-14 flex items-center gap-3 font-roboto text-lg text-white font-medium bg-white/05"
            >
              <MdArrowBackIosNew className="text-2xl text-white" />
            </button>

            <div className="flex items-center gap-3 font-roboto text-lg text-white font-bold uppercase">
              {currentHindsight?.name}
            </div>

            <div className="h-full px-5 flex items-center gap-3 bg-white">
              <button
                type="button"
                onClick={handleClickToogleTheme}
                className="btn disabled:animate-pulse-intense disabled:bg-gray-300 disabled:text-black/50 w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-full"
              >
                {theme === 'light' ? (
                  <MdOutlineDarkMode size="19px" className="text-black" />
                ) : (
                  <MdOutlineLightMode size="19px" className="text-black" />
                )}
              </button>
              <ShowIf
                condition={
                  navigationProps.mode !== 'view' &&
                  whiteListSingleComment.includes(location.pathname)
                }
              >
                <button
                  type="button"
                  onClick={handleClickShowModalRandomComment}
                  className="btn w-8 h-8 flex items-center justify-center hover:bg-gray-300 rounded-full"
                >
                  <RiPlayListAddLine size="18px" className="text-black" />
                </button>
              </ShowIf>

              <button
                type="button"
                onClick={handleClickShowActions}
                className="btn w-8 h-8 flex items-center justify-center hover:bg-gray-300 rounded-full"
              >
                <MdPendingActions size="19px" className="text-black/70" />
              </button>

              <img
                src="/images/icone-globo.svg"
                alt="icone-globo"
                className="w-auto h-8 object-cover"
              />
            </div>
          </header>
        </nav>

        <StepActions modalRef={modalConfirmRef} />
        <ModalRandomComment modalRef={modalRandomCommentRef} />
      </ShowIf>

      <Outlet />
    </main>
  );
}
