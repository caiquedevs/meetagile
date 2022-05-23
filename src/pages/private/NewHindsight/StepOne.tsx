import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import * as actionsStep from '../../../store/modules/step/actions';

import { FiArrowRight } from 'react-icons/fi';
import { MdDeleteForever, MdModeEdit } from 'react-icons/md';

import { INavigationStepProps } from '../../../interfaces/navigationStep';

import {
  ConfirmModal,
  ModalEditStep,
  Options,
  ShowIf,
  VotesField,
  VotingUser,
} from '../../../components';

import { ModalInterface } from '../../../components/Modal';
import { IRootState } from '../../../store/modules/rootReducer';

export default function StepOne() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { state: navigationProps } = location as INavigationStepProps;

  const modalEditRef = useRef<ModalInterface>();
  const modalConfirmRef = useRef<ModalInterface>();
  const inputRef = useRef<HTMLInputElement>(null);

  const { currentHindsight } = useSelector((state: IRootState) => state.stepReducer);
  const [indexSlide, setIndexSLide] = useState(0);
  const [description, setDescription] = useState('');

  const handleClickEdit = ({ description, index }: any) => {
    modalEditRef.current?.openModal({ description, index });
  };

  const onConfirmEdit = () => {
    const { description, index } = modalEditRef.current?.payload;

    const copyHindsight = { ...currentHindsight };
    copyHindsight.stepOne[index].description = description;

    onReset();
    dispatch(actionsStep.setCurrentHindsight(copyHindsight));
    modalEditRef.current?.closeModalSimple();
  };

  const handleClickDelete = ({ index }: any) => {
    modalConfirmRef.current?.openModal(index);
  };

  const onConfirmDelete = () => {
    const copyHindsight = { ...currentHindsight };

    const index = modalConfirmRef.current?.payload;
    copyHindsight.stepOne.splice(index, 1);

    onReset();
    dispatch(actionsStep.setCurrentHindsight(copyHindsight));
    modalConfirmRef.current?.closeModalSimple();
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

  const handleClickNext = () => {
    const payload = { state: { ...navigationProps } };
    navigate('../step-two', payload);
  };

  const onReset = () => setDescription('');

  const onChangeVotes = (value: number, index: number) => {
    const copyHindsight = { ...currentHindsight };
    copyHindsight.stepOne[index as number].votes = value;

    dispatch(actionsStep.setCurrentHindsight(copyHindsight));
  };

  const handleChangeField = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.currentTarget.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    const payload = {
      employeeName: currentHindsight?.stepThree[indexSlide]?.name!,
      description: description,
      votes: 0,
    };

    const copyHindsight = { ...currentHindsight };
    copyHindsight.stepOne.push(payload);

    dispatch(actionsStep.setCurrentHindsight(copyHindsight));
    onReset();

    inputRef.current?.focus();
  };

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
          before:bg-teal-500 dark:before:bg-teal-700
        "
      >
        <div className="pt-16 md:pt-24 px-8 md:px-14 flex gap-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-3 items-center">
              <h2 className="text-base md:text-lg font-medium text-white">
                Primeira etapa
              </h2>

              <button type="button" onClick={handleClickNext} className="flex">
                <FiArrowRight size="23" color="#ffffff" />
              </button>
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
            <ShowIf condition={currentHindsight?.stepOne?.length}>
              <thead className="text-left text-white">
                <tr>
                  <th>Nome</th>
                  <th>Opnião</th>
                  <th>Concordância</th>
                </tr>
              </thead>
            </ShowIf>

            <tbody>
              <ShowIf condition={!currentHindsight?.stepOne?.length}>
                <tr className="bg-white dark:bg-slate-800">
                  <td
                    colSpan={3}
                    className="px-5 py-4 rounded-l-md border border-r-0 border-gray-default dark:border-transparent break-words"
                  >
                    <div className="flex items-center justify-center text-gray-500 dark:text-white/80">
                      Nenhum conteudo a mostrar por enquanto!
                    </div>
                  </td>
                </tr>
              </ShowIf>

              {currentHindsight?.stepOne?.map((row, index) => {
                const handleChangeVotes = (value: number) => {
                  onChangeVotes(value, index);
                };

                return (
                  <tr
                    key={index}
                    className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white"
                  >
                    <td className="px-5 py-4 rounded-l-md border border-r-0 border-gray-default dark:border-transparent break-words">
                      <span className="min-w-max">{row?.employeeName}</span>
                    </td>

                    <td className="border-y border-gray-default dark:border-transparent break-words">
                      {row?.description}
                    </td>

                    <td className="border-y border-gray-default dark:border-transparent break-words">
                      <VotesField
                        value={row.votes}
                        onChangeVotes={handleChangeVotes}
                        max={
                          row.type === 'random'
                            ? currentHindsight?.stepThree?.length + 1
                            : currentHindsight?.stepThree?.length
                        }
                        disabled={navigationProps?.mode === 'view'}
                      />
                    </td>

                    <ShowIf condition={navigationProps.mode !== 'view'}>
                      <td className="px-5 py-4 rounded-r-md border border-l-0 border-gray-default dark:border-transparent break-words">
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
                useIndexSlide={[indexSlide, setIndexSLide]}
                onFinish={handleClickNext}
              />

              <form onSubmit={handleSubmit} className="flex flex-col mt-2">
                <input
                  ref={inputRef}
                  type="text"
                  name="hindsightName"
                  required={true}
                  value={description}
                  onChange={handleChangeField}
                  placeholder={`O que ${
                    currentHindsight?.stepThree
                      ? currentHindsight?.stepThree[indexSlide]?.name
                      : ''
                  } tem a dizer?`}
                  className="input input-primary"
                />

                <button
                  type="submit"
                  className="btn btn-primary mt-2 !bg-teal-500 dark:!bg-teal-600"
                >
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
