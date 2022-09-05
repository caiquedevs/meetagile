import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as actionsAuth from '../../../store/modules/auth/actions';
import './styles.css';

function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  return (
    <main className="h-screen bg-white dark:bg-slate-900 overflow-auto scroll-smooth">
      <section className="section-one h-screen pt-11 flex flex-col items-center justify-between">
        <header className="w-full h-auto px-20 flex items-center justify-between">
          <figure className="w-44 h-px">
            <img src="images/logo-white.svg" alt="logo" />
          </figure>
          <ul className="flex items-center gap-6 font-roboto font-normal text-lg text-white">
            <li>
              <a href="#about"> Sobre nós</a>
            </li>
            <li>
              <a href="#about-app">Nosso app</a>
            </li>
            <li>
              <a href="#other-infos">Informações</a>
            </li>
            <li>
              <a href="#init">Começar</a>
            </li>
          </ul>

          <div className="flex items-center justify-center gap-10">
            <button type="button" onClick={handleClickRegister}>
              <span className="font-roboto font-normal text-lg text-white">Criar conta</span>
            </button>

            <button type="button" onClick={handleClickLogin}>
              <span className="font-roboto font-normal text-lg text-white">Entrar</span>
            </button>
          </div>
        </header>

        <h1>Sua retrospectiva em outro patamar</h1>

        <footer className="mb-4 flex flex-col items-center justify-center gap-3">
          <span className="font-roboto font-normal text-lg text-white">Scroll Down</span>
          <span className="w-1 h-7 rounded bg-white" />
        </footer>
      </section>

      <section
        id="about"
        className="section-two h-screen pt-10 flex flex-col items-center justify-center"
      >
        <h1 className="mb-10">Sobre nós</h1>
        <p className="mb-16 font-roboto text-xl text-black/75 text-center">
          O Meetagile nasceu para ajudar você a turbinar sua retrospectiva, com essa ferramenta,
          você tera a opção de gerenciar toda a sua retrospectiva, Desde os funcionários, até cada
          etapa da retrospectiva. Entregando a você total controle sobre a qualidade da sua Sprint,
          tudo através do nosso sistema web e aplicativo.
        </p>

        <footer className="w-full flex flex-col items-center justify-center gap-9">
          <span className="w-1 h-10 rounded bg-black/30" />
          <button className="btn btn-primary w-full max-w-300px">Registrar-se</button>
        </footer>
      </section>

      <section className="section-three" />

      <section className="section-four flex">
        <div id="about-app" className="box-left h-screen -mt-56 flex items-center justify-end">
          <img src="images/smartphone.svg" alt="app" className="mt-20 -mr-14 z-10" />
        </div>

        <div className="box-right flex flex-col items-center justify-center">
          <div className="w-96">
            <h1>Sobre nosso app</h1>
            <p className="font-roboto font-normal text-base text-white/90">
              Nosso app está em <strong className="text-teal-400">fase de desenvolvimento</strong>,
              mas tem o proposito de permitir que todos do time consigam colher feedbacks sobre as
              retrospectivas realizadas através do seu smartphone. No app eles poderão interagir com
              as retrospectivas realizadas, se informando sobre o que foi bom, o que foi ruim e o
              destaque de determinada Sprint.
            </p>

            <button className="btn btn-primary !w-max px-12 mt-11" disabled>
              em breve!
            </button>
          </div>
        </div>
      </section>

      <section className="section-five flex flex-col items-center justify-center">
        <figure id="other-infos" className="absolute -top-60 right-80">
          <img src="images/thumb-section-five.png" alt="thumb" className="rounded-xl" />
        </figure>

        <h1 className="font-roboto font-bold text-8xl text-white text-center">UMA GLOBO SÓ!</h1>
        <span className="block font-roboto font-normal text-2xl text-white text-center">
          Juntos somos grandes!
        </span>
      </section>

      <section className="section-six">
        <span className="w-1 h-20 -mt-9 bg-white rounded" />

        <div className="text-group">
          <p className="font-roboto font-normal text-base text-white/90 text-center">
            Somos parte do time de aquisição da Editora Globo, Oque significa que o meetagile foi
            desenvolvido pensado nas retrospectivas de nossos times, tornando ideal para todos nós!
            Sinta-se a vontade de propor melhorias e converse com seu time para utilizar o meetagile
            hoje mesmo!
          </p>

          <h1 className="font-roboto font-bold text-2xl text-white text-center">
            Meetagile feito com carinho para seu time!
          </h1>
        </div>
      </section>

      <section className="section-seven" />

      <section id="init" className="section-finally">
        <div className="text-group">
          <h1>Não perca tempo comece agora !</h1>

          <p className="font-roboto font-normal text-base text-black/75 text-center">
            Comece agora a utilizar nossa ferramenta, o meetagile pode trazer benefícios para seu
            time. registre-se atraveś dos botões abaixo ou caso já possua cadastro, realize seu
            login!
          </p>
        </div>

        <div className="w-full mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={handleClickRegister}
            className="btn btn-primary !w-max px-14"
          >
            Criar conta
          </button>
          <button
            type="button"
            onClick={handleClickLogin}
            className="btn btn-outline !border-teal-500 !text-teal-500 !w-max px-14"
          >
            Entrar
          </button>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
