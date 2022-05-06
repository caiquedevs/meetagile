export const isUniqueInArray = (value: string, key: string, arr: any[]) => {
  const filtered = arr.filter((item) => item[key] === value);
  return Boolean(!filtered.length);
};
