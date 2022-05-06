import { ChangeEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as actionsAuth from '../../../store/modules/auth/actions';
import * as actionsDashboard from '../../../store/modules/dashboard/actions';
import * as actionsStep from '../../../store/modules/step/actions';

import { Button } from '../../../components';
import { useDispatch } from 'react-redux';

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [fields, setFields] = useState({
    teamName: '',
    email: '',
    password: '',
    cpfCnpj: '',
  });

  const handleClickNavigateToLogin = () => navigate('/login');

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFields((oldValue) => ({ ...oldValue, [name]: value }));
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    dispatch(actionsStep.stepClear());
    dispatch(actionsDashboard.dashboardClear());
    dispatch(actionsAuth.registerRequest({ navigate, data: fields, setLoading }));
  };

  return (
    <section className="bg-gray-100 dark:bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="min-h-screen flex flex-col items-center justify-center"
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

            <div className="flex flex-col items-center gap-4 text-center">
              <strong className="font-roboto font-bold text-2xl text-gray-600 dark:text-white">
                Inscrever-se
              </strong>

              <p className="font-poppins font-normal text-base text-gray-500 dark:text-white/80 text-center">
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
                className="input input-primary dark:!bg-slate-900"
              />

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
                Continuar
              </Button>

              <button
                className="w-full btn btn-outline"
                onClick={handleClickNavigateToLogin}
              >
                Já tenho uma conta
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
