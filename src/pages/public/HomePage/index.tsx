import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();

  const handleClickLogin = () => navigate('/login');
  const handleClickRegister = () => navigate('/register');

  return (
    <main className="bg-white">
      <section className="h-screen flex flex-col">
        <header className="pt-10 px-8 sm:px-12 flex items-center justify-between z-10">
          <img src="/images/logo.svg" alt="logo" className="h-14" />
          <a href="#form">
            <button className="btn btn-outline px-8 !border-gray-800 !text-gray-800 !font-medium hidden sm:block">
              Login/Cadastre-se
            </button>
          </a>
        </header>

        <div className="-mt-10 flex flex-1 flex-col items-center justify-center gap-4">
          <span className="text-4xl font-roboto font-light uppercase">Olá!</span>

          <span className="text-4xl sm:text-5xl	font-poppins font-bold uppercase text-center">
            Seja bem vindo ao MeetAgile
          </span>

          <p className="text-2xl sm:text-3xl font-roboto font-light text-center">
            Seu novo gerenciador de retrospectiva
          </p>
        </div>

        <div className="h-44 pt-10 flex justify-center animate-bounce">
          <a href="#form" className="btn-arrow" type="button">
            <img src="/images/arrow-scroll.svg" alt="arrow" />
          </a>
        </div>
      </section>

      <form
        id="form"
        className="h-screen flex flex-col items-center justify-center bg-gray-100"
      >
        <div className="card w-full max-w-lg shadow-sm rounded-lg bg-white">
          <div className="flex flex-col px-8 md:px-16 py-14 gap-7">
            <figure className="flex justify-center">
              <img src="/images/logo.svg" alt="logo" className="w-auto h-16" />
            </figure>

            <div className="flex flex-col items-center gap-4 text-center">
              <strong className="font-roboto font-bold text-2xl text-gray-600">
                Escolha se gostaria de se logar ou se registrar.
              </strong>

              <p className="font-poppins font-normal text-base text-gray-500 text-center">
                Quando fazer o login você já irá poder gerenciar suas retrospectivas!
              </p>
            </div>

            <div className="w-full flex flex-col items-center gap-3">
              <button
                className="w-full btn btn-primary text-white"
                onClick={handleClickLogin}
              >
                Entrar
              </button>

              <button className="w-full btn btn-outline" onClick={handleClickRegister}>
                Inscrever-se
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}

export default HomePage;
