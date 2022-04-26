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

      <nav className="navigation-desktop w-full hidden md:flex">
        <header className="w-full h-14 px-16 flex items-center justify-between bg-white">
          <figure className="flex justify-center">
            <img
              src="images/logo-primary.svg"
              alt="logo"
              className="w-auto h-5 object-cover"
            />
          </figure>

          <div className="h-full px-5 flex items-center gap-6">
            <button type="button" onClick={handleChangeTheme}>
              <VscColorMode size="19px" color="#000" />
            </button>

            <Link to="/login">
              <FiLogOut size="19px" color="#000" />
            </Link>

            <div className="w-8 h-8 flex items-center justify-center text-white bg-gray-500 rounded-full">
              C
            </div>
          </div>
        </header>
      </nav>
    </>
  );
}

export default memo(NavigationBar);
