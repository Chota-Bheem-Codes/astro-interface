import React, { useState, useEffect } from "react";
import styled from "styled-components";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { Link, Typography, useMediaQuery } from "@mui/material";
import Button from "@mui/material/Button";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import MenuWrapper from "../MenuWrapper";
import MainModal from "../ExpandedModal/MainModal";
import MobileModal from "../MobileExpandedView/MobileExpansion";
import Tick from "../../assets/ellipse.png";
import {
  KeyValueType,
  QuestionData,
  UserBet,
} from "../../state/questions/slice";
import {
  changeDateFormat,
  epochConverter,
  getEpoch,
} from "../../utils/getEpoch";
import { WaitingCard } from "../TransactionsCards/WaitingCard";
import ConfirmationCard from "../TransactionsCards/ConfirmationCard";
import {
  getApproval,
  getGameTokenBalance,
  userPlaceBet,
  userSetApproval,
} from "../../config/ContractFunctions";
import { gameToken, MINIMUM_BET_AMOUT, network } from "../../config/Constants";
import {
  useAccountAddress,
  useChainId,
  useUserBalance,
  useWalletConnected,
  useWalletModal,
} from "../../state/wallet/hooks";
import secondsToDHms from "../../utils/secondsToDHms";
import getMultiplierV2 from "../../utils/getMultiplierV2";
import {
  useMatchData,
  useQuestionBetDataMapping,
  useExplorerLink,
  useUserBetsMapping,
  useQuestionMapping,
  useUserBets,
  useTeamLogos,
  useGasLessToggle,
} from "../../state/questions/hooks";
import {
  encodedID,
  getFlooredFixed,
  groupByIdBet,
  sortMyPositions,
} from "../../utils";
import InputBox from "../InputBox/InputBox";
import { switchNetworkInMetamask } from "../../utils/metamaskFunctions";
import { MEDIA_WIDTHS } from "../../theme";
import toast, { Toaster } from "react-hot-toast";
import { getMyBetDataGraph } from "../../util/getData";
import { useHistory } from "react-router";
import Moment from "react-moment";

const Wrapper = styled.div``;
const Team1 = styled.img`
  width: 40px;
  height: 40px;
`;
const TeamADiv = styled.div`
  &&& {
    display: flex;
    margin-top: 16px;
  }
`;
const TeamBDiv = styled.div`
  &&& {
    display: flex;
    margin-top: 16px;
  }
`;

const MainDiv = styled.div<{ show: boolean }>`
  &&& {
    // border: 1px solid;
    border-image-source: radial-gradient(
        69.43% 69.43% at 50% 50%,
        #ffffff 0%,
        rgba(255, 255, 255, 0) 100%
      ),
      radial-gradient(
        60% 51.57% at 50% 50%,
        #17b384 0%,
        rgba(23, 179, 132, 0) 100%
      ),
      radial-gradient(
        54.8% 53% at 50% 50%,
        #151515 0%,
        rgba(21, 21, 21, 0) 100%
      );

    border-radius: 16px;
    margin: 0px 17.5px;
    margin-bottom: 32px;
    width: 377.86px;
    height: 450px;
    opacity: 1;
    // backdrop-filter: blur(42px);
    -webkit-backdrop-filter: blur(42px);
    // border: 1px;
    // box-shadow: 12px 12px 25px #1a1b1c73;
    position: relative;
    background: linear-gradient(
      152.97deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    background-color: ${({ show }) => (show ? "#80808040" : "none")};
    border: ${({ show, theme }) => (show ? `1px solid #00a576` : "none")};
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
  &&&{
    width: 333px;
    height: 440px;
    margin-bottom: 35px;

  }
  `};
`;
const StyledLive = styled(WbSunnyIcon)`
  &&& {
    font-size: 14px;
    margin-top: 2px;
  }
`;
const StyledQuestionDiv = styled.div<{ show: boolean }>`
  &&& {
    width: 345.86px;
    height: auto;
    // background: rgba(0, 0, 0, 0.5);
    border-radius: 16px;
    margin: 16px auto;
    padding-bottom: 10px;
    background-color: ${({ show }) =>
      show ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.5)"};
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    border: 1px solid #4c4b4b14;
    box-shadow: 12px 12px 25px #1a1b1c73;
    ${({ theme }) => theme.mediaWidth.upToSmall`
  &&&{
    width: 301px;
    height: auto;
  }
  `};
  }
`;
const StyledExpandIcon = styled(DashboardCustomizeIcon)`
  &&& {
    font-size: 25px;
    color: #fa005d;
  }
`;
const StyledLiveDiv = styled.div<{ show: boolean }>`
  display: flex;
  margin-left: 12px;
  margin-top: 10px;
  color: red;
  opacity: ${({ show }) => (show ? 1 : 0)};
`;
const StyledTimer = styled.div`
  &&& {
    // font-family: Inter;
    // font-style: normal;
    // font-weight: normal;
    // font-size: 14px;
    // line-height: 24px;    // background-color: #fdeaf1;
    // width: 115px;
    // height: 30px;
    // display: grid;
    // place-items: center;
    // color: #17B384;
    // border-radius: 0px 15px 0px 15px;
    // margin-left: auto;
  }
`;
const StyledMainCircle = styled.div`
  &&& {
    display: flex;
    padding: 45px 29.6px 0px 29.6px;
    justify-content: space-between;
  }
`;
const StyledCircle = styled.div`
  &&& {
    background-color: #ffffff;
    width: 55px;
    height: 55px;
    display: grid;
    place-items: center;
    border-radius: 50%;
  }
`;
const StyledCircle2 = styled.div`
  &&& {
    background-color: #ffffff;
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border: 0.5px solid #fa005d;
    border-radius: 50%;
    cursor: pointer;
  }
`;
const StyledText = styled(Typography)`
  &&& {
    font-family: Inter;
    font-style: normal;
  }
`;

