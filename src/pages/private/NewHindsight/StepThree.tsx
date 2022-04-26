import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import request from '../../../services/api';

import { VotingUser } from '../../../components';
import { StepThreeProps } from '../../../interfaces/hindsight';
import { FiArrowLeft } from 'react-icons/fi';
import { ICurrentEmployee } from '../../../components/VotingUser';
import { IStepProps } from '../../../interfaces/stepProps';
import { IEmployee } from '../../../interfaces/employee';
import { IAction } from '../../../interfaces/action';

type Props = {};

export default function StepThree({}: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const { state: navigationProps } = location as IStepProps;
  const [loadingFinish, setLoadingFinish] = useState(false);

  const [actions, setActions] = useState<IAction>(navigationProps?.actions);
  const [employees, setEmployees] = useState<StepThreeProps[]>([]);

  const [indexSlide, setIndexSLide] = useState(0);
  const [employeesVoting, setEmployeesVoting] = useState<StepThreeProps[]>(
    navigationProps.hindsight.stepThree
  );

  const handleClickGoBack = () => {
    navigationProps.hindsight.stepThree = employees;
    navigate('../step-two', { state: navigationProps });
  };

  const decrementOldVote = (id: string) => {
    employees.map((item) => {
      if (item.employee._id === id) item.votes--;
      return item;
    });
  };

  const incrementNewVote = (index: number) => {
    const copyEmployees = [...employees];
    copyEmployees[index].votes++;

    setEmployees(copyEmployees);
  };

  const handleChangeVote = (employee: StepThreeProps, index: number) => {
    const copyEmployeesVoting = [...employeesVoting];
    const currentEmployee = copyEmployeesVoting[indexSlide];

    if (currentEmployee.votedFor === employee.employee._id) {
      decrementOldVote(currentEmployee.votedFor!);
      copyEmployeesVoting[indexSlide].votedFor = null;
    } else {
      decrementOldVote(currentEmployee.votedFor!);
      incrementNewVote(index);
      copyEmployeesVoting[indexSlide].votedFor = employee.employee._id;
    }

    setEmployeesVoting(copyEmployeesVoting);
  };

  const onUpdateActions = (winningEmployee: StepThreeProps) => {
    request({ method: 'PUT', url: `/action/${actions._id}`, data: actions })
      .then(onSuccess)
      .catch(onError);

    function onSuccess() {
      navigate('../step-finish', {
        state: { ...navigationProps, actions, winningEmployee },
      });
    }

    function onError(error: any) {
      toast.error(error.data.msg);
      setLoadingFinish(false);
    }
  };

  const onFinish = () => {
    let hasVote = false;

    // Buscar maior votação
    const winningEmployee = employees.reduce(
      (acumulador: StepThreeProps, current: StepThreeProps, index) => {
        if (current?.votes! > 0) hasVote = true;
        return current?.votes! > acumulador?.votes! ? current : acumulador;
      },
      employees[0]
    );

    // Se não há nenhum voto
    if (!hasVote) return toast.warning('Faça uma votação para continuar');

    // Buscar empates
    const hasADraw = employees.filter(
      (employee) =>
        employee.votes === winningEmployee.votes &&
        employee.employee !== winningEmployee.employee
    );

    //Se há algum empate
    if (hasADraw.length) {
      return toast.warning('Houve um impate, desempate para continuar!');
    }

    const payload = {
      ...navigationProps.hindsight,
      StepThree: employees,
      winningEmployee: winningEmployee.employee,
    };

    setLoadingFinish(true);

    request({
      method: 'PUT',
      url: `/hindsight/${navigationProps?.hindsight._id}`,
      data: payload,
    })
      .then(onSuccess)
      .catch(onError);

    function onSuccess() {
      onUpdateActions(winningEmployee);
    }

    function onError(error: any) {
      toast.error(error.data.msg);
      setLoadingFinish(false);
    }
  };

  const handleClickBackToInit = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    const filterEmployees = navigationProps.hindsight?.stepThree.filter(
      (item) => item.employee
    );

    setEmployees(filterEmployees);
    return () => {};
  }, []);

  return (
    <section className="w-full min-h-screen bg-white">
      <header
        className="
          w-full h-64
          before:content-['']
          before:w-full before:h-full
          before:block before:absolute
          before:bg-sky-500
        "
      >
        <div className="pt-16 md:pt-24 px-8 md:px-14 flex gap-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-3 items-center">
              <button type="button" onClick={handleClickGoBack} className="flex">
                <FiArrowLeft size="23" color="#ffffff" />
              </button>

              <h2 className="text-base md:text-lg font-medium text-white">
                Terceira etapa
              </h2>
            </div>

            <h1 className="font-bold text-2xl sm:text-2.5xl text-white">
              Destaque da Sprint?
            </h1>
          </div>
        </div>
      </header>

      <div className="w-full flex flex-col lg:flex-row lg:gap-16 pb-16 md:pb-16 px-8 md:px-14">
        <div className="w-full -mt-12 flex flex-col flex-1 gap-2">
          <span className="flex text-white font-roboto text-base font-normal">
            Selecione um funcionário abaixo
          </span>

          <ul className="w-full flex flex-col gap-2">
            {employees.map((employee, index) => {
              const onChangeVote = () => handleChangeVote(employee, index);
              const currentEmployee = employeesVoting[indexSlide];

              const isTheVoter = currentEmployee?.employee._id === employee.employee._id;
              const isTheVote = currentEmployee?.votedFor === employee.employee._id;

              return (
                <li key={employee.employee._id} className="h-max">
                  <input
                    className="sr-only peer"
                    type="checkbox"
                    value="yes"
                    name="answer"
                    onChange={onChangeVote}
                    checked={navigationProps.mode !== 'view' && isTheVote}
                    disabled={navigationProps.mode === 'view' || isTheVoter}
                    id={employee.employee._id!}
                  />

                  <label
                    className={`p-4 pr-10 shadow-card
                    flex items-center gap-5
                    rounded bg-white select-none
                    peer-checked:ring-green-400
                    disabled:peer-checked:!ring-gray-default
                    peer-checked:bg-green-100
                    peer-checked:ring-2
                    peer-checked:border-transparent
                    disabled:hover:!bg-white
                    ${
                      isTheVoter || navigationProps.mode === 'view'
                        ? ''
                        : 'cursor-pointer hover:bg-gray-100'
                    }

                   `}
                    htmlFor={employee.employee._id!}
                  >
                    <article
                      className={`
                        w-full
                        flex items-center gap-5
                        ${
                          isTheVoter && navigationProps.mode !== 'view'
                            ? 'opacity-50'
                            : 'opacity-100'
                        }
                      `}
                    >
                      {employee.employee?.url ? (
                        <img
                          src={employee.employee?.url}
                          alt="user image"
                          className="w-16 h-16 rounded-3xl"
                        />
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center text-white uppercase rounded-xl bg-gray-400">
                          <span className="text-2xl font-roboto font-medium">
                            {employee.employee?.name[0]}
                          </span>
                        </div>
                      )}

                      <div className="w-full flex items-center justify-between">
                        <div>
                          <strong className="text-base">{employee.employee?.name}</strong>
                          <span className="text-base">{employee.employee?.office}</span>
                        </div>

                        <span className="text-base text-gray-600">
                          {employee.votes} {employee.votes === 1 ? 'voto' : 'votos'}
                        </span>
                      </div>
                    </article>
                  </label>

                  <div className="w-5 h-5 absolute top-9 right-3 hidden peer-checked:flex">
                    👍
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {navigationProps.mode !== 'view' ? (
          <aside className="lg:min-w-400px">
            <div className="lg:fixed lg:-mt-40">
              <VotingUser
                useEmployeesVoting={[employeesVoting, setEmployeesVoting]}
                useIndexSlide={[indexSlide, setIndexSLide]}
                loadingFinish={loadingFinish}
                onFinish={onFinish}
              />
            </div>
          </aside>
        ) : (
          <VotingUser
            useEmployeesVoting={[employeesVoting, setEmployeesVoting]}
            useIndexSlide={[indexSlide, setIndexSLide]}
            loadingFinish={loadingFinish}
            onFinish={onFinish}
          >
            <h2 className="text-sky-500 text-2xl font-bold uppercase">
              Destaque da Sprint
            </h2>
            <figure className="flex flex-col items-center justify-center">
              {navigationProps?.hindsight.winningEmployee?.url ? (
                <div className="avatar">
                  <div className="w-20 mask mask-squircle">
                    <img src={navigationProps?.hindsight.winningEmployee.url} />
                  </div>
                </div>
              ) : (
                <div className="avatar placeholder">
                  <div className="w-20 h-20 flex items-center justify-center text-white uppercase rounded-3xl bg-gray-400">
                    <span className="text-2xl font-roboto font-medium">
                      {navigationProps?.hindsight.winningEmployee?.name[0]}
                    </span>
                  </div>
                </div>
              )}

              <figcaption className="mt-3.5 flex flex-col items-center justify-center gap-2">
                <strong className="text-base text-center">
                  {navigationProps?.hindsight.winningEmployee?.name}
                </strong>
                <span className="text-base text-center">
                  {navigationProps?.hindsight.winningEmployee?.office}
                </span>

                <button
                  type="button"
                  onClick={handleClickBackToInit}
                  className="btn btn-primary px-5 mt-3 border-none !bg-sky-500 !hover:bg-sky-500 w-max mx-auto"
                >
                  Voltar para o inicio
                </button>
              </figcaption>
            </figure>
          </VotingUser>
        )}
      </div>
    </section>
  );
}
