import { useNavigate } from 'react-router-dom';

import { Container } from './styles';

function HomePage() {
  const navigate = useNavigate();

  const handleClickLogin = () => navigate('/login');
  const handleClickRegister = () => navigate('/register');

  return (
    <Container>
      <section className="h-screen flex flex-col">
        <header className="pt-10 px-12 flex items-center justify-between">
          <img src="/images/logo-primary.svg" alt="logo" />
          <a href="#form">
            <button className="py-2.5 px-9 font-roboto bg-gray-100 hover:bg-gray-200">
              Login/Cadastre-se
            </button>
          </a>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <span className="text-4xl font-roboto font-light uppercase">Olá!</span>

          <span className="text-5xl	font-poppins font-bold uppercase">
            Seja bem vindo ao MeetAgile
          </span>

          <p className="text-3xl font-roboto font-light">
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
        <div className="card w-4/12 bg-base-100 shadow-sm rounded-lg">
          <div className="card-body py-14 px-16 gap-7">
            <div className="flex justify-center">
              <img src="/images/logo.svg" alt="logo" />
            </div>

            <div className="flex flex-col items-center gap-4 text-center">
              <strong className="font-roboto font-bold text-2xl text-gray-600">
                Responda para participar da conversa
              </strong>

              <p className="font-poppins font-normal text-base text-gray-500 text-center">
                Quando entrar no Twitter, você poderá responder ao Tweet de Twitter Brasil
                em KS
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
    </Container>
  );
}

export default HomePage;
