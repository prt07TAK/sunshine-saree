import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHome } from 'react-icons/fi';

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | Sunshine Saree</title>
      </Helmet>

      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-6">
        <div className="text-8xl animate-bounce-in">🥻</div>
        <div className="space-y-2">
          <h1 className="font-playfair text-4xl sm:text-5xl font-bold text-maroon">404 - Not Found</h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            "This page got wrapped in a saree and walked away 🥻"
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-maroon hover:bg-maroon-dark text-white rounded-full font-bold text-sm shadow-md transition-all hover:scale-105"
        >
          <FiHome />
          <span>Return Home</span>
        </Link>
      </div>
    </>
  );
};

export default NotFound;
