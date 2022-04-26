import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import request from '../../../services/api';
import { IEmployee } from '../../../interfaces/employee';

import { Header, Table, VotesField, VotingUser } from '../../../components';
import { IHindsight } from '../../../interfaces/hindsight';
import { IAction } from '../../../interfaces/action';
import StepActions from './StepActions';

interface IStep extends IEmployee {
  votes?: number;
}

interface PropsPage {
  state: {
    hindsight: IHindsight;
    employees: IEmployee[];
    actions: IAction;
    winningEmployee: IEmployee;
    hindMode: 'create' | 'edit' | 'view';
  };
}

export default function StepTwo() {
  const navigate = useNavigate();
  const location = useLocation();

  const { state: navigationProps } = location as PropsPage;

  if (
    navigationProps?.hindMode === 'view' ||
    (navigationProps?.hindMode === 'edit' &&
      navigationProps?.hindsight?.stepThree?.length > 0)
  ) {
    var formatedEmployees = navigationProps?.hindsight?.stepThree.map((item) => ({
      ...item.employee,
      votes: item.votes,
    }));
  } else {
    formatedEmployees = navigationProps?.employees;
  }

  const [employees, setEmployees] = useState<IStep[]>(formatedEmployees);
  const [actions, setActions] = useState<IAction>(navigationProps?.actions);

  const [currentEmployee, setCurrentEmployee] = useState<IEmployee | null>(null);
  const [loadingFinish, setLoadingFinish] = useState(false);

  const headersTable = [
    {
      label: 'Foto',
      value: 'url',
      className: 'hidden sm:table-cell',
    },
    {
      label: 'Nome',
      value: 'employeeName',
      className: 'hidden sm:table-cell',
    },
    {
      label: 'Posição',
      value: 'office',
      className: 'hidden sm:table-cell',
    },
    {
      label: 'Votes',
      value: 'votes',
      className: 'hidden sm:table-cell',
    },
  ];

  const handleClickGoBack = () => {
    navigate('../step-two', { state: { ...navigationProps, employees, actions } });
  };

  const onChangeVotes = (value: number, index: number) => {
    const payload = [...employees];
    payload[index as number].votes = value;
    setEmployees(payload);
  };

  const onUpdateActions = (winningEmployee: IEmployee) => {
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

  const onUpdateHindsight = () => {
    // Setar todos votos undefined como 0
    const copyEmployees = employees?.map((employee) => {
      if (typeof employee.votes === 'undefined') employee.votes = 0;
      return employee;
    });

    let hasVote = false;

    // Buscar maior votação
    const winningEmployee = copyEmployees.reduce(
      (acumulador: IStep, current: IStep, index) => {
        if (current?.votes! > 0) hasVote = true;
        return current?.votes! > acumulador?.votes! ? current : acumulador;
      },
      employees[0]
    );

    // Se não há nenhum voto
    if (!hasVote) return toast.warning('Faça uma votação para continuar');

    // Buscar empates
    const hasADraw = copyEmployees.filter(
      (employee) =>
        employee.votes === winningEmployee.votes && employee._id !== winningEmployee._id
    );

    //Se há algum empate
    if (hasADraw.length) {
      return toast.warning('Houve um impate, desempate para continuar!');
    }

    const stepThree = copyEmployees.map((employee) => ({
      employee: employee._id!,
      votes: employee.votes!,
    }));

    const payload: IHindsight = {
      ...navigationProps?.hindsight,
      stepThree,
      winningEmployee: winningEmployee._id!,
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

  const onFinish = () => {
    onUpdateHindsight();
  };

  const handleClickBackToInit = () => {
    navigate('/new-hindsight');
  };

  useEffect(() => {
    if (!navigationProps?.hindsight) navigate('/new-hindsight');
  }, []);

  if (!navigationProps?.hindsight) return <></>;

  return (
    <>
      <Header
        subTitle="Terceira etapa"
        title="Destaque da Sprint?"
        onBack={handleClickGoBack}
        className="before:!bg-sky-500 dark:before:!bg-sky-500 text-white"
      />

      <div className="w-full flex flex-col lg:flex-row lg:gap-16 pb-16 md:pb-16 px-8 md:px-14">
        <div className="w-full -mt-14 flex-1 flex flex-col gap-8">
          <Table data={employees} colorHeader="text-white" headers={headersTable}>
            {(props: { row: IStep; index: number }) => {
              const handleChangeVotes = (value: number) => {
                onChangeVotes(value, props.index);
              };

              return (
                <tr key={props.row._id}>
                  <td>
                    {props.row?.url ? (
                      <div className="avatar">
                        <div className="w-10 mask mask-squircle">
                          <img src={props.row.url} />
                        </div>
                      </div>
                    ) : (
                      <div className="avatar placeholder">
                        <div className="bg-gray-400 dark:bg-gray-400 text-neutral-content mask mask-squircle w-10">
                          <span className="text-base font-roboto font-medium">
                            {props?.row?.name[0] || ''}
                          </span>
                        </div>
                      </div>
                    )}
                  </td>

                  <td>{props.row.name}</td>
                  <td>{props.row.office}</td>

                  <td>
                    <VotesField
                      value={props.row.votes || 0}
                      onChangeVotes={handleChangeVotes}
                      max={employees.length + 1}
                      disabled={navigationProps?.hindMode === 'view'}
                    />
                  </td>
                </tr>
              );
            }}
          </Table>
        </div>

        <div className="w-auto flex flex-col lg:-mt-40">
          {navigationProps.hindMode !== 'view' ? (
            <VotingUser
              current={[currentEmployee, setCurrentEmployee]}
              onFinish={onFinish}
              loadingFinish={loadingFinish}
            />
          ) : (
            <VotingUser>
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
                    <div className="bg-gray-400 dark:bg-gray-400 text-neutral-content mask mask-squircle w-20">
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
                    className="btn mt-3 border-none bg-sky-500 hover:bg-sky-500 w-max mx-auto"
                  >
                    Voltar para o inicio
                  </button>
                </figcaption>
              </figure>
            </VotingUser>
          )}
        </div>
      </div>
    </>
  );
}
