import { useEffect } from 'react';
import Routes from './routes';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';
import { IRootState } from './store/modules/rootReducer';

function App() {
  const { theme } = useSelector((state: IRootState) => state.themeReducer);

  useEffect(() => {
    document.body.className = theme;
    return () => {};
  }, [theme]);

  useEffect(() => {
    addEventListener('storage', (event) => {
      console.log('event', event);
      if (event.key === 'persist:meetagile') {
        const decision = confirm(
          'Deseja apagar? \n\nÉ possível que as alterações nas retrospectivas pendentes sejam perdidas.'
        );

        if (!decision) {
          localStorage.setItem('persist:meetagile', event?.oldValue!);
        }
      }
    });

    return () => {};
  }, []);

  return (
    <div className="dark:!bg-slate-900">
      <Routes />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        pauseOnFocusLoss
        closeOnClick
        pauseOnHover
        rtl={false}
        draggable
      />
    </div>
  );
}

export default App;
