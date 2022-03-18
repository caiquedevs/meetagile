import { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsCheck2Circle } from 'react-icons/bs';
import request from '../../../services/api';
import { Container } from './styles';

function HomePage() {
  const navigate = useNavigate();

  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    teamName: '',
    email: '',
    password: '',
    cpfCnpj: '',
  });

  const handleClickLogin = () => navigate('/login');

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFields((oldValue) => ({ ...oldValue, [name]: value }));
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    return setRegisterSuccess(true);
    setLoading(true);

    request({ method: 'POST', url: '/user/registers', data: fields })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess(response: any) {
      setRegisterSuccess(true);
    }

    function onError(error: any) {
      alert(error.data.msg);
    }

    function onFinally() {
      setLoading(false);
    }
  };

  if (registerSuccess) return <SuccessPage />;

  return (
    <Container className="bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="h-screen flex flex-col items-center justify-center"
      >
        <div className="card w-4/12 bg-base-100 shadow-sm rounded-lg">
          <div className="card-body py-14 px-16 gap-7">
            <div className="flex justify-center">
              <img src="/images/logo.svg" alt="logo" />
            </div>

            <div className="flex flex-col items-center gap-4 text-center">
              <strong className="font-roboto font-bold text-2xl text-gray-600">
                Inscrever-se
              </strong>

              <p className="font-poppins font-normal text-base text-gray-500 text-center">
                É rapidinho, e você ja poderá interagir com todos os nossos serviços !
              </p>
            </div>

            <div className="w-full flex flex-col gap-2.5">
              <input
                type="text"
                placeholder="Nome do time"
                className="input input-bordered input-md w-full"
              />

              <input
                type="text"
                placeholder="Email"
                className="input input-bordered input-md w-full"
              />

              <input
                type="text"
                placeholder="Senha"
                className="input input-bordered input-md w-full"
              />

              <input
                type="text"
                placeholder="CPF/CNPJ"
                className="input input-bordered input-md w-full"
              />
            </div>

            <div className="w-full flex flex-col items-center gap-3">
              <button type="submit" className="w-full btn btn-primary text-white">
                Continuar
              </button>

              <button className="w-full btn btn-outline" onClick={handleClickLogin}>
                Já tenho uma conta
              </button>
            </div>
          </div>
        </div>
      </form>
    </Container>
  );
}

function SuccessPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/navigation');
  };

  return (
    <Container className=" h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="card w-4/12 bg-base-100 shadow-sm rounded-lg">
        <div className="card-body py-14 px-16 gap-7">
          <div className="flex items-center justify-center">
            <BsCheck2Circle className="iconCheck text-green-500" size="195px" />
          </div>

          <div className="flex flex-col items-center gap-4 text-center">
            <strong className="font-roboto font-bold text-2xl text-gray-600">
              Tudo certo por aqui!
            </strong>

            <p className="font-poppins font-normal text-base text-gray-500 text-center">
              Agora que você se cadastrou, já pode navegar pelo nosso sistema.
            </p>
          </div>

          <div className="w-full flex flex-col items-center gap-3">
            <button
              type="submit"
              className="w-full btn btn-primary text-white"
              onClick={handleClick}
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default HomePage;
