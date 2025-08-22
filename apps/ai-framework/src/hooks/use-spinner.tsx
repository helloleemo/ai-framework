import { useState } from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'white' | 'black' | 'blue' | 'green' | 'red';
  className?: string;
}

interface UseSpinnerOptions extends SpinnerProps {
  defaultSize?: SpinnerProps['size'];
  defaultColor?: SpinnerProps['color'];
}

export function useSpinner(options: UseSpinnerOptions = {}) {
  const [loading, setLoading] = useState<boolean>(false);

  const {
    defaultSize = 'md',
    defaultColor = 'white',
    className: defaultClassName = '',
  } = options;

  const createSpinner = (props: SpinnerProps = {}) => {
    const {
      size = defaultSize,
      color = defaultColor,
      className = defaultClassName,
    } = props;

    const sizeClasses = {
      sm: 'h-3 w-3 border',
      md: 'h-5 w-5 border-2',
      lg: 'h-8 w-8 border-2',
      xl: 'h-12 w-12 border-4',
    };

    const colorClasses = {
      white: 'border-white border-t-transparent',
      black: 'border-black border-t-transparent',
      blue: 'border-blue-500 border-t-transparent',
      green: 'border-green-500 border-t-transparent',
      red: 'border-red-500 border-t-transparent',
    };

    return (
      <span
        className={`inline-block animate-spin rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${className} `}
      />
    );
  };

  const Spinner = createSpinner();
  return { loading, setLoading, Spinner, createSpinner };
}
