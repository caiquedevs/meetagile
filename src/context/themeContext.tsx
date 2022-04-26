import { ReactNode, useState, createContext, Dispatch } from 'react';

type ThemeProps = 'dark' | 'light';

interface ThemePropsContext {
  theme: ThemeProps;
  setTheme: Dispatch<React.SetStateAction<ThemeProps>>;
}

// const initialValue = (localStorage.getItem('theme') as ThemeProps) || 'light';
const initialValue = 'light';

const DEFAULT_VALUE: ThemePropsContext = {
  theme: initialValue,
  setTheme: () => {},
};

export const ThemeContext = createContext(DEFAULT_VALUE);

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeProps>(initialValue);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
  );
}
