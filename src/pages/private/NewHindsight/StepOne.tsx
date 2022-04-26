import { ChangeEvent, useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useLocation, Location, useNavigate } from 'react-router-dom';

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
    hindMode: 'create' | 'edit' | 'view';
  };
}

function StepOne() {
  const navigate = useNavigate();
  const location = useLocation();

  const { state: navigationProps } = location as PropsPage;

  const [hindsight, setHindsight] = useState<IHindsight>(navigationProps?.hindsight);
  const [actions, setActions] = useState<IAction>(navigationProps?.actions);

  const [mode, setMode] = useState<'create' | number>('create');
  const [currentEmployee, setCurrentEmployee] = useState<IEmployee | null>(null);
  const [description, setDescription] = useState('');

  const headersTable = [
    {
      label: 'Nome',
      value: 'employeeName',
      className: 'hidden sm:table-cell',
    },
    {
      label: 'Opnião',
      value: 'description',
      className: 'hidden sm:table-cell',
    },
    {
      label: 'Concordância',
      value: 'votes',
      className: 'hidden sm:table-cell',
    },
  ];

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
    const payload = { ...hindsight };
    payload.stepOne[index as number].votes = value;
    setHindsight(payload);
  };

  const onCreate = () => {
    const payload = {
      employeeName: currentEmployee?.name!,
      description: description,
      votes: 0,
    };

    const copyData = { ...hindsight };
    copyData.stepOne.push(payload);
    setHindsight(copyData);
    onReset();
  };

  const onDelete = (index: number) => {
    const payload = { ...hindsight };
    payload.stepOne.splice(index, 1);
    setHindsight(payload);
    onReset();
  };

  const onEdit = () => {
    const payload = { ...hindsight };
    payload.stepOne[mode as number].description = description;
    setHindsight(payload);
    onReset();
  };

  const handleClickNext = () => {
    navigate('../step-two', {
      state: { ...navigationProps, hindsight, actions },
    });
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
        subTitle="Primeira etapa"
        title="O que foi bom nessa Sprint?"
        onBack={handleClickGoBack}
        onNext={navigationProps.hindMode !== 'create' && handleClickNext}
        className="dark:before:!bg-emerald-400 before:!bg-emerald-400 !text-white"
      />

      <div className="w-full flex flex-col lg:flex-row lg:gap-16 pb-16 md:pb-16 px-8 md:px-14">
        <div className="w-full -mt-14 flex-1 flex flex-col gap-8">
          <Table data={hindsight.stepOne} colorHeader="text-white" headers={headersTable}>
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
                    <span className="min-w-max">{props.row.employeeName}</span>
                  </td>

                  <td>
                    <span>{props.row.description}</span>
                  </td>

                  <td>
                    <VotesField
                      value={props.row.votes!}
                      onChangeVotes={handleChangeVotes}
                      max={navigationProps?.employees.length}
                      disabled={navigationProps?.hindMode === 'view'}
                    />
                  </td>

                  <td>
                    {navigationProps.hindMode !== 'view' ? (
                      // <Options
                      //   item={props.row}
                      //   loadingDelete=""
                      //   onDelete={handleClickDelete}
                      //   onEdit={handleClickEdit}
                      // />
                      <></>
                    ) : null}
                  </td>
                </tr>
              );
            }}
          </Table>
        </div>

        {navigationProps.hindMode !== 'view' ? (
          <div className="lg:-mt-40">
            <VotingUser
              current={[currentEmployee, setCurrentEmployee]}
              onFinish={handleClickNext}
            />

            <form onSubmit={handleSubmit} className="flex flex-col mt-2">
              <input
                type="text"
                name="hindsightName"
                placeholder={`O que o ${currentEmployee?.name} tem a dizer?`}
                required={true}
                value={description}
                onChange={handleChangeField}
                className="input input-bordered w-full rounded focus:outline-none "
              />

              <button
                type="submit"
                className="btn mt-2 rounded border-none hover:bg-emerald-400 bg-emerald-400"
              >
                {mode === 'create' ? 'Cadastrar' : 'Salvar alterações'}
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default StepOne;