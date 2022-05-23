import React from "react";
import { useWeb3React } from "@web3-react/core";
import { useLocation } from "react-router-dom";

import useConnectHandler from "../../hooks/useConnectHandler";

const parseAddress = (address) => {
  if (address) {
    const frontTail = address.substring(0, 5);
    const endTail = address.substring(address.length - 3, address.length);
    return `${frontTail}...${endTail}`;
  }
  return "Connect";
};

export default function ConnectBtn() {
  const { account, chainId } = useWeb3React();
  const { pathname } = useLocation();

  const onStaking = pathname === "/staking";

  const chainSupported =
    (onStaking && (chainId === 56 || chainId === 97));

  const { onConnectClick } = useConnectHandler();

  return (
    !onStaking ?
      <div className="connect">
        <div
          className="button animation animated fadeInUp"
          // variant={`outline-${!chainId || chainSupported ? "info" : "danger"}`}
          onClick={onConnectClick}
        >
          {!chainId || chainSupported ? parseAddress(account) : "Wrong Network"}
        </div>
      </div>
    : 
      <div className="connect-disconnect active" onClick={onConnectClick}>
        {!chainId || chainSupported ? parseAddress(account) : "Wrong Network"} 
      </div>
  );
}
