import { memo, ReactElement } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import privateRoutes from './privateRoutes';
import Page404 from '../pages/public/Page404';
import HomePage from '../pages/public/HomePage';
import LoginPage from '../pages/public/LoginPage';
import ForgotPasswordPage from '../pages/public/ForgotPasswordPage';
import RegisterPage from '../pages/public/RegisterPage';
import NavigationBar from '../components/NavigationBar';
import { useAuth } from '../hooks/useAuth';

const RoutesAplication = (): ReactElement => {
  const whiteList = [
    '/new-hindsight/step-one',
    '/new-hindsight/step-two',
    '/new-hindsight/step-three',
    '/new-hindsight/step-finish',
  ];

  const location = useLocation();

  function PrivateRoute({ children, route }: any) {
    const { isLoggedIn } = useAuth().auth;

    if (!isLoggedIn) return <Navigate to="/login" />;
    return children;
  }

  return (
    <Routes>
      <Route path="*" element={<Page404 />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {privateRoutes.map((route) => {
        const hasNavigationBar = route.icon && !whiteList.includes(location.pathname);

        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              <PrivateRoute route={route}>
                {hasNavigationBar ? <NavigationBar /> : null}

                <div className={hasNavigationBar ? 'pl-16' : 'pl-0'}>
                  <route.component />
                </div>
              </PrivateRoute>
            }
          >
            {route.children?.length! > 0
              ? route.children?.map((routeChild) => {
                  return (
                    <Route
                      key={routeChild.name}
                      path={routeChild.path}
                      element={<routeChild.component />}
                    />
                  );
                })
              : null}
          </Route>
        );
      })}
    </Routes>
  );
};

export default memo(RoutesAplication);
