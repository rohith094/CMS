// import React from 'react';

// const NotFoundPage = () => {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="text-center">
//         <h1 className="text-9xl font-bold text-gray-900">404</h1>
//         <p className="text-2xl font-medium text-gray-600 mt-4">Page Not Found</p>
//         <p className="text-gray-500 mt-2 mb-10">The page you are looking for doesn't exist or has been moved.</p>
//         <a href="/" className="mt-10 px-6 py-3 text-white bg-blue-500 rounded hover:bg-blue-700 transition duration-300">
//           Go Home
//         </a>
//       </div>
//     </div>
//   );
// };

// export default NotFoundPage;

import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/student/dashboard');
  };

  return (
    <section className="flex flex-col items-center justify-center w-full h-screen bg-plat text-center p-4">
      <div className="bg-plat1 p-8 rounded-xl shadow-md">
        <h1 className="text-5xl font-bold text-d4">404</h1>
        <p className="text-xl text-gray-700 mt-4">Oops! Page not found.</p>
        <p className="text-lg text-gray-500 mt-2">It seems like the page you are looking for doesn't exist.</p>
        <button
          onClick={handleGoHome}
          className="mt-6 py-2 px-4 bg-d4 text-white font-semibold rounded-lg shadow-md hover:bg-d3"
        >
          Go to Homepage
        </button>
      </div>
    </section>
  );
};

export default NotFound;