const StyledTextVS = styled(Typography)`
  &&& {
    display: grid;
    place-content: center;
    color: #bdbdbd;
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 11px;
    line-height: 24px;
    margin-top: 16px;
  }
`;
const StyledTextTimer = styled(Typography)`
  &&& {
    font-family: Inter;
    font-style: normal;
    font-weight: 700;
    font-size: 13px;
    line-height: 24px;
    align-items: center;
    color: #17b384;
  }
`;
const StyledLink = styled(Link)`
  &&& {
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    align-items: center;
    text-align: center;
    letter-spacing: 0.01em;
    text-decoration-line: underline;
    display: grid;
    margin-top: 16px;
    color: #4fffff;
    cursor: pointer;
  }
`;
const StyledBottom = styled(Typography)`
  &&& {
    margin-top: 16px;
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    // position: absolute;
    // top: 90%;
    // left: 40%;
  }
`;
const StyledQuestion = styled(Typography)`
  &&& {
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 32px;
    text-align: center;
    padding: 16px 16px;
    min-height: 112px;
    display: grid;
    place-items: center;
  }
`;
const StyledLineDiv = styled.div`
  &&& {
    display: grid;
    place-items: center;
    margin-top: 10px;
  }
`;
const StyledBlueLine = styled.div`
  border-top: 2px solid;
  width: 47px;
  color: #129aee;
  // position: absolute;
  // top: 50%;
  // left: 45%;
`;
const StyledButtonDivA = styled.div`
  &&& {
    display: grid;
    place-items: center;
  }
`;
const StyledButtonDivB = styled.div`
  &&& {
    display: grid;
    place-items: center;
  }
`;

const StyledButtonA = styled(Button)<{ show: boolean }>`
  &&& {
    font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    color: white;
    width: -webkit-fill-available;
    height: 40px;
    border-radius: 8px;
    text-transform: none;
    background-color: ${({ show }) => (!show ? "#3674dd" : "#1d3050")};
    border: 1px solid #2d5aa8;
    :hover {
      background: #1d3050;
      border: 1px solid #2d5aa8;
    }
  }
`;
const StyledTextBB = styled(Typography)`
  &&& {
    margin-top: 7px;
    font-family: Inter;
    font-style: normal;
    font-size: 12px;
    color: white;
    ${({ theme }) => theme.mediaWidth.upToSmall`
