import { memo } from 'react';
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi';

type Props = {
  value: number;
  onChangeVotes: (value: number) => void;
  max: number;
  disabled?: boolean;
};

function VotesField({ value, onChangeVotes, max, disabled }: Props) {
  const handleClickIncrement = () => {
    onChangeVotes(value + 1);
  };

  const handleClickDecrement = () => {
    onChangeVotes(value - 1);
  };

  return (
    <div className="flex items-center gap-1.5">
      {!disabled ? (
        <button
          type="button"
          disabled={disabled || value === 0}
          onClick={handleClickDecrement}
          className="text-red-400 disabled:text-gray-300"
        >
          <FiMinusCircle size="18px" />
        </button>
      ) : null}

      <span>{value}</span>

      {!disabled ? (
        <button
          type="button"
          disabled={disabled || value === max - 1}
          onClick={handleClickIncrement}
          className="text-green-500 disabled:text-gray-300"
        >
          <FiPlusCircle size="18px" />
        </button>
      ) : null}
    </div>
  );
}

export default memo(VotesField);
