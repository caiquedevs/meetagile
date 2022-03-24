import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import './styles.css';

export interface HeaderProps {
  title?: string;
  subTitle?: string;
  onBack?: any;
  onNext?: any;
  className?: string;
}

function HeaderComponent({ title, subTitle, onBack, onNext, className }: HeaderProps) {
  const hasClassName = className ? className : 'text-gray-500 dark:text-white';
  const hasIcons = onBack || onNext ? 'ml-11' : '';

  return (
    <header id="header-generic" className={className}>
      <div className="flex gap-5 pt-16 md:pt-16 px-8 md:px-14">
        <div className="flex flex-col gap-1.5">
          <div className="flex gap-5 items-center">
            {onBack ? (
              <button type="button" onClick={onBack} className="flex">
                <FiArrowLeft size="23" color="#ffffff" />
              </button>
            ) : null}

            {subTitle ? (
              <h2
                className={`text-base md:text-lg font-medium text-gray-500 dark:text-white ${hasClassName}`}
              >
                {subTitle}
              </h2>
            ) : null}

            {onNext ? (
              <button type="button" onClick={onNext} className="flex">
                <FiArrowRight size="23" color="#ffffff" />
              </button>
            ) : null}
          </div>

          {title ? (
            <h1
              className={`font-bold text-2xl sm:text-2.5xl text-gray-700 dark:text-white ${hasClassName} ${hasIcons}`}
            >
              {title}
            </h1>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default HeaderComponent;
