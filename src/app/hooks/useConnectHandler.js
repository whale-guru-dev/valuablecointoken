import { useContext } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useLocation } from 'react-router';
import useNotification from './useNotification';
import { WalletContext } from '../contexts/WalletContext';

export default function useConnectHandler() {
  const { chainId } = useWeb3React();
  const { pathname } = useLocation();
  const { addNotification } = useNotification();
  const { setShowWalletModal } = useContext(WalletContext);

  //toggles the wallet modal
  const onConnect = () => {
    setShowWalletModal(true);
  };

  const onStaking = pathname === '/staking';

  const chainSupported = (onStaking) && (chainId === 56 || chainId === 97);

  const onConnectClick = () => {
    if (chainId && !chainSupported) {
      addNotification({
        title: 'Chain Error',
        message: `Please check if BSC main or test network is chosen.`,
        type: 'danger',
      });
    }

    onConnect();
  };

  return { onConnectClick };
}
