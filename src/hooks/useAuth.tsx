import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

export function useAuth() {
  const { auth, setAuth } = useContext(AuthContext);
  return { auth, setAuth };
}
