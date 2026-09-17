import React from 'react';
import { Film } from 'lucide-react';

/**
 * Reusable Cinematic Loading Spinner component.
 */
export const Loader = ({ message = 'Loading cinema experience...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 text-center p-8">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-red-500/20 border-t-red-500 animate-spin" />
        <Film className="w-6 h-6 text-red-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <p className="text-sm font-medium text-gray-400 tracking-wide">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#07080e]/80 backdrop-blur-md z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loader;
