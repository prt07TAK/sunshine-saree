import React from 'react';

const Loader = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-[#FFF8F0]/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-golden/20 border-t-maroon rounded-full animate-spin"></div>
          <span className="absolute text-2xl animate-pulse">☀️</span>
        </div>
        <p className="mt-4 font-playfair font-semibold text-maroon text-lg tracking-wide animate-pulse">
          Sunshine Saree...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-golden/20 border-t-maroon rounded-full animate-spin"></div>
        <span className="absolute text-xl">☀️</span>
      </div>
    </div>
  );
};

export default Loader;
