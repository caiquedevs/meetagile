import { ChangeEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Header, Options, Table, VotesField, VotingUser } from '../../../components';
import StepActions from './StepActions';

import { IEmployee } from '../../../interfaces/employee';
import { HindsightProps } from '../../../interfaces/hindsight';

interface IStep {
  employeeName?: string;
  description?: string;
  votes?: number;
  _id?: string;
}

function StepOne() {
  const {
    state: { hindsight, employees },
  }: any = useLocation();

  const navigate = useNavigate();

  const [data, setData] = useState(hindsight as HindsightProps);

  const [mode, setMode] = useState<'create' | number>('create');
  const [currentEmployee, setCurrentEmployee] = useState<IEmployee | null>(null);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [description, setDescription] = useState('');

  const handleClickGoBack = () => {
    navigate('/new-hindsight');
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
    const payload = { ...data };
    payload.stepOne[index as number].votes = value;
    setData(payload);
  };

  const onCreate = () => {
    const payload = {
      employeeName: currentEmployee?.name!,
      description: description,
      votes: 0,
    };

    const copyData = { ...data };
    copyData.stepOne.unshift(payload);
    setData(copyData);
    onReset();
  };

  const onDelete = (index: number) => {
    const payload = { ...data };
    payload.stepOne.splice(index, 1);
    setData(payload);
    onReset();
  };

  const onEdit = () => {
    const payload = { ...data };
    payload.stepOne[mode as number].description = description;
    setData(payload);
    onReset();
  };

  const onFinish = () => {
    navigate('../step-two', { state: { hindsight: data, employees } });
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    mode === 'create' ? onCreate() : onEdit();
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
        className="dark:before:bg-green-400 before:bg-green-400"
      />

      <div className="flex gap-16">
        <div className="w-full mt-8 flex flex-col gap-8 flex-1">
          <Table
            data={data.stepOne}
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
                      max={employees.length}
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
              className="btn mt-2 rounded border-none hover:bg-green-400 bg-green-400"
            >
              {mode === 'create' ? 'Cadastrar' : 'Salvar alterações'}
            </button>
          </form>
        </div>
      </div>

      <StepActions />
    </>
  );
}

export default StepOne;
