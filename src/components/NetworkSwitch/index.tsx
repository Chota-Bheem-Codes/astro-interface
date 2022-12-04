import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { useNetworkManager } from "../../state/network/hooks";
//import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import MenuWrapper from "../Menu/MenuWrapper";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { switchNetworkInMetamask } from "../../utils/metamaskFunctions";
import { MEDIA_WIDTHS } from "../../theme";
import { useMediaQuery } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useLocation } from "react-router";
import { useChainId, useWalletConnected } from "../../state/wallet/hooks";
import { networkList } from "../../config/Constants";
import { NetworkType } from "../../state/network/slice";

const Wrapper = styled.div`
  //z-index:-1;
  //margin-right: 35px;
`;
const NetworkOptionsWrapper = styled.div<{
  backgroundColor: string;
  textColor: string;
}>`
  color: ${({ theme, textColor }) => (textColor ? textColor : theme.text1)};
  font-family: "Inter", sans-serif;
  width: 340px;
  background: ${({ theme, backgroundColor }) =>
    backgroundColor ? backgroundColor : theme.bg1};
  backdrop-filter: blur(32px);

  padding: 0 15px;
  border-radius: 10px;
`;

const NetworkBody = styled.div<{ selected: boolean; backgroundColor: string }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 97%;
  border: 1px solid
    ${({ theme, backgroundColor }) =>
      backgroundColor ? theme.bg1 : theme.gray1};
  height: 51px;
  border-radius: 10px;
  margin-bottom: 20px;
  padding: 0 10px;
  cursor: pointer;
  background: ${({ theme, selected, backgroundColor }) =>
    selected ? (backgroundColor ? backgroundColor : theme.bg1) : "none"};
  :hover {
    border: 1px solid
      ${({ theme, backgroundColor }) =>
        backgroundColor ? theme.bg1 : theme.gray2};
  }
`;
const NetworkName = styled.div`
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NetworkTitle = styled.div`
  font-size: 16px;
  padding: 15px 0;
  position: relative;
  margin-bottom: 10px;
`;

const OnlineSign = styled.div<{ show: boolean }>`
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: ${({ theme }) => "rgb(117, 241, 169)"};
  margin-right: 7px;
  opacity: ${({ show }) => (show ? 1 : 0)};
`;

const NetworkImage = styled.img`
  width: 20px;
`;
const StyledCloseIcon = styled(CloseRoundedIcon)`
  position: absolute;
  color: white;
  right: 0;
  width: 1.7rem !important;
  height: 1.7rem !important;
  cursor: pointer;
`;

const NetworkWrapper = styled.div<{
  show: boolean;
  backgroundColor: string;
  textColor: string;
}>`
  height: 35px;
  padding: 0px 10px;

  margin-right: 16px;
  display: flex;
  align-items: center;
  border-radius: 10px;
  font-family: "Inter", sans-serif;
  font-size: 1rem;
  line-height: 30px;
  background-size: cover;
  display: ${({ show }) => (show ? "flex" : "none")};
  ${({ theme }) => theme.mediaWidth.upToMedium`
		height: 35px;
  	`};
  ${({ theme }) => theme.mediaWidth.upToSmall`
		//display: none;
    padding: 0px 10px;
    padding-right: 8px;
    background: linear-gradient(94.38deg, rgba(0, 0, 0, 0.2) -16.59%, rgba(0, 0, 0, 0) 114.58%);
    border: 1px solid rgba(255, 255, 255, 0.25);
    filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.04)) drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.06));
  	`};
  background: rgba(255, 255, 255, 0.15);
  color: ${({ theme, textColor }) => (textColor ? textColor : theme.text1)};
  box-shadow: ${({ backgroundColor }) =>
    backgroundColor === ""
      ? "3px 3px 10px 4px rgba(0, 0, 0, 0.1)"
      : "3px 3px 10px 4px rgba(0, 0, 0, 0.3)"};
  //transform: translateX(16px);
  :hover {
    background: linear-gradient(
      94.38deg,
      rgba(255, 255, 255, 0.2) -16.59%,
      rgba(255, 255, 255, 0) 114.58%
    );
    border: 1px solid rgba(255, 255, 255, 0.25);
    filter: drop-shadow(0px 0px 4px rgba(0, 0, 0, 0.04))
      drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.06));
  }
`;

const CurrentNetwork = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToMedium`
		justify-content: flex-start;
  	`};
