import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container } from './styles';

function HomePage() {
  const [emailSent, setEmailSent] = useState(false);

  const navigate = useNavigate();

  const handleClickSend = () => setEmailSent(true);
  const handleClickCancel = () => navigate('/login');

  if (emailSent) return <FeedBackSendEmail />;

  return (
    <Container>
      <form className="h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="card w-4/12 bg-base-100 shadow-sm rounded-lg">
          <div className="card-body py-14 px-16 gap-7">
            <div className="flex justify-center">
              <img src="/images/logo.svg" alt="logo" />
            </div>

            <strong className="font-roboto font-bold text-2xl text-gray-600 text-center">
              Informe o email vinculado a sua conta
            </strong>

            <div className="w-full flex flex-col gap-2.5">
              <input
                type="text"
                placeholder="Email"
                className="input input-bordered input-md w-full"
              />
            </div>

            <div className="w-full flex flex-col items-center gap-3">
              <button
                className="w-full btn btn-primary text-white"
                onClick={handleClickSend}
              >
                Enviar
              </button>

              <button className="w-full btn btn-outline" onClick={handleClickCancel}>
                Voltar
              </button>
            </div>
          </div>
        </div>
      </form>
    </Container>
  );
}

function FeedBackSendEmail() {
  const navigate = useNavigate();

  const handleClick = () => navigate('/login');

  return (
    <form className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="card w-4/12 bg-base-100 shadow-sm rounded-lg">
        <div className="card-body py-14 px-16 gap-7">
          <strong className="font-roboto font-bold text-2xl text-gray-600 text-center">
            Email enviado
          </strong>

          <p>
            Enviamos um email com instruções de como redefinir sua senha para
            <strong style={{ color: '#000' }}> ricardo@gmail.com.</strong>
            Se você não encontrar o email na sua caixa de entrada, verifique a lixeira ou
            a pasta de spam.
            <br />
            <br />
            Se você não tem mais acesso a esse endereço de email, entre em contato
            conosco.
          </p>

          <div className="w-full flex flex-col items-center gap-3">
            <button className="w-full btn btn-primary text-white" onClick={handleClick}>
              Voltar
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default HomePage;
