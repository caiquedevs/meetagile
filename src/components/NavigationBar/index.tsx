import { memo, useEffect, useRef } from 'react';
import { VscColorMode } from 'react-icons/vsc';
import { FiLogOut } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import * as actionsAuth from '../../store/modules/auth/actions';

import './styles.css';
import { useDispatch, useSelector } from 'react-redux';
import StepActions from '../../pages/private/NewHindsight/StepActions';
import { ModalInterface } from '../Modal';
import { MdOutlineDarkMode, MdOutlineLightMode, MdPendingActions } from 'react-icons/md';

import { IRootState } from '../../store/modules/rootReducer';
import * as actionsTheme from '../../store/modules/theme/actions';

interface PropsPage {
  className?: string;
  boxRightClass?: string;
}

function NavigationBar(props: PropsPage) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loadingFetchDashboard } = useSelector(
    (state: IRootState) => state.dashboardReducer
  );

  const modalConfirmRef = useRef<ModalInterface>();

  const { theme } = useSelector((state: IRootState) => state.themeReducer);

  const handleClickShowActions = () => {
    modalConfirmRef.current?.openModal();
  };

  const handleClickLogout = () => {
    dispatch(actionsAuth.logoutRequest());
    navigate('/login');
  };

  const handleClickToogleTheme = () => {
    dispatch(actionsTheme.toogleTheme());
  };

  useEffect(() => {
    document.body.className = theme;

    return () => {};
  }, [theme]);

  return (
    <nav className="navigation-desktop w-full flex">
      <header
        className={`w-full h-14 px-16 flex items-center justify-between bg-white dark:bg-slate-800 shadow-card ${props.className}`}
      >
        <figure className="flex justify-center">
          <svg
            width="111"
            height="23"
            viewBox="0 0 111 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-auto h-5 object-fit"
          >
            <path
              d="M32.7812 15.8906V18H25.2227V15.8906H32.7812ZM26.043 3.78125V18H23.3574V3.78125H26.043ZM31.7949 9.65039V11.7109H25.2227V9.65039H31.7949ZM32.752 3.78125V5.90039H25.2227V3.78125H32.752ZM44.0703 15.8906V18H36.5117V15.8906H44.0703ZM37.332 3.78125V18H34.6465V3.78125H37.332ZM43.084 9.65039V11.7109H36.5117V9.65039H43.084ZM44.041 3.78125V5.90039H36.5117V3.78125H44.041ZM52.2344 3.78125V18H49.5586V3.78125H52.2344ZM56.6484 3.78125V5.90039H45.1934V3.78125H56.6484ZM63.0938 5.93945L59.041 18H56.1992L61.5117 3.78125H63.3281L63.0938 5.93945ZM66.4824 18L62.4102 5.93945L62.166 3.78125H63.9922L69.334 18H66.4824ZM66.2969 12.7168V14.8359H58.6699V12.7168H66.2969ZM81.7168 10.6465V16.1836C81.5085 16.4505 81.1797 16.7402 80.7305 17.0527C80.2878 17.3652 79.7083 17.6354 78.9922 17.8633C78.276 18.0846 77.3971 18.1953 76.3555 18.1953C75.4505 18.1953 74.6237 18.0456 73.875 17.7461C73.1263 17.4401 72.4818 16.9941 71.9414 16.4082C71.401 15.8223 70.9844 15.1061 70.6914 14.2598C70.3984 13.4134 70.252 12.4466 70.252 11.3594V10.4219C70.252 9.33464 70.3887 8.36784 70.6621 7.52148C70.9421 6.67513 71.3392 5.95898 71.8535 5.37305C72.3743 4.78711 72.9961 4.34115 73.7188 4.03516C74.4479 3.72917 75.2617 3.57617 76.1602 3.57617C77.3646 3.57617 78.3542 3.77474 79.1289 4.17188C79.9102 4.56901 80.5091 5.11589 80.9258 5.8125C81.3424 6.5026 81.6029 7.29688 81.707 8.19531H79.0898C79.0182 7.70052 78.875 7.26758 78.6602 6.89648C78.4453 6.51888 78.1393 6.22591 77.7422 6.01758C77.3516 5.80273 76.8438 5.69531 76.2188 5.69531C75.6914 5.69531 75.2259 5.79948 74.8223 6.00781C74.4186 6.21615 74.0801 6.51888 73.8066 6.91602C73.5332 7.31315 73.3249 7.80469 73.1816 8.39062C73.0449 8.97656 72.9766 9.64714 72.9766 10.4023V11.3594C72.9766 12.1211 73.0547 12.7982 73.2109 13.3906C73.3672 13.9766 73.5918 14.4714 73.8848 14.875C74.1842 15.2721 74.5521 15.5749 74.9883 15.7832C75.431 15.985 75.9323 16.0859 76.4922 16.0859C77 16.0859 77.4199 16.0436 77.752 15.959C78.0905 15.8678 78.3607 15.7604 78.5625 15.6367C78.7643 15.513 78.9206 15.3926 79.0312 15.2754V12.6094H76.209V10.6465H81.7168ZM87.1172 3.78125V18H84.4316V3.78125H87.1172ZM99.041 15.8906V18H91.8926V15.8906H99.041ZM92.7031 3.78125V18H90.0176V3.78125H92.7031ZM110.262 15.8906V18H102.703V15.8906H110.262ZM103.523 3.78125V18H100.838V3.78125H103.523ZM109.275 9.65039V11.7109H102.703V9.65039H109.275ZM110.232 3.78125V5.90039H102.703V3.78125H110.232Z"
              className="fill-black dark:fill-white"
            />
            <path
              d="M7.08451 4.5H3.02817L1 17.5H5.56338L7.84507 13.08L8.85916 15.42L11.1408 11H11.3944L14.6901 17.5H19L17.2254 4.5H13.169L10.1268 8.14L7.08451 4.5Z"
              className="fill-black dark:fill-white stroke-black dark:stroke-white"
            />
          </svg>
        </figure>

        <div className={`h-full px-5 flex items-center gap-3 ${props.boxRightClass}`}>
          <button
            type="button"
            onClick={handleClickToogleTheme}
            className="btn disabled:animate-pulse-intense disabled:bg-gray-300 disabled:text-black/50 w-8 h-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full"
          >
            {theme === 'light' ? (
              <MdOutlineDarkMode size="19px" className="text-black dark:text-white/60" />
            ) : (
              <MdOutlineLightMode size="19px" className="text-black dark:text-white/60" />
            )}
          </button>

          <button
            type="button"
            onClick={handleClickShowActions}
            disabled={loadingFetchDashboard}
            className="btn disabled:animate-pulse-intense disabled:text-black/50 w-8 h-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full"
          >
            <MdPendingActions size="19px" className="text-black/70 dark:text-white/60" />
          </button>

          <button
            type="button"
            onClick={handleClickLogout}
            className="btn disabled:animate-pulse-intense disabled:bg-gray-300 disabled:text-black/50 w-8 h-8 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-600 rounded-full"
          >
            <FiLogOut size="19px" className="text-black dark:text-white/60" />
          </button>

          <img
            src="/images/icone-globo.svg"
            alt="icone-globo"
            className="w-auto h-8 object-cover ml-5"
          />
        </div>
      </header>

      <StepActions modalRef={modalConfirmRef} />
    </nav>
  );
}

export default memo(NavigationBar);
