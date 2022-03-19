import { useEffect } from 'react';
import { ReactNode, useState, createContext, Dispatch } from 'react';
import { UserProps } from '../interfaces/user';
import { api } from '../services/api';

interface AuthProps {
  user: UserProps;
  token: string;
  isLoggedIn: boolean;
}

interface AuthPropsContext {
  auth: AuthProps;
  setAuth: Dispatch<React.SetStateAction<AuthProps>>;
}

const initialValue: any = {
  load: () => {
    const authStorage: AuthProps = JSON.parse(localStorage.getItem('auth')!);

    if (authStorage) {
      api.defaults.headers.Authorization = `Bearer ${authStorage.token}`;
      return authStorage;
    } else {
      return { user: {} as UserProps, token: '', isLoggedIn: false };
    }
  },
};

export const AuthContext = createContext(initialValue.load);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthProps>(initialValue.load);

  return (
    <AuthContext.Provider value={{ auth: auth, setAuth: setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
