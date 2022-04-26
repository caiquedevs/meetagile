import { useEffect } from 'react';
import { ReactNode, useState, createContext, Dispatch } from 'react';
import { toast } from 'react-toastify';
import { IAction } from '../interfaces/action';
import { IEmployee } from '../interfaces/employee';
import { IHindsight } from '../interfaces/hindsight';
import { UserProps } from '../interfaces/user';
import request, { api } from '../services/api';

export interface IData {
  hindsights: IHindsight[];
  employees: IEmployee[];
  actions: IAction;
}

interface DashboardContextProps {
  data: IData;
  setData: Dispatch<React.SetStateAction<IData>>;
  loadingFetch: boolean;
}

const DEFAULT_VALUE: DashboardContextProps = {
  data: {
    hindsights: [],
    employees: [],
    actions: {} as IAction,
  },
  setData: () => {},
  loadingFetch: false,
};

export const DashboardContext = createContext(DEFAULT_VALUE);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<IData>({} as IData);
  const [loadingFetch, setLoadingFetch] = useState(false);

  useEffect(() => {
    setLoadingFetch(true);

    request({ method: 'GET', url: '/hindsights' })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess(response: IData) {
      const hindsightsFilter = response.hindsights.filter(
        (hindsight) => hindsight.winningEmployee?.name
      );

      setData({ ...response, hindsights: hindsightsFilter.reverse() });
    }

    function onError(error: any) {
      toast.error(error.data.msg);
    }

    function onFinally() {
      setLoadingFetch(false);
    }
  }, []);

  return (
    <DashboardContext.Provider value={{ data, setData, loadingFetch }}>
      {children}
    </DashboardContext.Provider>
  );
}
