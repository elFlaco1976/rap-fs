import React from 'react';
import Layout from '../Layout';
import Match from '../Match';

import './style.scss';

const App: React.FC = () => {
  return (
    <div>
      <Layout>
        <Match />
      </Layout>
    </div>
  );
};

export default App;
