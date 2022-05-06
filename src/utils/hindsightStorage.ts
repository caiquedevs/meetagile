import { IHindsight } from '../interfaces/hindsight';
import { getLocalStorage, setLocalStorage } from './localStorage';

export const createIfNotExistHindsightStorage = (data: IHindsight) => {
  // Pega o array de retrospectivas pendentes do localstorage
  const hindsightsPending = getLocalStorage('hindsightsPending') || [];

  // Localiza a posição da retrospectiva no array
  const indexHindsightPending = hindsightsPending.findIndex((hindsight: IHindsight) => {
    return hindsight?.name === data.name;
  });

  // Atualiza o valor da retrospectiva caso não exista
  if (indexHindsightPending === -1) {
    hindsightsPending.push(data);
    setLocalStorage('hindsightsPending', hindsightsPending);
  }
};

export const getHindsightStorage = (name: string) => {
  const hindsightsPending = getLocalStorage('hindsightsPending');

  const indexHindsightPending = hindsightsPending.findIndex((hindsight: IHindsight) => {
    return hindsight?.name === name;
  });

  const response =
    indexHindsightPending >= 0 ? hindsightsPending[indexHindsightPending] : [];

  return response;
};

export const updateHindsightStorage = (data: IHindsight) => {
  // Pega o array de retrospectivas pendentes do localstorage
  const hindsightsPending = getLocalStorage('hindsightsPending') || [];

  // Localiza a posição dela no array
  const indexHindsightPending = hindsightsPending.findIndex((hindsight: IHindsight) => {
    return hindsight?.name === data.name;
  });

  // Atualiza o valor da retrospectiva
  indexHindsightPending >= 0
    ? (hindsightsPending[indexHindsightPending] = data)
    : hindsightsPending.push(data);

  setLocalStorage('hindsightsPending', hindsightsPending);
};

export const listHindsightStorage = () => {
  const hindsightsPending = localStorage.getItem('hindsightsPending');

  return JSON.parse(hindsightsPending!);
};

export const updateNameHindsightStorage = (oldName: string, newName: string) => {
  // Pega o array de retrospectivas pendentes do localstorage
  const hindsightsPending = getLocalStorage('hindsightsPending') || [];

  // Localiza a posição dela no array
  const indexHindsightPending = hindsightsPending?.findIndex((hindsight: IHindsight) => {
    return hindsight?.name === oldName;
  });

  // Atualiza o valor da retrospectiva caso exista
  if (indexHindsightPending >= 0) {
    hindsightsPending[indexHindsightPending].name = newName;
    setLocalStorage('hindsightsPending', hindsightsPending);
  }
};

export const deleteHindsightStorage = (name: string) => {
  const hindsightsPending = getLocalStorage('hindsightsPending') || [];

  const filterHindsight = hindsightsPending.filter(
    (item: IHindsight) => item.name !== name
  );

  setLocalStorage('hindsightsPending', filterHindsight);
};
