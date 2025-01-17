import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="container">
        {children}
      </div>
    </div>
  );
};

export default Layout; 