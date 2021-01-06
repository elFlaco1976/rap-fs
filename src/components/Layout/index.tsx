import React from 'react';
import './style.scss';

const Layout: React.FC = ({ children }) => {
  return (
    <div>
      <header className="layout-header">RAP FS IMPRO</header>
      <>{children}</>
    </div>
  );
};

export default Layout;
