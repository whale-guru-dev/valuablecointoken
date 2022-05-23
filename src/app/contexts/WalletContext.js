/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { BscConnector } from '@binance-chain/bsc-connector';
import { getBSCNodeUrl, getBSCTestNodeUrl } from './getBSCNodeUrl';

const WalletContext = React.createContext({
  showWalletModal: false,
  setShowWalletModal: () => null,
});

const WalletContextProvider = ({ children }) => {
  const [showWalletModal, setShowWalletModal] = useState(false);

  return (
    <WalletContext.Provider value={{ showWalletModal, setShowWalletModal }}>
      {children}
    </WalletContext.Provider>
  );
};

export const connectorLocalStorageKey = 'connectorIdForValuableCoin';
export const ConnectorNames = {
  MetaMask: 'MetaMask',
  BinanceChain: 'BinanceChain',
  WalletConnect: 'WalletConnect',
};

const injected = new InjectedConnector({ supportedChainIds: [56, 97] });
const bsc = new BscConnector({ supportedChainIds: [56, 97] });
const rpcUrl = getBSCNodeUrl();
const testRpcUrl = getBSCTestNodeUrl();
const walletconnect = new WalletConnectConnector({
  infuraId: process.env.REACT_APP_INFURA_ID,
  rpc: { 56: rpcUrl, 97: testRpcUrl },
  supportedChainIds: [56, 97],
});

export const connectorsByName = {
  [ConnectorNames.MetaMask]: injected,
  [ConnectorNames.BinanceChain]: bsc,
  [ConnectorNames.WalletConnect]: walletconnect,
};

export { WalletContext, WalletContextProvider };