&&&{
  font-size: 12px;
  margin-top: 7px;

}
`};
  }
`;
const StyledButtonB = styled(Button)<{ show: boolean }>`
  &&& {
    font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    color: white;
    width: -webkit-fill-available;
    height: 40px;
    border-radius: 8px;
    text-transform: none;
    background-color: ${({ show }) => (!show ? "#3bc862" : "#1D503B")};
    border: 1px solid #3bc862;
    :hover {
      background: #1d503b;
      border: 1px solid #3bc862;
    }
  }
`;
const StyledHomeCircle = styled.div`
  &&& {
    width: 50px;
    height: 50px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    opacity: 1;
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid #4c4b4b14;
    box-shadow: 12px 12px 25px #1a1b1c73;
    cursor: pointer;
    position: absolute;
    top: 94%;
    left: 43%;
  }
`;
const HeaderDiv = styled.div`
  position: absolute;
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 14px 16px;
`;
const StyledHead = styled.p`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 24px;
  text-align: center;
  margin-top: 0px;
  background: rgba(18, 116, 196, 0.2);
  border-radius: 5px;
  width: fit-content;
  // height: 30px;
  display: grid;
  padding: 0px 12px;
  place-items: center;
`;
const BottonDiv = styled.div`
  &&& {
    display: flex;
    justify-content: space-evenly;
  }
`;

const TickImg = styled.img`
  position: absolute;
`;

interface Props {
  question: QuestionData;
  addresses: KeyValueType;
  betTaken: boolean;
  userBetAmount: string;
  userBetPosition: string;
  openQuestionModal: boolean;
}

