import React, { useContext } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { connectorLocalStorageKey, ConnectorNames, WalletContext } from '../contexts/WalletContext';
import METAMASK_ICON_URL from '../../assets/img/metamask.png';
import WALLETCONNECT_ICON_URL from '../../assets/img/walletConnectIcon.svg';
import BINANCE_ICON_URL from '../../assets/img/binance.svg';
import styled from 'styled-components';
import useAuth from '../hooks/useAuth';
import useNotification from '../hooks/useNotification';

const SUPPORTED_WALLETS = [
  {
    label: 'MetaMask',
    icon: METAMASK_ICON_URL,
    connectorId: ConnectorNames.MetaMask,
    injected: true,
  },
  {
    label: 'Binance Wallet',
    icon: BINANCE_ICON_URL,
    connectorId: ConnectorNames.BinanceChain,
    injected: true,
  },
  {
    label: 'WalletConnect',
    icon: WALLETCONNECT_ICON_URL,
    connectorId: ConnectorNames.WalletConnect,
    injected: false,
  },
];

const WalletCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  margin: 8px 0;
  border-radius: 8px;
  background-color: rgb(211 223 250);
  border: 1px solid #101535;

  &:hover {
    cursor: pointer;
    border: 1px solid white;
  }

  img {
    width: 24px;
    height: 24px;
  }
`;

const AccountActions = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;

  a {
    color: white;
  }
`;

const CopyWrapper = styled.span`
  cursor: pointer;
`;

const ProviderOptions = () => {
  const { login } = useAuth();
  const { setShowWalletModal } = useContext(WalletContext);

  const wallets = SUPPORTED_WALLETS.filter((option) => {
    if (option.injected) {
      return window.ethereum || window.BinanceChain ? true : false;
    }

    return true;
  });

  return (
    <div>
      {wallets.map(({ label, icon, connectorId }) => {
        return (
          <WalletCard
            key={label}
            onClick={() => {
              login(connectorId);
              window.localStorage.setItem(connectorLocalStorageKey, connectorId);
              setShowWalletModal(false);
            }}
          >
            {label}
            <img src={icon} alt="option" />
          </WalletCard>
        );
      })}
    </div>
  );
};

const AccountInformation = () => {
  const { account, chainId } = useWeb3React();
  const { addNotification } = useNotification();
  const { logout } = useAuth();
  const { setShowWalletModal } = useContext(WalletContext);

  return (
    <div>
      {account}
      <AccountActions>
        <CopyToClipboard
          text={account}
          onCopy={() => {
            addNotification({
              title: '',
              message: 'Copied address to clipboard!',
              type: 'success',
            });
          }}
        >
          <CopyWrapper>
            <i className="fa fa-clipboard" style={{ marginRight: 8 }} />
            Copy Address
          </CopyWrapper>
        </CopyToClipboard>
        <a
          target="_blank"
          rel="noreferrer noopener"
          href={`https://${
            chainId === 97 ? 'testnet.bscscan.com' : 'bscscan.com'
          }/address/${account}`}
        >
          <i className="fa fa-external-link" style={{ marginLeft: 24, marginRight: 8 }} />
          View on {chainId === 97 ? 'Testnet Bscscan' : 'Bscscan'}
        </a>
      </AccountActions>
      <div>
        <Button
          variant="outline-success"
          type="button"
          style={{
            margin: "24px auto 0",
            color: "#464652",
            borderColor: "#464652",
            width: "100px",
            height: "30px",
          }}
          onClick={() => {
            logout();
            window.localStorage.removeItem(connectorLocalStorageKey);
            setShowWalletModal(false);
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default function WalletModal() {
  const { showWalletModal, setShowWalletModal } = useContext(WalletContext);
  const { account } = useWeb3React();

  return (
    <Modal
      show={showWalletModal}
      onHide={() => setShowWalletModal(false)}
      backdrop="static"
      keyboard={false}
      className="info-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{account ? 'Your wallet' : 'Connet to a wallet'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!account && <ProviderOptions />}
        {account && <AccountInformation />}
      </Modal.Body>
    </Modal>
  );
}
