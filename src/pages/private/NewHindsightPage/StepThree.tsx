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
    winningEmployee: IEmployee[];
  };
}

export default function StepTwo() {
  const navigate = useNavigate();

  const location = useLocation();
  const { state: navigationProps } = location as PropsPage;

  const [employees, setEmployees] = useState<IStep[]>(navigationProps?.employees);
  const [actions, setActions] = useState<IAction>(navigationProps?.actions);

  const [currentEmployee, setCurrentEmployee] = useState<IEmployee | null>(null);
  const [loadingFinish, setLoadingFinish] = useState(false);

  const handleClickGoBack = () => {
    navigate('../step-two', { state: { ...navigationProps, employees, actions } });
  };

  const onChangeVotes = (value: number, index: number) => {
    const payload = [...employees];
    payload[index as number].votes = value;
    setEmployees(payload);
  };

  const onUpdateHindsight = () => {
    const copyEmployees = employees.map((employee) => {
      if (typeof employee.votes === 'undefined') employee.votes = 0;
      return employee;
    });

    let hasADraw = false;
    let hasVote = false;

    var winningEmployee = copyEmployees.reduce(
      (acumulador: IStep, current: IStep, index) => {
        if (current?.votes! > 0) hasVote = true;

        if (index > 0 && current?.votes! > 0 && current?.votes === acumulador?.votes)
          hasADraw = true;

        return current?.votes! > acumulador?.votes! ? current : acumulador;
      },
      employees[0]
    );

    if (hasADraw) return toast.warning('Houve um empate, desempate para continuar!');
    if (!hasVote) return toast.warning('Faça uma votação para continuar');

    const payload = {
      ...navigationProps?.hindsight,
      employee_id: winningEmployee._id,
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

  const onFinish = () => {
    onUpdateHindsight();
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
        className="before:bg-sky-500 dark:before:bg-sky-500 text-white"
      />

      <div className="flex gap-16">
        <div className="w-full mt-8 flex flex-col gap-8 flex-1">
          <Table
            data={employees}
            colorHeader="text-white"
            headers={['Foto', 'Nome', 'Posição', 'Votos']}
          >
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
                            {props.row.name[0]}
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
                    />
                  </td>
                </tr>
              );
            }}
          </Table>
        </div>

        <div style={{ marginTop: '-74px' }}>
          <VotingUser
            current={[currentEmployee, setCurrentEmployee]}
            onFinish={onFinish}
            loadingFinish={loadingFinish}
          />
        </div>
      </div>

      <StepActions useActions={[actions, setActions]} />
    </>
  );
}
