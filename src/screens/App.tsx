import React, { useEffect, useState } from "react";
// import Background from "../components/Background";
import Notefication from "../components/Notefication";

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
import Nft from "./Nft";
import MyNft from "./MyNft";
import { UserBet } from "../state/questions/slice";
import { getGameTokenBalance } from "../config/ContractFunctions";
import { useMediaQuery } from "@mui/material";
import GoogleAnalyticsReporter from "../components/GoogleAnalyticsReporter";
import IPO from "./IPO";
import Football from "./Football";
import HomePage from "../components/HomePage";

declare global {
  interface Window {
    provider: any;
    web3Provider: any;
    biconomyWeb3: any;
    biconomyWeb3USDC: any;
  }
}

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

  const fetchInitialData = async () => {
    const data = await Promise.all([
      //getQuestionData("cricket"),
      getTheContractAddresses(),
      getQuestionMappingData(),
      getQuestionDataGraph(),
      //getQuestionData("general"),
      getQuestionData("crypto"),
      getTeamLogos(),
      getQuestionData("football"),
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
      getMyBetDataGraph(accountAddress ?? ""),
      getGameTokenBalance({ accountAddress: accountAddress }),
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

  return (
    <Router>
      <Route component={GoogleAnalyticsReporter} />
      <Wrapper>
        <Header />
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
            <Route exact strict path="/nft" component={Nft} />
            <Route exact strict path="/nft/mynfts" component={MyNft} />
            <Route
              path="*"
              render={() => <Redirect to="/prediction-markets/general" />}
            />
          </Switch>
        </MarginLayout>
        {/* <Footer /> */}
      </Wrapper>
    </Router>
  );
}

export default App;
