import MenuWrapper from "../MenuWrapper";
import WalletModal from "./WalletModal";
import ChangeWallet from "./ChangeWallet";
import { useState } from "react";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import styled from "styled-components";
import Button from "@mui/material/Button";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useChainId, useWalletModal } from "../../state/wallet/hooks";

const WalletButton = styled(Button)<{ connected: boolean }>`
  &&& {
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    height: 40px;
    line-height: 17px;
    variant: contained;
    padding: 6px 20px;
    border-radius: 19px;
    text-transform: none;
    color: white;
    background-color: #189AB4;
    // :hover {
    //   // background-color: #fa005d;
    //   border: #fa005d;
    //   color: white;
    // }
  }
`;

const Wallet = () => {
  const { currentAccountAddress, connect } = useWeb3Modal();
  const [showWalletModal, setShowWalletModal] = useWalletModal();
  const [chainId] = useChainId();
  const [showChangeWalletModal, setShowChangeWalletModal] =
    useState<boolean>(false);
  const closeChangeWalletModal = () => setShowChangeWalletModal(false);
  const closeShowWalletModal = () => setShowWalletModal(false);
  const changeModalHandler = () => {
    setShowWalletModal(true);
  };
  const connectWallet = async (id: string) => {
    await connect(id);
    closeShowWalletModal();
  };
  return (
    <div>
      <MenuWrapper
        open={showWalletModal}
        onClose={closeShowWalletModal}
        style={{ zIndex: 9999 }}
      >
        <WalletModal action={connectWallet} close={closeShowWalletModal} />
      </MenuWrapper>
      <MenuWrapper
        open={showChangeWalletModal}
        onClose={closeChangeWalletModal}
      >
        <ChangeWallet
          action={changeModalHandler}
          close={closeChangeWalletModal}
        />
      </MenuWrapper>

      {!currentAccountAddress && (
        <WalletButton
          onClick={() => setShowWalletModal(true)}
          connected={!!currentAccountAddress}
        >
          Connect Wallet
        </WalletButton>
      )}
      {currentAccountAddress &&(
        <WalletButton
          onClick={() => setShowChangeWalletModal(true)}
          connected={!!currentAccountAddress}
        >
          {currentAccountAddress
            ? currentAccountAddress.substr(0, 3) +
              "..." +
              currentAccountAddress.substr(currentAccountAddress.length - 3, 3)
            : "Connect To Wallet"}
          <AccountBalanceWalletIcon
            style={{ width: "18px", marginLeft: "10px" }}
          />
        </WalletButton>
      )}
    </div>
  );
};

export default Wallet;
