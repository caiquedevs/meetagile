import { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsCheck2Circle } from 'react-icons/bs';
import request, { api } from '../../../services/api';

import { UserProps } from '../../../interfaces/user';
import { useAuth } from '../../../hooks/useAuth';
import { toast } from 'react-toastify';
import { Button } from '../../../components';

interface ResponseProps {
  currentUser: UserProps;
  token: string;
}

function HomePage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [loadingRegister, setLoadingRegister] = useState(false);
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
    setLoadingRegister(true);

    request({ method: 'POST', url: '/user/register', data: fields })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess(response: ResponseProps) {
      const payload = {
        isLoggedIn: true,
        token: response.token,
        user: response.currentUser,
      };

      setAuth(payload);
      localStorage.setItem('auth', JSON.stringify(payload));
      api.defaults.headers.Authorization = `Bearer ${response.token}`;

      setRegisterSuccess(true);
    }

    function onError(error: any) {
      toast.error(error.data.msg);
    }

    function onFinally() {
      setLoadingRegister(false);
    }
  };

  if (registerSuccess) return <SuccessPage />;

  return (
    <section className="bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="min-h-screen flex flex-col items-center justify-center"
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
                name="teamName"
                required={true}
                placeholder="Nome do time"
                value={fields.teamName}
                onChange={handleChangeField}
                className="input input-primary"
              />

              <input
                type="email"
                name="email"
                required={true}
                placeholder="Email"
                value={fields.email}
                onChange={handleChangeField}
                className="input input-primary"
              />

              <input
                type="password"
                name="password"
                required={true}
                placeholder="Senha"
                value={fields.password}
                onChange={handleChangeField}
                className="input input-primary"
              />
            </div>

            <div className="w-full flex flex-col items-center gap-3">
              <Button
                type="submit"
                loading={loadingRegister}
                className="w-full btn btn-primary text-white disabled:loading"
              >
                Continuar
              </Button>

              <button className="w-full btn btn-outline" onClick={handleClickLogin}>
                Já tenho uma conta
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

function SuccessPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/dashboard');
  };

  return (
    <section className=" h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="card w-4/12 shadow-sm rounded-lg bg-white">
        <div className="flex flex-col py-14 px-16 gap-7">
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
    </section>
  );
}

export default HomePage;
