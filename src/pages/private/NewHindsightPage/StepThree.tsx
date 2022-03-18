import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import request from '../../../services/api';
import { IEmployee } from '../../../interfaces/employee';

import { Header, Table, VotesField, VotingUser } from '../../../components';
import StepActions from './StepActions';

interface IStep extends IEmployee {
  votes?: number;
}

function StepTwo() {
  const {
    state: { hindsight, employees },
  }: any = useLocation();

  const navigate = useNavigate();
  const [data, setData] = useState<IStep[]>(employees as IStep[]);
  const [currentEmployee, setCurrentEmployee] = useState<IEmployee | null>(null);
  const [loadingFinish, setLoadingFinish] = useState(false);

  const handleClickGoBack = () => {
    navigate('../step-two', { state: { hindsight, employees } });
  };

  const onChangeVotes = (value: number, index: number) => {
    const payload = [...data];
    payload[index as number].votes = value;
    setData(payload);
  };

  const onFinish = () => {
    setLoadingFinish(true);

    var winningEmployee = data.reduce((acumulador: IStep, current: IStep) => {
      return current.votes! > acumulador.votes! ? current : acumulador;
    }, data[0]);

    const payload = {
      ...hindsight,
      employee: winningEmployee._id,
    };

    request({ method: 'PUT', url: `/hindsight/${hindsight._id}`, data: payload })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess(response: any) {
      setData(response);
      navigate('../step-finish', { state: { hindsight, winningEmployee } });
    }

    function onError(error: any) {
      toast.error(error.data.msg);
    }

    function onFinally() {
      setLoadingFinish(false);
    }
  };

  useEffect(() => {
    if (!hindsight) navigate('/new-hindsight');
  }, []);

  if (!hindsight) return <></>;

  return (
    <>
      <Header
        subTitle="Terceira etapa"
        title="Destaque da Sprint?"
        onBack={handleClickGoBack}
        className="before:bg-sky-500 dark:before:bg-sky-500"
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
          />
        </div>
      </div>

      <StepActions />
    </>
  );
}

export default StepTwo;
