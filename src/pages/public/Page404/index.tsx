import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IRootState } from '../../../store/modules/rootReducer';

function Page404() {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state: IRootState) => state.authReducer);

  const handleClick = () => {
    isLoggedIn ? navigate('/dashboard') : navigate('/');
  };

  return (
    <div
      className="h-screen w-screen flex items-center justify-center"
      style={{ background: '#F8F8F8' }}
    >
      <div className="flex flex-col gap-10 items-center justify-center px-5 text-gray-700">
        <img src="images/404.png" alt="404 image" />

        <div className="max-w-md flex flex-col items-center gap-8">
          <div>
            <p className="text-xl text-center font-medium leading-normal">
              Página não encontrada
            </p>
            <p className="mb-3 text-center">
              A página que você está procurando parece não existir
            </p>
          </div>

          <button className="btn btn-primary" onClick={handleClick}>
            {isLoggedIn ? 'Ir para o dashboard' : 'Voltar para o início'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page404;
