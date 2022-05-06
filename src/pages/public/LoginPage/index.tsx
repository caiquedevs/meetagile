import { ChangeEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as actionsAuth from '../../../store/modules/auth/actions';
import * as actionsDashboard from '../../../store/modules/dashboard/actions';
import * as actionsStep from '../../../store/modules/step/actions';

import { UserProps } from '../../../interfaces/user';
import { Button } from '../../../components';

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
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state: any) => state.authReducer);

  const [fields, setFields] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const handleClickRegister = () => navigate('/register');

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFields((oldValue) => ({ ...oldValue, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    dispatch(actionsStep.stepClear());
    dispatch(actionsDashboard.dashboardClear());
    dispatch(actionsAuth.loginRequest({ navigate, data: fields, setLoading }));
  };

  useEffect(() => {
    if (isLoggedIn) navigate('/dashboard');
  }, []);

  if (isLoggedIn) return <></>;

  return (
    <main>
      <form
        onSubmit={handleSubmit}
        className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-900"
      >
        <div className="card w-full max-w-lg shadow-sm rounded-lg bg-white dark:bg-slate-800">
          <div className="flex flex-col px-8 md:px-16 py-14 gap-7">
            <div className="flex justify-center h-20">
              <img src="/images/logo.svg" alt="logo" className="h-14 dark:hidden" />
              <img
                src="/images/logo-white.svg"
                alt="logo"
                className="h-12 hidden dark:flex"
              />
            </div>

            <strong className="font-roboto font-bold text-2xl text-gray-600 text-center dark:text-white">
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
                className="input input-primary dark:!bg-slate-900"
              />

              <input
                type="password"
                name="password"
                required={true}
                placeholder="Senha"
                value={fields.password}
                onChange={handleChangeField}
                className="input input-primary dark:!bg-slate-900"
              />
            </div>

            <div className="w-full flex flex-col items-center gap-3">
              <Button
                type="submit"
                loading={loading}
                className="w-full btn btn-primary text-white disabled:loading"
              >
                Entrar
              </Button>

              <button
                type="button"
                className="w-full btn btn-outline"
                onClick={handleClickRegister}
              >
                Inscrever-se
              </button>

              <Link to="/forgot-password" className="font-roboto mt-3 dark:text-white">
                Esqueci minha senha
              </Link>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}
