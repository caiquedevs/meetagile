import { Outlet } from 'react-router-dom';
import { Container } from '../../../components';
import HindsightsForm from './HindsightsForm';

function NewHindsightPages() {
  const whiteList = ['/new-hindsight', '/new-hindsight/'];

  return (
    <Container>
      {!whiteList.includes(location.pathname) ? <Outlet /> : <HindsightsForm />}
    </Container>
  );
}

export default NewHindsightPages;
