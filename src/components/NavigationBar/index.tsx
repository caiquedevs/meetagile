import { memo } from 'react';
import { VscColorMode } from 'react-icons/vsc';
import { FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router-dom';

import { useTheme } from '../../hooks/useTheme';

import './styles.css';
import { useAuth } from '../../hooks/useAuth';

interface PropsPage {
  className?: string;
  boxRightClass?: string;
}

function NavigationBar(props: PropsPage) {
  const { theme, setTheme } = useTheme();
  const { auth } = useAuth();

  const handleChangeTheme = () => {
    const currentTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
  };

  return (
    <>
      <nav className="navigation-desktop w-full hidden md:flex">
        <header
          className={`w-full h-14 px-16 flex items-center justify-between bg-white ${props.className}`}
        >
          <figure className="flex justify-center">
            <img
              src="/images/logo-primary.svg"
              alt="logo"
              className="w-auto h-5 object-fit"
            />
          </figure>

          <div className={`h-full px-5 flex items-center gap-6 ${props.boxRightClass}`}>
            {/* <button type="button" onClick={handleChangeTheme}>
              <VscColorMode size="19px" color="#000" />
            </button> */}

            <Link to="/login">
              <FiLogOut size="19px" color="#000" />
            </Link>

            <img
              src="/images/icone-globo.svg"
              alt="icone-globo"
              className="w-auto h-8 object-cover"
            />
          </div>
        </header>
      </nav>
    </>
  );
}

export default memo(NavigationBar);
