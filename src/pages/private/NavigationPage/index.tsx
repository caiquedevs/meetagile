import { FaPlusCircle, FaUserAlt } from 'react-icons/fa';
import { VscColorMode } from 'react-icons/vsc';
import { IoIosExit } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../hooks/useTheme';

import './styles.css';

function NavigationPage() {
  const { theme, setTheme } = useTheme();

  const handleClickChangeTheme = () => {
    const currentTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
  };

  return (
    <section className="container-navigation-page">
      <div className="flex flex-col gap-7">
        <div className="flex flex-col ">
          <h2 className="text-base md:text-lg font-medium text-gray-500 dark:text-white text-center">
            Navegação rápida
          </h2>
          <h1 className="font-bold text-2xl sm:text-2.5xl text-gray-700 dark:text-white text-center">
            Navegue entre essas paginas
          </h1>
        </div>

        <ul className="mt-8 flex flex-col gap-5 lg:flex-row">
          <li>
            <Link to="/new-hindsight" className="item-navigation">
              <FaPlusCircle size="55px" color="#4A5055" />
              <span className="">Retrospectivas</span>
            </Link>
          </li>

          <li>
            <Link to="/employees" className="item-navigation">
              <FaUserAlt size="55px" color="#4A5055" />
              <span className="">Funcionários</span>
            </Link>
          </li>

          <li>
            <button onClick={handleClickChangeTheme} className="item-navigation">
              <VscColorMode size="55px" color="#4A5055" />
              <span className="">Trocar Tema</span>
            </button>
          </li>

          <li>
            <Link to="/login" className="item-navigation">
              <IoIosExit size="55px" color="#4A5055" />
              <span className="">Sair</span>
            </Link>
          </li>
        </ul>
      </div>

      <footer className="flex gap-1">
        <span>Encontrou algum problema?</span>
        <strong className="text-primary-light dark:text-primary-dark">Contate-nos</strong>
      </footer>
    </section>
  );
}

export default NavigationPage;
