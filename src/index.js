import React from 'react';
import ReactDOM from 'react-dom';
import Web3 from 'web3';
import { Web3ReactProvider } from '@web3-react/core';

import MainApp from './MainApp';
import reportWebVitals from './reportWebVitals';
import { WalletContextProvider } from './app/contexts/WalletContext';

const getLibrary = (provider) => {
  return provider;
};

ReactDOM.render(
  <React.StrictMode>
    <Web3ReactProvider getLibrary={getLibrary}>
      <WalletContextProvider>
        <MainApp />
      </WalletContextProvider>
    </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
