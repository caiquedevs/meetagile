export const setLocalStorage = (name: string, data: any) => {
  localStorage.setItem(name, JSON.stringify(data));
};

export const getLocalStorage = (name: string) => {
  const data = localStorage.getItem(name);
  return JSON.parse(data!);
};
