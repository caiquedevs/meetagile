import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import './styles.css';

import * as actionsAuth from '../../../store/modules/auth/actions';
import * as actionsDashboard from '../../../store/modules/dashboard/actions';
import * as actionsStep from '../../../store/modules/step/actions';

import { IUser } from '../../../interfaces/user';
import { Button, Input } from '../../../components';

interface ResponseProps {
  currentUser: IUser;
  token: string;
}

const initialState = {
  email: '',
  password: '',
};

export default function LoginPage() {
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

  const handleClickBack = () => {
    navigate('/');
  };

  const handleClickForgot = () => {
    navigate('/forgot-password');
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
    <main className="overflow-scroll">
      <section className="login w-full h-screen flex">
        <div className="box-left">
          <button type="button" onClick={handleClickBack}>
            <img src="images/arrow-back.svg" alt="arrow back" className="animate-none" />
          </button>

          <div>
            <h1>Entrar</h1>
            <p className="mb-24 font-roboto text-xl text-white">
              Agora falta pouco, realize o login ao lado para começara a realizar as suas
              retrospectivas.
            </p>

            <footer className="flex gap-11">
              <button type="button" onClick={handleClickBack}>
                <span className="font-roboto text-base uppercase text-white/70">Voltar</span>
              </button>

              <button type="button" onClick={handleClickRegister}>
                <span className="font-roboto text-base uppercase text-white/70">
                  Não tenho conta
                </span>
              </button>
            </footer>
          </div>
        </div>

        <div className="box-right h-screen py-16 px-20 flex flex-col bg-white">
          <h1 className="w-max pb-2 mb-6 leading-none font-roboto font-bold text-2.5xl text-black/75 border-b-3.5px border-teal-400">
            Entrar
          </h1>

          <span className="mb-7 font-roboto font-normal text-lg text-black/50 leading-6">
            Para realizar o login, preencha os campos abaixo com as informações que você utilizou na
            hora de realizar o cadastro.
          </span>

          <form onSubmit={handleSubmit} className="w-full">
            <fieldset className="w-full flex flex-col gap-5">
              <Input
                type="email"
                required={true}
                name="email"
                value={fields.email}
                onChange={handleChangeField}
                label="EMAIL"
                placeholder="Informe seu Email"
                icon={MdEmail}
                className="w-full"
              />
              <Input
                type="password"
                name="password"
                required={true}
                value={fields.password}
                onChange={handleChangeField}
                label="PASSWORD"
                minLength={6}
                placeholder="Informe sua Senha"
                icon={RiLockPasswordFill}
                className="w-full"
              />
            </fieldset>

            <div className="w-full mt-4 flex justify-between">
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="persist"
                  id="persist"
                  checked
                  disabled
                  className="w-5 h-5 text-lg"
                />
                <span className="font-roboto font-medium text-sm text-black/50">
                  Lembre-se de mim
                </span>
              </span>

              <button type="button" onClick={handleClickForgot} className="w-max">
                <span className="font-roboto font-medium text-sm text-black/50">
                  Esqueci minha senha
                </span>
              </button>
            </div>

            <Button type="submit" loading={loading} className="btn btn-primary mt-8">
              <span className="text-lg">Entrar</span>
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
