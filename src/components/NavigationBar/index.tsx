import { useNavigate } from 'react-router-dom';
import { VscColorMode } from 'react-icons/vsc';
import { FiLogOut } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';

import { useTheme } from '../../hooks/useTheme';
import IRoute from '../../interfaces/route';
import privateRoutes from '../../routes/privateRoutes';

import './styles.css';

interface NavigationBarProps {}

function NavigationBar(props: NavigationBarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const { theme, setTheme } = useTheme();

  const whiteList = ['/navigation'];
  const hiddenBarMobile = !whiteList.includes(location.pathname) ? 'flex' : 'lg:flex';

  const handleClickLogout = () => {
    navigate('/login');
  };

  const handleChangeTheme = () => {
    const currentTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
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

  const handleClickLogo = () => {
    navigate('/navigation');
  };

  return (
    <nav className={hiddenBarMobile}>
      <div className="w-full flex flex-col">
        <button
          onClick={handleClickLogo}
          className="flex justify-center py-6 min-h-16 animate-fadeIn"
        >
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
    </nav>
  );
}

export default NavigationBar;
