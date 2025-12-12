import React from 'react';
import { useLocation } from 'react-router-dom';

function PageTransition({ children }) {
  const location = useLocation();

  return (
    <div 
      key={location.pathname}
      className="animate-fadeIn min-h-screen"
    >
      {children}
    </div>
  );
}

export default PageTransition;

