import { useTheme } from './hooks/useTheme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Routes from './routes';

function App() {
  const { theme } = useTheme();

  return (
    <div className={theme}>
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
