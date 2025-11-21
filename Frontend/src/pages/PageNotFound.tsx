import React from 'react';
import { useNavigate } from 'react-router';

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 px-4 text-center">
      <div className="mb-8">
        <svg
          className="mx-auto h-32 w-32 text-indigo-500 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0121 18.382V7.618a1 1 0 01-.447-.894L15 7m0 13V7"
          />
        </svg>
      </div>
      <h1 className="text-9xl font-extrabold text-indigo-500/70">404</h1>
      <div className="absolute mt-4">
        <p className="text-2xl font-bold text-white md:text-3xl">Out of bounds!</p>
        <p className="mx-auto mt-2 max-w-md text-gray-100">
          Seems like you have wandered outside your empire. This territory does not exist.
        </p>
      </div>
      <div className="mt-24 flex w-full max-w-xs flex-col justify-center gap-4 sm:max-w-md sm:flex-row">
        <button
          onClick={() => navigate('/home')}
          className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
        >
          Return Home
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-full rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
        >
          Back to Landing
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
