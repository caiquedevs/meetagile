import { ChangeEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Header, Options, Table, VotesField, VotingUser } from '../../../components';
import { IAction } from '../../../interfaces/action';

import { IEmployee } from '../../../interfaces/employee';
import { IHindsight } from '../../../interfaces/hindsight';
import StepActions from './StepActions';

interface IStep {
  employeeName?: string;
  description?: string;
  votes?: number;
  _id?: string;
}

interface PropsPage {
  state: {
    hindsight: IHindsight;
    employees: IEmployee[];
    actions: IAction;
  };
}

function StepTwo() {
  const navigate = useNavigate();

  const location = useLocation();
  const { state: navigationProps } = location as PropsPage;

  const [hindsight, setHindsight] = useState<IHindsight>(navigationProps?.hindsight);
  const [actions, setActions] = useState<IAction>(navigationProps?.actions);

  const [mode, setMode] = useState<'create' | number>('create');
  const [currentEmployee, setCurrentEmployee] = useState<IEmployee | null>(null);
  const [description, setDescription] = useState('');

  const handleClickGoBack = () => {
    navigate('../step-one', {
      state: { ...navigationProps, hindsight, actions },
    });
  };

  const onReset = () => {
    setMode('create');
    setDescription('');
  };

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setDescription(value);
  };

  const onChangeVotes = (value: number, index: number) => {
    const payload = { ...hindsight };
    payload.stepTwo[index as number].votes = value;
    setHindsight(payload);
  };

  const onCreate = () => {
    const payload = {
      employeeName: currentEmployee?.name!,
      description: description,
      votes: 0,
    };

    const copyData = { ...hindsight };
    copyData.stepTwo.unshift(payload);
    setHindsight(copyData);
    onReset();
  };

  const onDelete = (index: number) => {
    const payload = { ...hindsight };
    payload.stepTwo.splice(index, 1);
    setHindsight(payload);
    onReset();
  };

  const onEdit = () => {
    const payload = { ...hindsight };
    payload.stepTwo[mode as number].description = description;
    setHindsight(payload);
    onReset();
  };

  const onFinish = () => {
    navigate('../step-three', { state: { ...navigationProps, hindsight, actions } });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    mode === 'create' ? onCreate() : onEdit();
  };

  useEffect(() => {
    if (!navigationProps) navigate('/new-hindsight');
  }, []);

  if (!navigationProps) return <></>;

  return (
    <>
      <Header
        subTitle="Segunda etapa"
        title="O que pode melhorar?"
        onBack={handleClickGoBack}
        className="before:bg-red-400 dark:before:bg-red-400 text-white"
      />

      <div className="flex gap-16">
        <div className="w-full mt-8 flex flex-col gap-8 flex-1">
          <Table
            data={hindsight.stepTwo}
            colorHeader="text-white"
            headers={['Nome', 'Opnião', 'Concordância', '']}
          >
            {(props: { row: IStep; index: number }) => {
              const handleClickDelete = () => onDelete(props.index);
              const handleClickEdit = () => {
                setMode(props.index!);
                setDescription(props.row.description!);
              };

              const handleChangeVotes = (value: number) => {
                onChangeVotes(value, props.index);
              };

              return (
                <tr key={props.row._id}>
                  <td>
                    <span>{props.row.employeeName}</span>
                  </td>

                  <td>
                    <span>{props.row.description}</span>
                  </td>

                  <td>
                    <VotesField
                      value={props.row.votes!}
                      onChangeVotes={handleChangeVotes}
                      max={navigationProps?.employees.length}
                    />
                  </td>

                  <td>
                    <Options
                      item={props.row}
                      loadingDelete=""
                      onDelete={handleClickDelete}
                      onEdit={handleClickEdit}
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

          <form onSubmit={handleSubmit} className="flex flex-col mt-2">
            <input
              type="text"
              name="hindsightName"
              placeholder="O que o Felipiano tem a dizer?"
              required={true}
              value={description}
              onChange={handleChangeField}
              className="input input-bordered w-full rounded focus:outline-none "
            />

            <button
              type="submit"
              className="btn mt-2 rounded border-none hover:bg-red-400 bg-red-400"
            >
              {mode === 'create' ? 'Cadastrar' : 'Salvar alterações'}
            </button>
          </form>
        </div>
      </div>

      <StepActions useActions={[actions, setActions]} />
    </>
  );
}

export default StepTwo;
