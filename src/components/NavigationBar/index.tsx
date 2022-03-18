import { useNavigate } from 'react-router-dom';
import { VscColorMode } from 'react-icons/vsc';
import { FiLogOut } from 'react-icons/fi';

import { useTheme } from '../../hooks/useTheme';
import IRoute from '../../interfaces/route';
import privateRoutes from '../../routes/privateRoutes';

import { memo } from 'react';

interface NavigationBarProps {}

function NavigationBar(props: NavigationBarProps) {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleClickLogout = () => {
    navigate('/login');
  };

  const handleChangeTheme = () => {
    setTheme(theme ? '' : 'dark');
  };

  const renderIcons = (route: IRoute) => {
    if (!route.icon) return null;

    const btnActive = location.pathname.includes(route.path) ? 'active' : '';

    const handleClickButton = () => {
      if (location.pathname !== route.path) {
        navigate(route.path);
      }
    };

    return (
      <li key={route.name}>
        <button
          type="button"
          onClick={handleClickButton}
          className={`btn-navigation ${btnActive}`}
        >
          <route.icon size="19px" />
        </button>
      </li>
    );
  };

  return (
    <div
      className="
      w-16 h-screen 
      flex flex-col items-center justify-between 
      fixed top-0 left-0 z-10 
      bg-primary-light dark:bg-primary-dark
      "
    >
      <div className="w-full flex flex-col">
        <button className="flex justify-center py-6">
          <img src="/images/favicon.svg" alt="logo" />
        </button>

        <ul>{privateRoutes.map(renderIcons)}</ul>
      </div>

      <div className="flex flex-col w-full">
        <button
          type="button"
          onClick={handleChangeTheme}
          className="flex justify-center py-4 opacity-50"
        >
          <VscColorMode size="19px" color="#ffffff" />
        </button>

        <button
          type="button"
          onClick={handleClickLogout}
          className="flex justify-center py-6 opacity-50"
        >
          <FiLogOut size="19px" color="#ffffff" />
        </button>
      </div>
    </div>
  );
}

export default memo(NavigationBar);
