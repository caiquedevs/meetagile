const checkChanges = (valueOne: any, valueTwo: any) => {
  const response = Object.keys(valueOne).filter(
    (key: string) => valueOne[key] !== valueTwo[key]
  );

  return response;
};

export default checkChanges;
