import { memo, ReactElement, useCallback } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import privateRoutes from './privateRoutes';
import Page404 from '../pages/public/Page404';
import HomePage from '../pages/public/HomePage';
import LoginPage from '../pages/public/LoginPage';
import ForgotPasswordPage from '../pages/public/ForgotPasswordPage';
import RegisterPage from '../pages/public/RegisterPage';
import RegisterSuccessPage from '../pages/public/RegisterSuccessPage';
import IRoute from '../interfaces/route';

const RoutesAplication = (): ReactElement => {
  const location = useLocation();

  function PrivateRoute({ children }: any) {
    const { isLoggedIn } = useSelector((state: any) => state.authReducer);

    if (!isLoggedIn) return <Navigate to="/login" />;
    return children;
  }

  const renderPrivateRoutes = useCallback((route: IRoute) => {
    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          <PrivateRoute route={route}>
            <route.component />
          </PrivateRoute>
        }
      >
        {route.children?.length! > 0
          ? route.children?.map((routeChild: any) => {
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
  }, []);

  return (
    <Routes>
      <Route path="*" element={<Page404 />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/success" element={<RegisterSuccessPage />} />

      {privateRoutes.map(renderPrivateRoutes)}
    </Routes>
  );
};

export default memo(RoutesAplication);
