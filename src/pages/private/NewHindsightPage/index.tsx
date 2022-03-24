import { Outlet } from 'react-router-dom';
import HindsightsForm from './HindsightsForm';

import './styles.css';

function NewHindsightPages() {
  const whiteList = ['/new-hindsight', '/new-hindsight/'];

  return (
    <div className="container-hindsight-page">
      {!whiteList.includes(location.pathname) ? <Outlet /> : <HindsightsForm />}
    </div>
  );
}

export default NewHindsightPages;
