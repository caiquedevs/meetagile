import { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '../../../components';
import request from '../../../services/api';
import { Container } from './styles';

function HomePage() {
  const navigate = useNavigate();

  const [emailSent, setEmailSent] = useState<string | boolean>(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const handleClickBack = () => navigate('/login');

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setEmail(value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    setLoading(true);

    request({ method: 'POST', url: '/user/forgot-password', data: { email } })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess(response: any) {
      setEmailSent(response);
    }

    function onError(error: any) {
      toast.error(error.data.msg);
    }

    function onFinally() {
      setLoading(false);
    }
  };

  const FeedBackSendEmail = () => (
    <form className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="card w-full max-w-lg shadow-sm rounded-lg bg-white">
        <div className="flex flex-col px-8 md:px-16 py-14 gap-7">
          <strong className="font-roboto font-bold text-2xl text-gray-600 text-left">
            Email enviado
          </strong>

          <p>
            Enviamos um email com instruções de como redefinir sua senha para
            <strong style={{ color: '#000' }}> {email}.</strong>
            Se você não encontrar o email na sua caixa de entrada, verifique a lixeira ou
            a pasta de spam.
            <br />
            <br />
            Se você não tem mais acesso a esse endereço de email, entre em contato
            conosco.
          </p>

          <div className="w-full flex flex-col items-center gap-3">
            <button
              className="w-full btn btn-primary text-white"
              onClick={handleClickBack}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </form>
  );

  if (emailSent) return <FeedBackSendEmail />;

  return (
    <Container>
      <form
        onSubmit={handleSubmit}
        className="h-screen flex flex-col items-center justify-center bg-gray-100"
      >
        <div className="card w-full max-w-lg shadow-sm rounded-lg bg-white">
          <div className="flex flex-col px-8 md:px-16 py-14 gap-7">
            <div className="flex justify-center h-20">
              <img
                src="/images/logo.svg"
                alt="logo"
                className="animate-fadeIn w-auto h-16"
              />
            </div>

            <strong className="font-roboto font-bold text-2xl text-gray-600 text-center">
              Informe o email vinculado a sua conta
            </strong>

            <div className="w-full flex flex-col gap-2.5">
              <input
                type="email"
                name="email"
                required={true}
                placeholder="Email para recuperação"
                value={email}
                onChange={handleChangeField}
                className="input input-primary"
              />
            </div>

            <div className="w-full flex flex-col items-center gap-3">
              <Button
                type="submit"
                loading={loading}
                className="w-full btn btn-primary text-white disabled:loading"
              >
                Enviar
              </Button>

              <button className="w-full btn btn-outline" onClick={handleClickBack}>
                Voltar
              </button>
            </div>
          </div>
        </div>
      </form>
    </Container>
  );
}

export default HomePage;
