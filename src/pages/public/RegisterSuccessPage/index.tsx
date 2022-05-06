import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BsCheck2Circle } from 'react-icons/bs';

export default function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClickInit = () => navigate('/dashboard');

  useEffect(() => {
    if (!location.state) return navigate('/register');
    return () => {};
  }, []);

  if (!location.state) return <></>;

  return (
    <section className=" h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-slate-900">
      <div className="card w-4/12 shadow-sm rounded-lg bg-white dark:bg-slate-800">
        <div className="flex flex-col py-14 px-16 gap-7">
          <div className="flex items-center justify-center">
            <BsCheck2Circle className="iconCheck text-teal-500" size="195px" />
          </div>

          <div className="flex flex-col items-center gap-4 text-center">
            <strong className="font-roboto font-bold text-2xl text-gray-600 dark:text-white">
              Tudo certo por aqui!
            </strong>

            <p className="font-poppins font-normal text-base text-gray-500 text-center dark:text-white/80">
              Agora que você se cadastrou, já pode começar fazer suas retrospectivas.
            </p>
          </div>

          <div className="w-full flex flex-col items-center gap-3">
            <button
              type="submit"
              className="w-full btn btn-primary text-white"
              onClick={handleClickInit}
            >
              Começar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
