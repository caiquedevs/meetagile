import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { IAction } from '../../../interfaces/action';
import { IEmployee } from '../../../interfaces/employee';
import { IHindsight, StepThreeProps } from '../../../interfaces/hindsight';

import {
  ConfirmModal,
  ModalEditStep,
  Options,
  ShowIf,
  VotesField,
  VotingUser,
} from '../../../components';

import { FiArrowRight } from 'react-icons/fi';
import { MdDeleteForever, MdModeEdit } from 'react-icons/md';

import { ModalInterface } from '../../../components/Modal';
import { IStepProps } from '../../../interfaces/stepProps';

export default function StepOne() {
  const navigate = useNavigate();
  const location = useLocation();

  const { state: navigationProps } = location as IStepProps;

  const modalEditRef = useRef<ModalInterface>();
  const modalConfirmRef = useRef<ModalInterface>();

  const [hindsight, setHindsight] = useState<IHindsight>(navigationProps?.hindsight);

  const [indexSlide, setIndexSLide] = useState(0);
  const [employeesVoting, setEmployeesVoting] = useState<StepThreeProps[]>(
    navigationProps.hindsight.stepThree
  );

  const [description, setDescription] = useState('');

  const onReset = () => setDescription('');

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    setDescription(value);
  };

  const onChangeVotes = (value: number, index: number) => {
    const payload = { ...hindsight };
    payload.stepOne[index as number].votes = value;
    setHindsight(payload);
  };

  const handleClickDelete = ({ index }: any) => {
    modalConfirmRef.current?.openModal(index);
  };

  const onConfirmDelete = () => {
    const copyHindsight = { ...hindsight };

    const index = modalConfirmRef.current?.payload;
    copyHindsight.stepOne.splice(index, 1);

    onReset();
    setHindsight(copyHindsight);
    modalConfirmRef.current?.closeModalSimple();
  };

  const handleClickEdit = ({ description, index }: any) => {
    modalEditRef.current?.openModal({ description, index });
  };

  const onConfirmEdit = () => {
    const { description, index } = modalEditRef.current?.payload;

    const copyHindsight = { ...hindsight };
    copyHindsight.stepOne[index].description = description;

    onReset();
    setHindsight(copyHindsight);
    modalEditRef.current?.closeModalSimple();
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const payload = {
      employeeName: employeesVoting[indexSlide].employee.name!,
      description: description,
      votes: 0,
    };

    const copyData = { ...hindsight };
    copyData.stepOne.push(payload);

    navigationProps.hindsight = copyData;
    location.state = navigationProps;
    console.log('navigationProps', navigationProps);

    setHindsight(copyData);
    onReset();
  };

  const handleClickNext = () => {
    navigate('../step-two', {
      replace: true,
      state: { ...navigationProps, hindsight },
    });
  };

  const optionsListTable = [
    {
      label: 'Editar',
      icon: MdModeEdit,
      onClick: handleClickEdit,
    },
    {
      label: 'Excluir',
      icon: MdDeleteForever,
      onClick: handleClickDelete,
    },
  ];

  useEffect(() => {
    if (!navigationProps) navigate('/dashboard');

    return () => {};
  }, []);

  if (!navigationProps) return <></>;

  return (
    <section className="w-full min-h-screen bg-white">
      <header
        className="
          w-full h-64
          before:content-['']
          before:w-full before:h-full
          before:block before:absolute 
          before:bg-teal-500
        "
      >
        <div className="pt-16 md:pt-24 px-8 md:px-14 flex gap-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-3 items-center">
              <h2 className="text-base md:text-lg font-medium text-white">
                Primeira etapa
              </h2>

              <ShowIf condition={navigationProps.mode !== 'create'}>
                <button type="button" onClick={handleClickNext} className="flex">
                  <FiArrowRight size="23" color="#ffffff" />
                </button>
              </ShowIf>
            </div>

            <h1 className="font-bold text-2xl sm:text-2.5xl text-white">
              O que foi bom nessa Sprint?
            </h1>
          </div>
        </div>
      </header>

      <div className="w-full flex flex-col lg:flex-row lg:gap-16 pb-16 md:pb-16 px-8 md:px-14">
        <div className="w-full -mt-14 flex-1 flex flex-col gap-8">
          <table style={{ borderSpacing: '0px 8px', borderCollapse: 'separate' }}>
            <ShowIf condition={hindsight.stepOne.length}>
              <thead className="text-left text-white">
                <tr>
                  <th>Nome</th>
                  <th>Opnião</th>
                  <th>Concordância</th>
                </tr>
              </thead>
            </ShowIf>

            <tbody>
              <ShowIf condition={!hindsight.stepOne.length}>
                <tr className="bg-white text-gray-800">
                  <td
                    colSpan={3}
                    className="px-5 py-4 rounded-l-md border border-r-0 border-gray-default break-words"
                  >
                    <div className="flex items-center justify-center text-gray-500">
                      Nenhum conteudo a mostrar por enquanto!
                    </div>
                  </td>
                </tr>
              </ShowIf>

              {hindsight.stepOne.map((row, index) => {
                const handleChangeVotes = (value: number) => {
                  onChangeVotes(value, index);
                };

                return (
                  <tr key={index} className="bg-white text-gray-800">
                    <td className="px-5 py-4 rounded-l-md border border-r-0 border-gray-default break-words">
                      <span className="min-w-max">{row?.employeeName}</span>
                    </td>

                    <td className="border-y border-gray-default break-words">
                      {row?.description}
                    </td>

                    <td className="border-y border-gray-default break-words">
                      <VotesField
                        value={row.votes}
                        onChangeVotes={handleChangeVotes}
                        max={navigationProps?.hindsight.stepThree.length}
                        disabled={navigationProps?.mode === 'view'}
                      />
                    </td>

                    <ShowIf condition={navigationProps.mode !== 'view'}>
                      <td className="px-5 py-4 rounded-r-md border border-l-0 border-gray-default break-words">
                        <div className="w-full h-auto flex items-center justify-end">
                          <Options
                            list={optionsListTable}
                            currentItem={{ description: row.description, index }}
                            iconSize="18px"
                          />
                        </div>
                      </td>
                    </ShowIf>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {navigationProps.mode !== 'view' ? (
          <aside className="lg:min-w-400px">
            <div className="lg:fixed lg:-mt-40">
              <VotingUser
                useEmployeesVoting={[employeesVoting, setEmployeesVoting]}
                useIndexSlide={[indexSlide, setIndexSLide]}
                onFinish={handleClickNext}
              />

              <form onSubmit={handleSubmit} className="flex flex-col mt-2">
                <input
                  type="text"
                  name="hindsightName"
                  required={true}
                  value={description}
                  onChange={handleChangeField}
                  placeholder={`O que ${employeesVoting[indexSlide]?.employee?.name} tem a dizer?`}
                  className="input input-primary"
                />

                <button type="submit" className="btn btn-primary mt-2 !bg-teal-400">
                  Cadastrar
                </button>
              </form>
            </div>
          </aside>
        ) : null}
      </div>

      <ModalEditStep onConfirm={onConfirmEdit} modalRef={modalEditRef} />
      <ConfirmModal onConfirm={onConfirmDelete} modalRef={modalConfirmRef} />
    </section>
  );
}
