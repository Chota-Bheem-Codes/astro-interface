import React, { useEffect, useState } from "react";
// import Background from "../components/Background";
import Notefication from "../components/Notefication";
import { QRCode } from "react-qr-svg";
import Header from "../components/Header";
import styled from "styled-components";
import Footer from "../components/Footer";
import {
  Route,
  Switch,
  BrowserRouter as Router,
  Redirect,
} from "react-router-dom";
import Home from "./Home";
import MyBets from "./MyBets";
import Crypto from "./Crypto";
import {
  useCryptoData,
  useFootballData,
  useGeneralData,
  useMatchData,
  useQuestionAddresses,
  useQuestionBetDataMapping,
  useQuestionMapping,
  useTeamLogos,
  useUserBets,
  useUserBetsMapping,
} from "../state/questions/hooks";
import {
  getTheContractAddresses,
  getQuestionMappingData,
  getQuestionDataGraph,
  getMyBetDataGraph,
  getQuestionData,
  getTeamLogos,
} from "../util/getData";
import {
  useAccountAddress,
  useUserBalance,
  useWalletConnected,
} from "../state/wallet/hooks";
import { initializeBiconomy } from "../hooks/initializeBiconomy";
import {
  groupByIdBet,
  groupByIdQuestion,
  isEthereumListener,
  sortMatchData,
  sortMyPositions,
} from "../utils";
import { UserBet } from "../state/questions/slice";
import { getGameTokenBalance, getNftBalance } from "../config/ContractFunctions";
import { useMediaQuery } from "@mui/material";
import IPO from "./IPO";
import Football from "./Football";
import HomePage from "../components/HomePage";
import { useNetworkManager } from "../state/network/hooks";
import { ethers } from "ethers";
import proofRequest from "../config/proofRequest";
import MenuWrapper from "../components/Menu/MenuWrapper";
import { ButtonConfirm } from "../components/Button";

declare global {
  interface Window {
    provider: any;
    web3Provider: any;
    biconomyWeb3: any;
    biconomyWeb3USDC: any;
  }
}

const QRWrapper = styled.div`
  display: grid;
  place-items: center;
`;

const QRHeadline = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: white;
  margin-bottom: 15px;
`;

const Wrapper = styled.div`
  position: relative;
  min-height: 100vh;
`;

const MarginLayout = styled.div`
  padding-bottom: 100px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding-bottom: 100px;
  `};
`;

export const DEPLOYED_CONTRACT_ADDRESS = "0x772DD2DB8dC91c282D51776706993Eb796F50943";

/**
 *
 */
let qrProofRequestJson: any = { ...proofRequest };
qrProofRequestJson.body.transaction_data.contract_address =
  DEPLOYED_CONTRACT_ADDRESS;
qrProofRequestJson.body.scope[0].rules.query.req = {
  // NOTE: this value needs to match the Attribute name in https://platform-test.polygonid.com
  customNumberAttribute: {
    // NOTE: this value needs to match the erc20ZkpRequest.ts L34 or erc721ZkpRequest.ts L34
    // - $tl = operator 2 erc20ZkpRequest.ts L38
    // - 20020101 = value erc20ZkpRequest.ts L41
    $eq: 17,
  },
};
// NOTE1: if you change this you need to resubmit the erc10|erc721ZKPRequest
// NOTE2: type is case-sensitive
// You can generate new schemas via https://platform-test.polygonid.com
qrProofRequestJson.body.scope[0].rules.query.schema = {
  url: "https://platform-test.polygonid.com/claim-link/bbeb834b-c5df-4cde-8e18-e441041a2567",
  type: "MyCustomSchema",
};

// Main Component
// ========================================================