function QuestionCard({
  question,
  addresses,
  betTaken,
  userBetAmount,
  userBetPosition,
  openQuestionModal,
}: Props) {
  const [isWalletConnected] = useWalletConnected();
  const [userBalance, setUserBalance] = useUserBalance();
  const [questionMapping] = useQuestionMapping();
  const [myBetsData, setMyBetsData] = useUserBets();
  const [chainId] = useChainId();
  const [showModal, setShowModal] = useState(openQuestionModal);
  const [showMobileModal, setShowMobileModal] = useState(openQuestionModal);
  const [showWaitingModal, setShowWaitingModal] = useState(false);
  const [, setExplorerLink] = useExplorerLink();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showInputBox, setShowInputBox] = useState(false);
  const [questionBetDataMapping, setQuestionBetDataMapping] =
    useQuestionBetDataMapping();
  const [accountAddress] = useAccountAddress();
  const [betInput, setBetInput] = useState("");
  const [option, setOption] = useState(0);
  const [waitingCardMessage, setWaitingCardMessage] = useState("");
  const [, setShowWalletModal] = useWalletModal();
  const [, setUserBetsMapping] = useUserBetsMapping();
  const [timeStamp, setTimeStamp] = useState(Math.round(Date.now() / 1000));
  const upToSmall = useMediaQuery(`(max-width: ${MEDIA_WIDTHS.upToSmall}px)`);
  const [teamLogos] = useTeamLogos();
  const history = useHistory();
  const [gasLessToggle] = useGasLessToggle();

  const handleOptionClick = async (newOption: number) => {
    if (!isWalletConnected) {
      //toast.error("Connect Your Wallet First!")
      setShowWalletModal(true);
      return;
    }
    if (
      epochConverter(new Date().toUTCString()) <
      getEpoch(question.bid_start_time)
    ) {
      toast.error("Bid Has Not Started");
      return;
    }
    if (
      getEpoch(question.bid_end_time) < epochConverter(new Date().toUTCString())
    ) {
      toast.error("Bid Has Ended");
      return;
    }
    if (network.networkId !== chainId) {
      await switchNetworkInMetamask(0);
      return;
    }
    setShowModal(false);
    setShowMobileModal(false);
    setOption(newOption);
    setShowInputBox(true);
  };

  const placeBet = async () => {
    if (betInput === "") {
      toast.error(`Please enter a valid amount`);
      return;
    }
    if (!isWalletConnected) {
      //toast.error("Connect Your Wallet First!")
      setShowWalletModal(true);
      return;
    }
    if (
      epochConverter(new Date().toUTCString()) <
      getEpoch(question.bid_start_time)
    ) {
      toast.error("Bid Has Not Started");
      return;
    }
    if (
      getEpoch(question.bid_end_time) < epochConverter(new Date().toUTCString())
    ) {
      toast.error("Bid Has Ended");
      return;
    }
    if (network.networkId !== chainId) {
      await switchNetworkInMetamask(0);
      return;
    }
    if (userBalance && parseFloat(betInput) > parseFloat(userBalance)) {
      toast.error("Balance Low");
      return;
    }
    if (parseFloat(betInput) < MINIMUM_BET_AMOUT) {
      toast.error(`Bid amount should be atleast ${MINIMUM_BET_AMOUT}`);
      return;
    }
    const questionId = question.question_id;
    console.log("CLICKEEE", betInput, option);
    setShowInputBox(false);
    setWaitingCardMessage("Proccessing Your Bid");
    setShowWaitingModal(true);
    const approvalAmount = await getApproval({
      userAddress: accountAddress,
      spenderAddress: addresses[questionId],
    });
    console.log("Approval Ammount - ", approvalAmount);
    if (!approvalAmount) {
      setShowWaitingModal(false);
      toast.error("Error: Try Again");
      return;
    }
    let betTx;
    if (parseFloat(approvalAmount) < parseFloat(betInput)) {
      setWaitingCardMessage("Approving Your Bid");
      const approvalTx = await userSetApproval({
        accountAddress: accountAddress,
        spender: addresses[questionId],
        gasLess: gasLessToggle,
      });
      console.log("approvalTx inside comp -", approvalTx);
      if (approvalTx) {
        setWaitingCardMessage("Placing Your Bid");
        betTx = await userPlaceBet({
          accountAddress: accountAddress,
          contractAddress: addresses["factory"],
          questionID: questionId,
          amount: betInput,
          option: option,
          gasLess: gasLessToggle,
        });
      } else {
        toast.error("Approve Failed");
      }
    } else {
      setWaitingCardMessage("Placing Your Bid");
      betTx = await userPlaceBet({
        accountAddress: accountAddress,
        contractAddress: addresses["factory"],
        questionID: questionId,
        amount: betInput,
        option: option,
        gasLess: gasLessToggle,
      });
    }
    setShowWaitingModal(false);
    if (betTx) {
      console.log(network.explorer + betTx);
      setExplorerLink(network.explorer + betTx);
      console.log("betTx inside comp -", betTx);
      setShowConfirmationModal(true);
      updateUserBidData();
      updateUserBalance();
    } else {
      toast.error("Bid Failed");
    }
  };

  const updateUserBidData = () => {
    const q_id = encodedID(question.question_id);
    const newData: UserBet = {
      amount: betInput,
      claimed: false,
      position: option == 0 ? "A" : "B",
      question: {
        ABetAmount: (questionBetDataMapping
          ? parseFloat(questionBetDataMapping[q_id].ABetAmount) +
            (option == 0 ? parseFloat(betInput) : 0)
          : "0"
        ).toString(),
        BBetAmount: (questionBetDataMapping
          ? parseFloat(questionBetDataMapping[q_id].BBetAmount) +
            (option == 1 ? parseFloat(betInput) : 0)
          : "0"
        ).toString(),
        ended: false,
        id: q_id,
        position: null,
        totalAmount: (questionBetDataMapping
          ? parseFloat(questionBetDataMapping[q_id].BBetAmount) +
            parseFloat(betInput)
          : "0"
        ).toString(),
      },
    };
    const newBetDataMapping = {
      ABetAmount: (questionBetDataMapping
        ? parseFloat(questionBetDataMapping[q_id].ABetAmount) +
          (option == 0 ? parseFloat(betInput) : 0)
        : "0"
      ).toString(),
      BBetAmount: (questionBetDataMapping
        ? parseFloat(questionBetDataMapping[q_id].BBetAmount) +
          (option == 1 ? parseFloat(betInput) : 0)
        : "0"
      ).toString(),
      id: q_id,
      totalAmount: (questionBetDataMapping
        ? parseFloat(questionBetDataMapping[q_id].BBetAmount) +
          parseFloat(betInput)
        : "0"
      ).toString(),
    };
    const data2 = { ...questionBetDataMapping };
    data2[q_id] = newBetDataMapping;
    setQuestionBetDataMapping(data2);

    const data = myBetsData ? [...myBetsData, newData] : [newData];
    setMyBetsData(
      questionMapping && data && sortMyPositions(data, questionMapping)
    );
    setUserBetsMapping(groupByIdBet(data));
  };

  const updateUserBalance = async () => {
    const data = await getGameTokenBalance({ accountAddress: accountAddress });
    setUserBalance(data);
  };

  const handleOpenMenu = () => {
    if (upToSmall) {
      setShowMobileModal(true);
    } else {
      setShowModal(true);
    }
    const slash =
      history.location.pathname[history.location.pathname.length - 1] === "/"
        ? ""
        : "/";
    history.push(
      history.location.pathname + slash + question.question_id.toLowerCase()
    );
  };

  const handleCloseMenu = () => {
    if (upToSmall) {
      setShowMobileModal(false);
    } else {
      setShowModal(false);
    }

    history.goBack();
  };

  useEffect(() => {
    const updateTimeStampInterval = setInterval(() => {
      setTimeStamp(Math.round(Date.now() / 1000));
    }, 60000);
    return () => clearInterval(updateTimeStampInterval);
  }, []);

  return (
    <Wrapper>
      <Toaster position="top-right" reverseOrder={false} />
      {!upToSmall ? (
        <MenuWrapper open={showModal} onClose={handleCloseMenu}>
          <MainModal
            question={question}
            action={handleOptionClick}
            close={handleCloseMenu}
            betTaken={betTaken}
            userBetAmount={userBetAmount}
            userBetPosition={userBetPosition}
          />
        </MenuWrapper>
      ) : (
        <MenuWrapper
          open={showMobileModal}
          onClose={handleCloseMenu}
          style={{ paddingTop: "60px" }}
        >
          <MobileModal
            question={question}
            action={handleOptionClick}
            close={handleCloseMenu}
            betTaken={betTaken}
            userBetAmount={userBetAmount}
            userBetPosition={userBetPosition}
          />
        </MenuWrapper>
      )}
      <MenuWrapper
        open={showWaitingModal}
        onClose={() => setShowWaitingModal(false)}
      >
        <WaitingCard
          message={waitingCardMessage}
          close={() => setShowWaitingModal(false)}
        />
      </MenuWrapper>
      <MenuWrapper
        open={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
      >
        <ConfirmationCard
          message=""
          tweetUrl={`https://twitter.com/intent/tweet?url=https://www.yoda.xyz${history.location.pathname}&via=yoda_xyz&text=I just made my prediction for ${question.match} match. What is your prediction?&hashtags=yoda_xyz,cricket`}
          close={() => setShowConfirmationModal(false)}
        />
      </MenuWrapper>
      <MenuWrapper open={showInputBox} onClose={() => setShowInputBox(false)}>
        <InputBox
          close={() => setShowInputBox(false)}
          input={betInput}
          question={question}
          setInput={setBetInput}
          action={placeBet}
          option={question.options[option]}
        />
      </MenuWrapper>
      <MainDiv show={betTaken}>
        <HeaderDiv>
          {betTaken && <TickImg src={Tick} alt="img" />}
          <StyledHead>{question.tournament}</StyledHead>
          <StyledTimer>
            <StyledTextTimer>
              {timeStamp < getEpoch(question.bid_start_time) ? (
                <span style={{ color: "#FF4C29" }}>
                  Starts in{" "}
                  {secondsToDHms(getEpoch(question.bid_start_time) - timeStamp)}
                </span>
              ) : timeStamp > getEpoch(question.bid_start_time) &&
                timeStamp < getEpoch(question.bid_end_time) ? (
                <span style={{ color: "#39aa2b" }}>
                  Ends in{" "}
                  {secondsToDHms(getEpoch(question.bid_end_time) - timeStamp)}
                </span>
              ) : (
                <span style={{ color: "#FF2442" }}>Ended</span>
              )}
            </StyledTextTimer>
          </StyledTimer>
        </HeaderDiv>
        <StyledMainCircle>
          <TeamADiv>
            <StyledCircle>
              <Team1 src={teamLogos && teamLogos[question.team_a_code.toUpperCase()]} />
            </StyledCircle>
            <StyledText
              fontSize="14px"
              textAlign="center"
              color="White"
              marginLeft="10px"
              marginTop="18px"
              fontWeight="600"
            >
              {question.team_a_code}
            </StyledText>
          </TeamADiv>

          <StyledTextVS>VS</StyledTextVS>
          <TeamBDiv>
            <StyledText
              fontSize="14px"
              textAlign="center"
              color="White"
              marginRight="10px"
              marginTop="18px"
              fontWeight="600"
            >
              {question.team_b_code}
            </StyledText>
            <StyledCircle>
              <Team1 src={teamLogos && teamLogos[question.team_b_code.toUpperCase()]} />
            </StyledCircle>
          </TeamBDiv>
        </StyledMainCircle>
        {/* <StyledText
          fontSize="12px"
          textAlign="center"
          marginTop="16px"
          color="#FFA958"
          fontWeight="550"
        >
          Match Date :{" "}
          {new Date(changeDateFormat(question.bid_end_time)).toLocaleString()}
        </StyledText> */}
        <StyledText
          fontSize="12px"
          textAlign="center"
          marginTop="10px"
          color="#FFA958"
          fontWeight="550"
        >
          {"Match Date : "}
          <Moment format="D MMM YYYY, k:m zz" withTitle>
            {new Date(changeDateFormat(question.bid_end_time))}
          </Moment>
        </StyledText>
        <StyledQuestionDiv show={betTaken}>
          <StyledQuestion>{question.question}</StyledQuestion>
          <BottonDiv>
            <StyledButtonDivA>
              <StyledButtonA
                show={betTaken && userBetPosition === "A"}
                disabled={betTaken}
                variant="contained"
                onClick={() => handleOptionClick(0)}
              >
                {question.options[0]}&nbsp;
                {betTaken && userBetPosition === "A"
                  ? `(${getFlooredFixed(userBetAmount, 1)}$)`
                  : null}
              </StyledButtonA>
              <StyledTextBB>
                {getMultiplierV2(
                  questionBetDataMapping
                    ? questionBetDataMapping[encodedID(question.question_id)]
                        ?.totalAmount
                    : "0",
                  questionBetDataMapping
                    ? questionBetDataMapping[encodedID(question.question_id)]
                        ?.ABetAmount
                    : "0"
                ).toString()}
                x Current Payout
              </StyledTextBB>
            </StyledButtonDivA>
            <StyledButtonDivB>
              <StyledButtonB
                show={betTaken && userBetPosition === "B"}
                disabled={betTaken}
                variant="contained"
                onClick={() => handleOptionClick(1)}
              >
                {question.options[1]}&nbsp;
                {betTaken && userBetPosition === "B"
                  ? `(${getFlooredFixed(userBetAmount, 1)}$)`
                  : null}
              </StyledButtonB>
              <StyledTextBB>
                {" "}
                {getMultiplierV2(
                  questionBetDataMapping
                    ? questionBetDataMapping[encodedID(question.question_id)]
                        ?.totalAmount
                    : "0",
                  questionBetDataMapping
                    ? questionBetDataMapping[encodedID(question.question_id)]
                        ?.BBetAmount
                    : "0"
                ).toString()}
                x Current Payout
              </StyledTextBB>
            </StyledButtonDivB>
          </BottonDiv>
        </StyledQuestionDiv>
        <StyledBottom>
          {getFlooredFixed(
            questionBetDataMapping
              ? questionBetDataMapping[encodedID(question.question_id)]
                  ?.totalAmount
              : "0",
            1
          )}
          $ Locked{" "}
          {/* {betTaken
            ? `| Your Stake : ${getFlooredFixed(userBetAmount, 1)}$`
            : null} */}
        </StyledBottom>
        {/* <StyledHomeCircle onClick={handleOpenMenu}>
          <StyledCircle2>
            <StyledExpandIcon />
          </StyledCircle2>
        </StyledHomeCircle> */}
        <StyledLink onClick={handleOpenMenu}>More Details</StyledLink>
      </MainDiv>
    </Wrapper>
  );
}

export default QuestionCard;
