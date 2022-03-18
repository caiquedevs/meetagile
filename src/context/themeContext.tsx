import { ReactNode, useState, createContext, Dispatch } from 'react';

type Theme = 'dark' | '';

interface PropsThemeContext {
  theme: Theme;
  setTheme: Dispatch<React.SetStateAction<Theme>>;
}

const DEFAULT_VALUE: PropsThemeContext = {
  theme: 'dark',
  setTheme: () => {},
};

export const ThemeContext = createContext(DEFAULT_VALUE);

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(DEFAULT_VALUE.theme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
  );
}