function App() {
  const [showMetaNotification, setShowMetaNotification] = useState(true);
  const [, setMatchData] = useMatchData();
  const [, setFootballData] = useFootballData();
  const [, setGeneralData] = useGeneralData();
  const [, setCryptoData] = useCryptoData();
  const [, setTeamLogos] = useTeamLogos();
  const [, setQuestionAddresses] = useQuestionAddresses();
  const [questionMapping, setQuestionMappping] = useQuestionMapping();
  const [, setQuestionBetDataMapping] = useQuestionBetDataMapping();
  const [, setMyBetsData] = useUserBets();
  const [, setUserBetsMapping] = useUserBetsMapping();
  const [, setUserBalance] = useUserBalance();
  const [accountAddress] = useAccountAddress();
  const [isWalletConnected] = useWalletConnected();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [isMetaMask, setIsMetaMask] = useState(false);
  const [currentNetwork] = useNetworkManager();
  const [isOver18, setIsOver18] = useState(false);

  const fetchInitialData = async () => {
    const data = await Promise.all([
      //getQuestionData("cricket"),
      getTheContractAddresses(currentNetwork.baseUrl),
      getQuestionMappingData(currentNetwork.baseUrl),
      getQuestionDataGraph(currentNetwork.graphEndpoint),
      //getQuestionData("general"),
      getQuestionData("crypto", currentNetwork.baseUrl),
      getTeamLogos(currentNetwork.baseUrl),
      getQuestionData("football", currentNetwork.baseUrl),
    ]);
    //setMatchData(data[0] && sortMatchData(data[0]));
    setQuestionAddresses(data[0]);
    setQuestionMappping(data[1]);
    setQuestionBetDataMapping(groupByIdQuestion(data[2]));
    //setGeneralData(data[3] && sortMatchData(data[3]));
    setCryptoData(data[3] && sortMatchData(data[3]));
    setTeamLogos(data[4]);
    setFootballData(data[5] && sortMatchData(data[5]));
  };

  const fetchUserSpecificData = async () => {
    const res = await Promise.all([
      getMyBetDataGraph(currentNetwork.graphEndpoint, accountAddress ?? ""),
      getGameTokenBalance({
        accountAddress: accountAddress,
        rpcProvider: new ethers.providers.JsonRpcProvider(currentNetwork.rpc),
        gameTokenAddress: currentNetwork.gameToken.address,
        gameTokenDecimal: currentNetwork.gameToken.decimals,
      }),
    ]);
    setMyBetsData(
      questionMapping && res[0] && sortMyPositions(res[0], questionMapping)
    );
    setUserBetsMapping(groupByIdBet(res[0]));
    setUserBalance(res[1]);
    console.log(res[1]);
  };

  const handleEthereum = () => {
    if (window.ethereum) {
      setIsMetaMask(true);
    }
  };

  useEffect(() => {
    fetchInitialData();
    (async () => await initializeBiconomy())();

    if (window.ethereum) {
      handleEthereum();
    } else {
      window.addEventListener("ethereum#initialized", handleEthereum, {
        once: true,
      });
      setTimeout(handleEthereum, 3000);
    }
    return () =>
      window.removeEventListener("ethereum#initialized", handleEthereum);
  }, []);

  useEffect(() => {
    if (!questionMapping) return;
    if (!isWalletConnected) return;
    fetchUserSpecificData();
  }, [accountAddress, questionMapping, isWalletConnected]);

  useEffect(() => {
    if (!accountAddress) return;
    const fetchNFTBalance = async() => {
      console.log("FETCH NFT BALANCE ->")
      const balance = await getNftBalance({ accountAddress:"0x2B351b7bbC86ab5DF433539fE907f8EE4DE1B964" });
      console.log("nft balance ->", balance)
      if (parseInt(balance) > 0) {
        setIsOver18(true)
      }
    }
    fetchNFTBalance()
    const fetchInterval = setInterval(() => fetchNFTBalance(), 15000)
    return () => clearInterval(fetchInterval)
  }, [accountAddress]);

  return (
    <Router>
      <Route />
      <Wrapper>
        <Header />
        {
          !isOver18 &&
          <>
            <MenuWrapper open={true}>
              <QRWrapper>
                <QRHeadline>
                  Are you over 18? Scan to verify with polygon ID
                </QRHeadline>
                <QRCode
                  level="Q"
                  style={{ width: 256 }}
                  value={JSON.stringify(qrProofRequestJson)}
                />
              </QRWrapper>
            </MenuWrapper>
          </>
        }
        {showMetaNotification ? (
          isMobile ? (
            !isMetaMask ? (
              <Notefication close={() => setShowMetaNotification(false)} />
            ) : null
          ) : null
        ) : null}
        <MarginLayout>
          <Switch>
            <Route
              exact
              strict
              path="/"
              render={() => <Redirect to="/home" />}
            />
            <Route exact strict path="/home" component={HomePage} />
            {/* <Route
              exact
              strict
              path="/"
              render={() => <Redirect to="/prediction-markets/general" />}
            /> */}
            <Route
              exact
              strict
              path="/prediction-markets"
              render={() => <Redirect to="/prediction-markets/football" />}
            />
            <Route
              strict
              path={`/prediction-markets/cricket/:questionId`}
              component={Home}
            />
            <Route
              strict
              path={`/prediction-markets/football/:questionId`}
              component={Football}
            />
            <Route
              strict
              path={`/prediction-markets/general/:questionId`}
              component={IPO}
            />
            <Route
              strict
              path={`/prediction-markets/crypto/:questionId`}
              component={Crypto}
            />
            <Route
              strict
              path={`/prediction-markets/cricket`}
              component={Home}
            />
            <Route
              strict
              path={`/prediction-markets/football`}
              component={Football}
            />
            <Route
              strict
              path={`/prediction-markets/general`}
              component={IPO}
            />
            <Route
              strict
              path={`/prediction-markets/crypto`}
              component={Crypto}
            />
            <Route
              exact
              strict
              path="/prediction-markets/my-positions"
              component={MyBets}
            />
            <Route
              path="*"
              render={() => <Redirect to="/prediction-markets/football" />}
            />
          </Switch>
        </MarginLayout>
        {/* <Footer /> */}
      </Wrapper>
    </Router>
  );
}

export default App;
