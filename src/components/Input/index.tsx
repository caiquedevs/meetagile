import { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: any;
}

export default function Input({ label, className, icon: Icon, ...props }: InputProps) {
  return (
    <label
      htmlFor={props.id}
      className="w-auto flex flex-col gap-3 font-roboto font-medium text-base text-black/75"
    >
      {label}
      <div className="w-auto flex items-center">
        {Icon ? <Icon className="text-xl text-black/50 absolute left-4 z-10" /> : null}
        <input
          {...props}
          className={`py-3.5 border border-gray-300 rounded-3px placeholder:font-roboto placeholder:font-normal placeholder:text-lg placeholder:text-black/50 ${className} ${
            Icon ? 'px-12' : 'px-5'
          }`}
        />
      </div>
    </label>
  );
}
