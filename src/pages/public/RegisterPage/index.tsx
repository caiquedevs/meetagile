import { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdEmail } from 'react-icons/md';
import { RiLockPasswordFill, RiTeamFill } from 'react-icons/ri';
import './styles.css';

import * as actionsAuth from '../../../store/modules/auth/actions';
import * as actionsDashboard from '../../../store/modules/dashboard/actions';
import * as actionsStep from '../../../store/modules/step/actions';

import { Button, Input } from '../../../components';
import { SyntheticEvent } from 'react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const [fields, setFields] = useState({
    teamName: '',
    email: '',
    password: '',
    cpfCnpj: '',
  });

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setFields((oldValue) => ({ ...oldValue, [name]: value }));
  };

  const handleClickBack = () => {
    navigate('/');
  };

  const handleClickLogin = () => {
    navigate('/login');
  };

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    dispatch(actionsStep.stepClear());
    dispatch(actionsDashboard.dashboardClear());
    dispatch(actionsAuth.registerRequest({ navigate, data: fields, setLoading }));
  };

  return (
    <main className="h-screen bg-white dark:bg-slate-900 overflow-auto">
      <section className="register w-full h-screen flex">
        <div className="box-left">
          <button type="button" onClick={handleClickBack}>
            <img src="images/arrow-back.svg" alt="arrow back" className="animate-none" />
          </button>

          <div>
            <h1>CRIAR CONTA</h1>
            <p className="mb-24 font-roboto text-xl text-white">
              Enfim, agora você pode dar seu primeiro passo em direção as suas retrospectivas
              gerenciadas.
            </p>

            <footer className="flex gap-11">
              <button type="button" onClick={handleClickBack}>
                <span className="font-roboto text-base uppercase text-white/70">Voltar</span>
              </button>

              <button type="button" onClick={handleClickLogin}>
                <span className="font-roboto text-base uppercase text-white/70">
                  Já tenho conta
                </span>
              </button>
            </footer>
          </div>
        </div>

        <div className="box-right h-screen py-16 px-20 flex flex-col bg-white">
          <h1 className="w-max pb-2 mb-6 leading-none font-roboto font-bold text-2.5xl text-black/75 border-b-3.5px border-teal-400">
            Criar conta
          </h1>

          <span className="mb-7 font-roboto font-normal text-lg text-black/50 leading-6">
            Para dar seu primeiro passo, basta se cadastrar preenchendo os campos abaixo relativos a
            sua equipe.
          </span>

          <form onSubmit={handleSubmit} className="w-full">
            <fieldset className="w-full flex flex-col gap-5">
              <Input
                type="text"
                name="teamName"
                required={true}
                value={fields.teamName}
                onChange={handleChangeField}
                label="Nome"
                placeholder="Informe o nome do seu time"
                icon={RiTeamFill}
                className="w-full"
              />

              <Input
                type="email"
                name="email"
                required={true}
                value={fields.email}
                onChange={handleChangeField}
                label="EMAIL"
                placeholder="Informe um Email"
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
                placeholder="Informe uma Senha"
                icon={RiLockPasswordFill}
                className="w-full"
                autoComplete="new-password"
                minLength={6}
              />
            </fieldset>

            <Button type="submit" loading={loading} className="btn btn-primary mt-8">
              <span className="text-lg">Continuar</span>
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
