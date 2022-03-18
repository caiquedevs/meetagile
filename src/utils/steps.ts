const backgroundSteps: Record<string, string> = {
  '/new-hindsight/step-one': '#2ECC71',
  '/new-hindsight/step-two': '#E74C3C',
  '/new-hindsight/step-three': '#3498DB',
  '/new-hindsight/step-finish': '#3498DB',
};

export const backgroundStep = (path: string) => {
  return backgroundSteps[path];
};
