import { memo } from 'react';

const LoadingSpinner = memo(() => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="loader"></div>
        <p className="text-black font-medium">Loading...</p>
      </div>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';
export default LoadingSpinner;