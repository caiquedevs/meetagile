import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as actionsAuth from '../../../store/modules/auth/actions';

function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const htmlElement: any = document.querySelector('html');
  htmlElement.style.scrollBehavior = 'smooth';

  const { isLoggedIn } = useSelector((state: any) => state.authReducer);

  const handleClickLogin = () => {
    if (isLoggedIn) return navigate('/dashboard');
    navigate('/login');
  };

  const handleClickRegister = () => {
    if (isLoggedIn) {
      dispatch(actionsAuth.logoutRequest());
      return navigate('/login');
    }

    navigate('/register');
  };

  useEffect(() => {
    return () => (htmlElement.style.scrollBehavior = 'none');
  }, []);

  return (
    <main className="bg-white dark:bg-slate-900">
      <section className="h-screen flex flex-col">
        <header className="pt-10 px-8 sm:px-12 flex items-center justify-between z-10">
          <img src="/images/logo.svg" alt="logo" className="h-14 dark:hidden" />
          <img
            src="/images/logo-white.svg"
            alt="logo"
            className="h-12 hidden dark:flex"
          />

          <a href="#form">
            <button type="button" className="btn btn-outline px-8">
              {isLoggedIn ? 'Entrar' : 'Login/Cadastre-se'}
            </button>
          </a>
        </header>

        <div className="-mt-10 flex flex-1 flex-col items-center justify-center gap-4">
          <span className="text-4xl font-roboto font-light uppercase dark:text-white/80">
            Olá!
          </span>

          <span className="text-4xl sm:text-5xl	font-poppins font-bold uppercase text-center dark:text-white">
            Seja bem vindo ao MeetAgile
          </span>

          <p className="text-2xl sm:text-3xl font-roboto font-light text-center dark:text-white/80">
            Seu novo gerenciador de retrospectiva
          </p>
        </div>

        <div className="h-44 pt-10 flex justify-center animate-bounce">
          <a href="#form" className="btn-arrow" type="button">
            <svg
              width="52"
              height="25"
              viewBox="0 0 52 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 1L26 23L51 1"
                className="stroke-black dark:stroke-white"
                stroke-width="2"
              />
            </svg>
          </a>
        </div>
      </section>

      <form
        id="form"
        className="h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-900"
      >
        <div className="card w-full max-w-lg shadow-sm rounded-lg bg-white dark:bg-slate-800">
          <div className="flex flex-col px-8 md:px-16 py-14 gap-7">
            <figure className="flex justify-center">
              <img src="/images/logo.svg" alt="logo" className="h-14 dark:hidden" />
              <img
                src="/images/logo-white.svg"
                alt="logo"
                className="h-12 hidden dark:flex"
              />
            </figure>

            <div className="flex flex-col items-center gap-4 text-center">
              <strong className="font-roboto font-bold text-2xl text-gray-600 dark:text-white">
                Escolha se gostaria de se logar ou se registrar.
              </strong>

              <p className="font-poppins font-normal text-base text-gray-500 text-center dark:text-white/80">
                Quando fazer o login você já irá poder gerenciar suas retrospectivas!
              </p>
            </div>

            <div className="w-full flex flex-col items-center gap-3">
              <button
                type="button"
                className="w-full btn btn-primary text-white"
                onClick={handleClickLogin}
              >
                {isLoggedIn ? 'Ir para o dashboard' : 'Entrar'}
              </button>

              <button
                type="button"
                className="w-full btn btn-outline"
                onClick={handleClickRegister}
              >
                {isLoggedIn ? 'Entrar com outro usuário' : 'Inscrever-se'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}

export default HomePage;
function useEffect(arg0: () => () => void, arg1: never[]) {
  throw new Error('Function not implemented.');
}
