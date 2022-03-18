import React, { useState } from 'react';
import { FiMinusCircle, FiPlusCircle } from 'react-icons/fi';

type Props = {
  value: number;
  onChangeVotes: (value: number) => void;
  max: number;
};

export default function VotesField({ value, onChangeVotes, max }: Props) {
  const handleClickIncrement = () => {
    onChangeVotes(value + 1);
  };

  const handleClickDecrement = () => {
    onChangeVotes(value - 1);
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        disabled={value === 0}
        onClick={handleClickDecrement}
        className="text-red-400 disabled:text-gray-300"
      >
        <FiMinusCircle size="18px" />
      </button>

      <span>{value}</span>

      <button
        type="button"
        disabled={value === max - 1}
        onClick={handleClickIncrement}
        className="text-green-500 disabled:text-gray-300"
      >
        <FiPlusCircle size="18px" />
      </button>
    </div>
  );
}