`;

const Image = styled.img`
  width: 18px;
  margin-right: 7px;
  margin-left: 2px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
        width: 16px;
  	`};
`;
const StyledExpandMoreIcon = styled(ExpandMoreIcon)`
  &&& {
  }
`;

// const StyledArrowForwardIosIcon = styled(ArrowForwardIosIcon)`
// &&&{
//         width: 14px;
//         margin-left:3px;
//         ${({ theme }) => theme.mediaWidth.upToMedium`
//             display: none;
//   	    `};
//     }
// `

const NetworkArrayWrapper = styled.div<{ backgroundColor: string }>`
  height: 300px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    width: 5px;
  }
  ::-webkit-scrollbar-track {
    background: ${({ theme, backgroundColor }) =>
      backgroundColor ? theme.gray3 : theme.gray2.concat("70")};
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: ${({ theme, backgroundColor }) =>
      backgroundColor ? theme.gray3 : theme.gray2};
  }
`;

const NetworkSwitch: React.FunctionComponent = () => {
  const [currentNetwork, setCurrentNetwork] = useNetworkManager();
  const upToSmall = useMediaQuery(`(max-width: ${MEDIA_WIDTHS.upToSmall}px)`);
  const [openNetworkMenu, setOpenNetworkMenu] = useState(false);
  const [chainId] = useChainId()
  const location = useLocation();
  const isWidget = useMemo(
    () => new URLSearchParams(location.search).get("isWidget"),
    [location]
  );
  const [searchQuery, setSearchQuery] = useState(location.search);
  const backgroundColor = useMemo(
    () =>
      decodeURIComponent(
        new URLSearchParams(location.search).get("backgroundColor") ?? ""
      ),
    [location]
  );
  const textColor = useMemo(
    () =>
      decodeURIComponent(
        new URLSearchParams(location.search).get("textColor") ?? ""
      ),
    [location]
  );
  const [isWalletConnected] = useWalletConnected();
  const handleNetworkChange = useCallback(
    async (newSourceChain: NetworkType) => {
      try {   
        await switchNetworkInMetamask(newSourceChain.id);
        console.log("Network switched in Tab");
        setCurrentNetwork(newSourceChain)
        setOpenNetworkMenu(false)
      } catch (e) {
        console.log("User Rejected Network Change - ", e)
      }
    },
    []
  );
  return (
    <Wrapper>
      <MenuWrapper
        open={openNetworkMenu}
        onClose={() => setOpenNetworkMenu(false)}
      >
        <NetworkOptionsWrapper
          backgroundColor={
            isWidget?.toString() === "true" ? backgroundColor : ""
          }
          textColor={isWidget?.toString() === "true" ? textColor : ""}
        >
          <NetworkTitle>
            Connect to a network
            <StyledCloseIcon onClick={() => setOpenNetworkMenu(false)} />
          </NetworkTitle>
          <NetworkArrayWrapper
            backgroundColor={
              isWidget?.toString() === "true" ? backgroundColor : ""
            }
          >
            {networkList.map((chain, index) => (
              <NetworkBody
                key={index}
                selected={currentNetwork.networkId === chain.networkId}
                onClick={() => handleNetworkChange(chain)}
                backgroundColor={
                  isWidget?.toString() === "true" ? backgroundColor : ""
                }
              >
                <NetworkName>
                  <OnlineSign
                    show={chainId === chain.networkId}
                  ></OnlineSign>
                  {chain.name?.split(" ")[0]}
                </NetworkName>
                <NetworkImage src={chain.logo} />
              </NetworkBody>
            ))}
          </NetworkArrayWrapper>
        </NetworkOptionsWrapper>
      </MenuWrapper>
      <NetworkWrapper
        show={isWalletConnected}
        onClick={() => setOpenNetworkMenu(true)}
        textColor={isWidget?.toString() === "true" ? textColor : ""}
        backgroundColor={isWidget?.toString() === "true" ? backgroundColor : ""}
      >
        <CurrentNetwork>
          <Image src={currentNetwork.logo} />
          {!upToSmall
            ? currentNetwork
              ? currentNetwork?.name.split(" ")[0]
              : "Unsupported"
            : null}
        </CurrentNetwork>
        <StyledExpandMoreIcon />
      </NetworkWrapper>
    </Wrapper>
  );
};

export default NetworkSwitch;
