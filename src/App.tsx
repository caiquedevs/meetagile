import { useTheme } from './hooks/useTheme';
import { ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import Routes from './routes';
import { pathsForNavigationBar } from './routes/privateRoutes';
import { NavigationBar } from './components';

function App() {
  const { theme } = useTheme();
  const location = useLocation();

  const whiteList = ['/navigation'];

  const hasNavigationBar = pathsForNavigationBar.includes(location.pathname);

  return (
    <div className={theme}>
      {hasNavigationBar ? <NavigationBar /> : null}

      <div>
        {/* className={hasNavigationBar ? `pl-16` : 'pl-0'} */}
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
    </div>
  );
}

export default App;
