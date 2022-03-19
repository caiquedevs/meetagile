import { FiLogOut, FiPlusCircle, FiUsers } from 'react-icons/fi';
import { FaPlusCircle, FaUserAlt } from 'react-icons/fa';
import { VscColorMode } from 'react-icons/vsc';
import { IoIosExit } from 'react-icons/io';

import { Container } from './styles';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../hooks/useTheme';

function NavigationPage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleClickNewHindsight = () => {
    navigate('/new-hindsight');
  };

  const handleClickEmployees = () => {
    navigate('/employees');
  };

  const handleClickChangeTheme = () => {
    const currentTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(currentTheme);
    localStorage.setItem('theme', currentTheme);
  };

  const handleClickLogin = () => {
    navigate('/login');
  };

  return (
    <Container
      className="
      h-screen p-16
      flex flex-col items-center justify-between
      bg-white dark:bg-gray-50
      before:bg-gray-100 dark:before:bg-secondary-dark
      "
    >
      <div className="flex flex-col gap-7">
        <div className="flex flex-col ">
          <h2 className="text-lg font-roboto font-medium text-center text-gray-500 dark:text-gray-300">
            Navegação rápida
          </h2>
          <h1 className="font-bold font-roboto text-2.5xl text-center texr-gray-700 dark:text-white">
            Navegue entre essas paginas
          </h1>
        </div>

        <div className="mt-8 flex flex-col items-center gap-12">
          <ul className="flex gap-5">
            <li>
              <button
                type="button"
                className="flex flex-col items-center gap-7 bg-base-100 shadow-md rounded hover:bg-gray-100 duration-150"
                onClick={handleClickNewHindsight}
              >
                <FaPlusCircle size="55px" color="#4A5055" />
                <span className="">Retrospectivas</span>
              </button>
            </li>

            <li>
              <button
                className="flex flex-col items-center gap-7 bg-base-100 shadow-md rounded hover:bg-gray-100 duration-150"
                onClick={handleClickEmployees}
              >
                <FaUserAlt size="55px" color="#4A5055" />
                <span className="">Funcionários</span>
              </button>
            </li>

            <li>
              <button
                className="flex flex-col items-center gap-7 bg-base-100 shadow-md rounded hover:bg-gray-100 duration-150"
                onClick={handleClickChangeTheme}
              >
                <VscColorMode size="55px" color="#4A5055" />
                <span className="">Trocar Tema</span>
              </button>
            </li>

            <li>
              <button
                className="flex flex-col items-center gap-7 bg-base-100 shadow-md rounded hover:bg-gray-100 duration-150"
                onClick={handleClickLogin}
              >
                <IoIosExit size="55px" color="#4A5055" />
                <span className="">Sair</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <footer className="flex gap-1">
        <span>Encontrou algum problema?</span>
        <strong className="text-primary-light dark:text-primary-dark">Contate-nos</strong>
      </footer>
    </Container>
  );
}

export default NavigationPage;
