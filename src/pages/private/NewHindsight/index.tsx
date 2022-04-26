import React, { useEffect, useRef } from 'react';
import { Beforeunload, useBeforeunload } from 'react-beforeunload';
import { BiArrowBack, BiCommentAdd, BiMessageSquareAdd } from 'react-icons/bi';
import { FiLogOut } from 'react-icons/fi';
import { GoGithubAction } from 'react-icons/go';
import { MdOutlinePostAdd, MdPendingActions } from 'react-icons/md';
import { VscColorMode, VscDiffAdded, VscPersonAdd, VscReactions } from 'react-icons/vsc';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { NavigationBar, ShowIf } from '../../../components';
import { useTheme } from '../../../hooks/useTheme';
import { IoPersonAddOutline } from 'react-icons/io5';
import { RiPlayListAddLine } from 'react-icons/ri';
import { useAuth } from '../../../hooks/useAuth';

import StepActions from './StepActions';
import { ModalInterface } from '../../../components/Modal';
import { IStepProps } from '../../../interfaces/stepProps';

type Props = {};

export default function NewHindsight({}: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const { auth } = useAuth();
  const { theme, setTheme } = useTheme();

  const { state: navigationProps } = location as IStepProps;

  const modalConfirmRef = useRef<ModalInterface>();

  const noHasStep =
    location.pathname === '/new-hindsight' || location.pathname === '/new-hindsight/';

  const handleChangeTheme = () => {
    const currentTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
  };

  const handleClickNavigateToDashboard = (event: any) => {
    if (navigationProps.mode === 'view') return navigate('/dashboard');

    const input = confirm(
      'Deseja voltar? \nÉ possível que as alterações feitas não sejam salvas.'
    );

    if (input) navigate('/dashboard');
  };

  const handleClickShowActions = () => {
    modalConfirmRef.current?.openModal();
  };

  if (navigationProps.mode !== 'view') {
    useBeforeunload((event) => {
      event.preventDefault();
    });
  }

  useEffect(() => {
    if (noHasStep) navigate('/dashboard');
    return () => {};
  }, []);

  if (noHasStep) return <></>;

  return (
    <main>
      <ShowIf condition={location.pathname !== '/new-hindsight/step-finish'}>
        <nav
          style={{ backdropFilter: 'blur(10px)' }}
          className="w-full absolute top-0 left-0 z-10 bg-white/20"
        >
          <header className="w-full h-14 pl-5 flex items-center justify-between">
            <button
              type="button"
              onClick={handleClickNavigateToDashboard}
              className="flex items-center gap-3 font-roboto text-lg text-white font-medium"
            >
              <BiArrowBack className="text-2xl text-white" />
              Dashboard
            </button>

            <div className="h-full px-5 flex items-center gap-3 bg-white">
              {/* <button
                type="button"
                onClick={handleChangeTheme}
                className="btn w-8 h-8 flex items-center justify-center hover:bg-gray-300 rounded-full"
              >
                <RiPlayListAddLine size="18px" className="text-black" />
              </button> */}

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
      </ShowIf>

      <Outlet />
    </main>
  );
}
