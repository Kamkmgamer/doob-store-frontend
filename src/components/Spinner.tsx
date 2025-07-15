import React from 'react';

interface SpinnerProps {
  size?: 'small' | 'medium' | 'large'; // Defines common sizes
  color?: string; // Tailwind color class or direct CSS color
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'medium', color = 'white' }) => {
  let sizeClass = '';
  let borderSizeClass = 'border-2'; // Default border size

  switch (size) {
    case 'small':
      sizeClass = 'h-4 w-4';
      borderSizeClass = 'border-[1.5px]'; // Slightly thinner border for small
      break;
    case 'medium':
      sizeClass = 'h-6 w-6';
      borderSizeClass = 'border-2';
      break;
    case 'large':
      sizeClass = 'h-8 w-8';
      borderSizeClass = 'border-4';
      break;
    default:
      sizeClass = 'h-6 w-6'; // Fallback to medium
      borderSizeClass = 'border-2';
  }

  return (
    <div
      className={`${sizeClass} ${borderSizeClass} border-solid border-${color} border-t-transparent rounded-full animate-spin`}
      role="status"
      aria-label="loading"
    >
      <span className="sr-only">Loading...</span> {/* Screen reader text */}
    </div>
  );
};

export default Spinner;