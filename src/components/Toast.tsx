import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info'; // Optional type for different colors/icons
  duration?: number; // How long the toast stays visible in ms
  onClose: () => void; // Function to call when the toast should disappear
}

const Toast: React.FC<ToastProps> = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [show, setShow] = useState(true); // State to control visibility for animation

  // Determine background and text colors based on type
  const getTypeClasses = (toastType: string) => {
    switch (toastType) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'info':
      default:
        return 'bg-blue-500 text-white';
    }
  };

  useEffect(() => {
    // Set a timer to close the toast automatically
    const timer = setTimeout(() => {
      setShow(false); // Start fade-out animation
      // Wait for fade-out to complete before unmounting
      const unmountTimer = setTimeout(() => onClose(), 300); // duration of fade-out
      return () => clearTimeout(unmountTimer);
    }, duration);

    // Clear the timeout if the component unmounts or duration/onClose changes
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  // Handle manual close button click
  const handleCloseClick = () => {
    setShow(false); // Start fade-out animation
    const unmountTimer = setTimeout(() => onClose(), 300); // duration of fade-out
    return () => clearTimeout(unmountTimer);
  };

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl text-lg flex items-center justify-between gap-4 z-[9999] transition-opacity duration-300 ${getTypeClasses(type)} ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      role="alert" // Accessibility role
    >
      <span>{message}</span>
      <button
        onClick={handleCloseClick}
        className="ml-4 text-white hover:text-gray-200 focus:outline-none"
        aria-label="Close"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  );
};

export default Toast;