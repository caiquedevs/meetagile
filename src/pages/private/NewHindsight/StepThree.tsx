import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';

import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '../../../store/modules/rootReducer';
import * as actionsStep from '../../../store/modules/step/actions';
import * as actionsDashboard from '../../../store/modules/dashboard/actions';

import { useRequest } from '../../../hooks/useRequest';
import { IEmployee } from '../../../interfaces/employee';
import { IStepThree } from '../../../interfaces/hindsight';
import { INavigationStepProps } from '../../../interfaces/navigationStep';

import { VotingUser } from '../../../components';
import { IAction } from '../../../interfaces/action';

export default function StepThree() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const request = useRequest();

  const { state: navigationProps } = location as INavigationStepProps;

  const { currentHindsight } = useSelector((state: IRootState) => state.stepReducer);
  const { hindsights } = useSelector((state: IRootState) => state.dashboardReducer);

  const [employeesList, setEmployeesList] = useState([] as any[]);

  const [indexSlide, setIndexSLide] = useState(0);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const handleClickGoBack = () => {
    const payload = { state: { ...navigationProps } };
    navigate('../step-two', payload);
  };

  const handleClickBackToInit = () => {
    navigate(navigationProps?.returnUrl!);
  };

  const getIndexFromDecrement = (arr: IStepThree[], id: string) => {
    return arr.findIndex((employee) => employee._id === id);
  };

  const handleChangeVote = (employeeSelected: any, index: number) => {
    const copyHindsight = { ...currentHindsight };
    const copyStepThree = [...currentHindsight?.stepThree];

    const idOldVotedFor = currentHindsight?.stepThree[indexSlide].votedFor?._id;
    const indexOldVotedFor = getIndexFromDecrement(copyStepThree, idOldVotedFor!);

    // Se funcionário ja foi escolhido. desmarcar funcionário!
    if (idOldVotedFor === employeeSelected?._id) {
      copyStepThree[index].votes--;
      copyStepThree[indexSlide].votedFor = null;
    } else {
      copyStepThree[index].votes++;
      copyStepThree[indexSlide].votedFor = employeeSelected;
      indexOldVotedFor >= 0 && copyStepThree[indexOldVotedFor].votes--;
    }

    copyHindsight.stepThree = copyStepThree;
    dispatch(actionsStep.setCurrentHindsight(copyHindsight));
  };

  const onUpdate = (winningEmployee: IEmployee) => {
    const copyCurrentHindsight = { ...currentHindsight };
    copyCurrentHindsight.winningEmployee = winningEmployee;

    setLoadingSubmit(true);

    request({
      method: 'PUT',
      url: `/hindsight`,
      data: copyCurrentHindsight,
    })
      .then(onSuccess)
      .catch(onError);

    function onSuccess() {
      const filtered = hindsights.map((item) => {
        if (item._id === copyCurrentHindsight._id) return copyCurrentHindsight;
        return item;
      });

      navigate('../step-finish', { state: { ...navigationProps, winningEmployee } });
      dispatch(actionsStep.removeHindsightPending(copyCurrentHindsight?._id!));
      dispatch(actionsDashboard.setHindsights(filtered));
    }

    function onError(error: any) {
      toast.error(error.data.msg);
      setLoadingSubmit(false);
    }
  };

  const onSubmit = () => {
    let hasVote = false;

    // Buscar maior votação
    const winningEmployee = currentHindsight?.stepThree?.reduce(
      (acumulador: IStepThree, current: IStepThree, index) => {
        if (current?.votes! > 0) hasVote = true;
        return current?.votes! > acumulador?.votes! ? current : acumulador;
      },
      currentHindsight?.stepThree[0]
    );

    // Se não há nenhum voto
    if (!hasVote) return toast.warning('Faça uma votação para continuar');

    // Buscar empates
    const hasADraw = currentHindsight?.stepThree?.filter(
      (employee) =>
        employee.votes === winningEmployee.votes && employee._id !== winningEmployee._id
    );

    //Se há algum empate
    if (hasADraw.length) {
      return toast.warning('Houve um impate, desempate para continuar!');
    }

    onUpdate(winningEmployee);
  };

  useEffect(() => {
    const filtered = currentHindsight?.stepThree?.map((item) => ({
      _id: item._id,
      user_id: item.user_id,
      name: item.name,
      office: item.office,
      url: item.url,
      votes: item.votes,
    }));

    setEmployeesList(filtered);

    return () => {};
  }, [currentHindsight]);

  useEffect(() => {
    window.scrollTo(0, 0);

    return () => {};
  }, []);

  return (
    <section className="w-full min-h-screen bg-white dark:bg-slate-900">
      <header
        className="
          w-full h-64
          before:content-['']
          before:w-full before:h-full
          before:block before:absolute
          before:bg-sky-500 dark:before:bg-sky-700
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
            {employeesList.map((employee, index) => {
              const onChangeVote = () => handleChangeVote(employee, index);
              const currentEmployee = currentHindsight?.stepThree[indexSlide];

              const isTheVoter = currentEmployee?._id === employee?._id;
              const isTheVote = currentEmployee?.votedFor?._id === employee?._id;

              return (
                <li key={employee._id} className="h-max">
                  <input
                    className="sr-only peer"
                    type="checkbox"
                    value="yes"
                    name="answer"
                    onChange={onChangeVote}
                    checked={navigationProps.mode !== 'view' && isTheVote}
                    disabled={navigationProps.mode === 'view' || isTheVoter}
                    id={employee._id!}
                  />

                  <label
                    style={{ minHeight: 82 }}
                    className={`p-4 pr-10 shadow-card
                    flex items-center gap-5
                    rounded bg-white dark:bg-slate-800 select-none
                    peer-checked:ring-green-400
                    disabled:peer-checked:!ring-gray-default
                    peer-checked:bg-green-100 dark:peer-checked:bg-green-900
                    peer-checked:ring-2
                    peer-checked:border-transparent
                    disabled:hover:!bg-white
                    ${
                      isTheVoter || navigationProps.mode === 'view'
                        ? ''
                        : 'cursor-pointer hover:bg-gray-100'
                    }
                  `}
                    htmlFor={employee?._id!}
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
                      {employee?.url ? (
                        <img
                          src={employee?.url}
                          alt="user image"
                          className="w-16 h-16 rounded-3xl"
                        />
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center text-white uppercase rounded-xl bg-gray-400">
                          <span className="text-2xl font-roboto font-medium">
                            {employee?.name[0]}
                          </span>
                        </div>
                      )}

                      <div className="w-full flex items-center justify-between">
                        <div>
                          <strong className="text-base dark:text-white">
                            {employee?.name}
                          </strong>
                          <span className="text-base dark:text-white/90">
                            {employee?.office}
                          </span>
                        </div>

                        <span className="text-base text-gray-600 dark:text-white">
                          {employee?.votes || 0}
                          {employee?.votes === 1 ? ' voto' : ' votos'}
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
                useIndexSlide={[indexSlide, setIndexSLide]}
                loadingFinish={loadingSubmit}
                onFinish={onSubmit}
              />
            </div>
          </aside>
        ) : (
          <VotingUser
            useIndexSlide={[indexSlide, setIndexSLide]}
            loadingFinish={loadingSubmit}
            onFinish={onSubmit}
          >
            <h2 className="text-sky-500 dark:text-white text-2xl font-bold uppercase">
              Destaque da Sprint
            </h2>
            <figure className="flex flex-col items-center justify-center">
              {currentHindsight?.winningEmployee?.url ? (
                <img
                  src={currentHindsight?.winningEmployee.url}
                  alt="user image"
                  className="w-20 h-20 rounded-3xl"
                />
              ) : (
                <div className="w-20 h-20 flex items-center justify-center text-white uppercase rounded-xl bg-gray-400">
                  <span className="text-2xl font-roboto font-medium">
                    {currentHindsight?.winningEmployee?.name[0]}
                  </span>
                </div>
              )}

              <figcaption className="mt-3.5 flex flex-col items-center justify-center gap-2">
                <strong className="text-base text-center dark:text-white">
                  {currentHindsight?.winningEmployee?.name}
                </strong>
                <span className="text-base text-center dark:text-white/80">
                  {currentHindsight?.winningEmployee?.office}
                </span>
                <span className="text-base text-center dark:text-white/80">
                  {
                    employeesList.filter(
                      (item: IEmployee) =>
                        item._id === currentHindsight?.winningEmployee?._id
                    )[0]?.votes
                  }
                  {' Votos'}
                </span>

                <button
                  type="button"
                  onClick={handleClickBackToInit}
                  className="btn btn-primary px-5 mt-3 border-none !bg-sky-500 dark:!bg-sky-800 !hover:bg-sky-500 w-max mx-auto"
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
