import { ChangeEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import request, { api } from '../../../services/api';
import { UserProps } from '../../../interfaces/user';
import { useAuth } from '../../../hooks/useAuth';

interface ResponseProps {
  currentUser: UserProps;
  token: string;
}

const initialState = {
  email: '',
  password: '',
};

export default function HomePage() {
  const navigate = useNavigate();

  const { setAuth } = useAuth();
  const [fields, setFields] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleClickRegister = () => navigate('/register');

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFields((oldValue) => ({ ...oldValue, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);

    request({ method: 'POST', url: '/user/login', data: fields })
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
      sessionStorage.setItem('auth', JSON.stringify(payload));
      api.defaults.headers.Authorization = `Bearer ${response.token}`;

      navigate('/navigation');
    }

    function onError(error: any) {
      alert(error.data.msg);
    }

    function onFinally() {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {};
  }, []);

  return (
    <section>
      <form
        onSubmit={handleSubmit}
        className="h-screen flex flex-col items-center justify-center bg-gray-100"
      >
        <div className="card w-4/12 bg-base-100 shadow-sm rounded-lg">
          <div className="card-body py-14 px-16 gap-7">
            <div className="flex justify-center">
              <img src="/images/logo.svg" alt="logo" />
            </div>

            <strong className="font-roboto font-bold text-2xl text-gray-600 text-center">
              Informe o email e senha vinculada a sua conta
            </strong>

            <div className="w-full flex flex-col gap-2.5">
              <input
                type="email"
                name="email"
                required={true}
                placeholder="Email"
                value={fields.email}
                onChange={handleChangeField}
                className="input input-bordered input-md w-full"
              />

              <input
                type="password"
                name="password"
                required={true}
                placeholder="Senha"
                value={fields.password}
                onChange={handleChangeField}
                className="input input-bordered input-md w-full"
              />
            </div>

            <div className="w-full flex flex-col items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary text-white disabled:loading"
              >
                Entrar
              </button>

              <button
                type="button"
                className="w-full btn btn-outline"
                onClick={handleClickRegister}
              >
                Inscrever-se
              </button>

              <Link to="/forgot-password" className="font-roboto mt-3">
                Esqueci minha senha
              </Link>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
