import { memo } from 'react';
import { VscColorMode } from 'react-icons/vsc';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import IRoute from '../../interfaces/route';

import { useTheme } from '../../hooks/useTheme';
import privateRoutes from '../../routes/privateRoutes';

import './styles.css';

function NavigationBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { theme, setTheme } = useTheme();

  const handleChangeTheme = () => {
    const currentTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
  };

  const renderIcons = (route: IRoute) => {
    if (!route.icon) return null;

    const handleClick = () => {
      if (location.pathname === route.path) return;
      navigate(route.path);
    };

    const btnActive = location.pathname.includes(route.path)
      ? 'btn-navigation active'
      : 'btn-navigation';

    return (
      <button type="button" onClick={handleClick} key={route.name} className={btnActive}>
        <route.icon size="19px" />
      </button>
    );
  };

  return (
    <>
      <nav className="navigation-mobile">
        {privateRoutes.map(renderIcons)}

        <button type="button" onClick={handleChangeTheme} className="btn-navigation">
          <VscColorMode size="19px" />
        </button>

        <Link to="/login" className="btn-navigation">
          <FiLogOut size="19px" />
        </Link>
      </nav>

      <nav className="navigation-desktop">
        <div className="w-full flex flex-col">
          <Link
            to="/navigation"
            className="flex justify-center py-6 min-h-16 animate-fadeIn"
          >
            <img src="/images/favicon.svg" alt="logo" />
          </Link>

          {privateRoutes.map(renderIcons)}
        </div>

        <div className="flex flex-col w-full">
          <button
            type="button"
            onClick={handleChangeTheme}
            className="flex justify-center py-4 opacity-50"
          >
            <VscColorMode size="19px" color="#ffffff" />
          </button>

          <Link to="/login" className="flex justify-center py-6 opacity-50">
            <FiLogOut size="19px" color="#ffffff" />
          </Link>
        </div>
      </nav>
    </>
  );
}

export default memo(NavigationBar);
