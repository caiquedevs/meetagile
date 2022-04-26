import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { IHindsight } from '../../../interfaces/hindsight';
import { IEmployee } from '../../../interfaces/employee';
import { IAction } from '../../../interfaces/action';
import request from '../../../services/api';

import { NavigationBar } from '../../../components';
import { ModalInterface } from '../../../components/Modal';

import HindsightList from './List/HindsightList';
import EmployeeList from './List/EmployeeList';
import FormHindsight from './Form/FormHindsight';
import FormEmployee from './Form/FormEmployee';

import 'swiper/css';
import 'swiper/css/pagination';
import './styles.css';

export type IMode = { name: 'create' | 'edit'; payload: any };

export interface IData {
  hindsights: IHindsight[];
  employees: IEmployee[];
  actions: IAction;
}

export default function DashboardPage() {
  const modalEmployeeRef = useRef<ModalInterface>();
  const modalHindsightRef = useRef<ModalInterface>();

  const [loadingFetch, setLoadingFetch] = useState<boolean>(true);
  const [data, setData] = useState<IData>({} as IData);
  const [mode, setMode] = useState<IMode>({ name: 'create', payload: {} });

  useEffect(() => {
    request({ method: 'GET', url: '/hindsights' })
      .then(onSuccess)
      .catch(onError)
      .finally(onFinally);

    function onSuccess(response: any) {
      console.log('response', response);
      setData(response);
    }

    function onError(error: any) {
      toast.error(error.data.msg);
    }

    function onFinally() {
      setLoadingFetch(false);
    }
  }, []);

  return (
    <main className="pb-16">
      <NavigationBar />

      <EmployeeList
        useMode={[mode, setMode]}
        useData={[data, setData]}
        modalRef={modalEmployeeRef}
      />

      <HindsightList
        useMode={[mode, setMode]}
        useData={[data, setData]}
        modalRef={modalHindsightRef}
      />

      <FormEmployee mode={mode} modalRef={modalEmployeeRef} />
      <FormHindsight mode={mode} modalRef={modalHindsightRef} />
    </main>
  );
}
