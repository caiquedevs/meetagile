import { FiArrowLeft } from 'react-icons/fi';
import { Header } from './styles';

export interface HeaderProps {
  title?: string;
  subTitle?: string;
  onBack?: () => void;
  className?: string;
}

function HeaderComponent({ title, subTitle, onBack, className }: HeaderProps) {
  console.log('className', className);
  return (
    <Header
      className={`w-full before:bg-secondary-dark dark:before:bg-secondary-dark ${className}`}
    >
      <div className="flex gap-5">
        {onBack ? (
          <button type="button" onClick={onBack} className="flex">
            <FiArrowLeft size="23" color="#ffffff" />
          </button>
        ) : null}

        <div className="flex flex-col gap-1.5">
          {subTitle ? (
            <h2 className="text-lg font-medium text-gray-500 dark:text-white">
              {subTitle}
            </h2>
          ) : null}
          {title ? (
            <h1 className="font-bold text-2.5xl text-gray-700 dark:text-white">
              {title}
            </h1>
          ) : null}
        </div>
      </div>
    </Header>
  );
}

export default HeaderComponent;
