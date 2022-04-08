import { Outlet } from 'react-router-dom';
import ShowIf from '../../../components/ShowIf';
import HindsightsForm from './HindsightsForm';
import StepActions from './StepActions';

import './styles.css';

function NewHindsightPages() {
  const whiteList = ['/new-hindsight', '/new-hindsight/'];

  return (
    <div className="container-hindsight-page">
      {!whiteList.includes(location.pathname) ? (
        <div className="w-full flex flex-col min-h-screen">
          <Outlet />

          <ShowIf condition={!location.pathname.includes('step-finish')}>
            <StepActions />
          </ShowIf>
        </div>
      ) : (
        <HindsightsForm />
      )}
    </div>
  );
}

export default NewHindsightPages;
