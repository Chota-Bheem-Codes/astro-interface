import styled from "styled-components";
import { ButtonPrimary } from "../Button";
import secondsToDHms from "../../utils/secondsToDHms";
import { useState, useEffect } from "react";
import getMultiplierV2 from "../../utils/getMultiplierV2";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { getEpoch } from "../../utils/getEpoch";
import { network, REWARD_RATE, TOTAL_RATE } from "../../config/Constants";
import WinImage from "../../assets/win.svg";
import LostImage from "../../assets/lost.svg";
import DrawImage from "../../assets/draw.svg";
import {
  useAccountAddress,
  useChainId,
  useWalletConnected,
  useWalletModal,
} from "../../state/wallet/hooks";
import { changeDateFormat } from "../../utils/getEpoch";
import { KeyValueType } from "../../state/questions/slice";
import { userClaimRewards } from "../../config/ContractFunctions";
import MenuWrapper from "../MenuWrapper";
import { WaitingCard } from "../TransactionsCards/WaitingCard";
import ConfirmationCard from "../TransactionsCards/ConfirmationCard";
import { switchNetworkInMetamask } from "../../utils/metamaskFunctions";
import {
  useExplorerLink,
  useGasLessToggle,
  useTeamLogos,
} from "../../state/questions/hooks";
import { getFlooredFixed } from "../../utils";
import toast, { Toaster } from "react-hot-toast";
import Moment from "react-moment";
import { useNetworkManager } from "../../state/network/hooks";

interface PredictionCardProps {
  category: string;
  event: string;
  question: string;
  team_a_code: string;
  team_b_code: string;
  options: string[];
  claimed: boolean;
  questionData: any;
  amount: string;
  position: string;
  bid_end_time: string;
  question_show_end_time: string;
  questionID: string;
  questionAddresses: KeyValueType;
  updatePositionData: () => void;
}
export const CardTranslucent = styled.div<{
  padding?: string;
  width?: string;
  borderRadius?: string;
  show?: boolean;
}>`
  &&& {
    border-radius: 16px;
    margin: 0 auto;
    margin-bottom: 35px;
    height: 465px;
    max-width: 378px;
    opacity: 1;
    backdrop-filter: blur(42px);
    -webkit-backdrop-filter: blur(42px);
    /* border: 1px solid;
    border-image: radial-gradient(rgb(0, 143, 104), rgb(250, 224, 66)) 1; */

    padding: 16px;
    // box-shadow: 12px 12px 25px #1a1b1c73;
    position: relative;
    background: linear-gradient(
      152.97deg,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0) 100%
    );
    background-color: ${({ show }) => (show ? "#80808040" : "none")};
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
&&&{
  margin: 10px;
  margin-bottom: 25px;
  position: relative;
}
  `};
`;
const ImageBox = styled.div`
  width: 38px;
  height: 38px;
  padding: 5px;
  border-radius: 999px;
  background-color: ${({ theme }) => theme.white1};
  margin: 8px;
  overflow: hidden;
  display: flex;
`;
const Image = styled.img`
  object-fit: contain;
  height: 100%;
  margin: auto;
`;
const Country = styled.p`
  color: ${({ theme }) => theme.white};
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
`;

const VS = styled.p`
  color: ${({ theme }) => theme.gray2};
  font: normal normal 500 10px/12px Roboto;
`;

export const CardStatus = styled.div<{ status?: string }>`
  color: ${({ theme }) => theme.text1};
  position: absolute;
  top: 0;
  right: 0;
  background-color: ${({ theme, status }) => {
    if (status === "won") return theme.green2;
    if (status === "live") return theme.red2;
    if (status === "lost") return theme.red1;
    if (status === "draw") return theme.lightBlue1;
    return theme.green2;
  }};
  border-radius: 0px 8px 0px 9px;
  padding: 7px 30px;
`;
const Category = styled.p`
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;
  font: normal normal bold 14px/21px Roboto;
`;
const Event = styled.p`
  color: ${({ theme }) => theme.text1};
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
const Question = styled.p`
  color: ${({ theme }) => theme.text1};
  font-weight: 600;
  font-size: 15px;
  line-height: 26px;
  padding: 0px 16px;
  padding-top: 16px;
  min-height: 94px;
  letter-spacing: 0.01em;
`;
const BlueLine = styled.div`
  border-top: 2px solid ${({ theme }) => theme.lightBlue1};
  width: 47px;
  margin-bottom: 10px;
`;

const DetailsTitle = styled.span<{
  color?: string;
}>`
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
  color: ${({ theme, color }) => {
    if (color === "green") return theme.green1;
    else if (color === "yellow") return theme.yellow2;
    else return theme.green1;
  }};
  display: flex;
  align-items: center;
  img {
    margin-left: 8px;
  }
`;
const Details = styled.div<{ color?: string }>`
  font: normal normal bold 16px/18px Roboto;
  color: ${({ theme, color }) => {
    if (color === "green") return theme.green2;
    if (color === "red") return theme.red2;
    if (color === "lightBlue") return theme.lightBlue1;
    return theme.lightBlue1;
  }}; ;
`;
const Earning = styled.p`
  font: normal normal 500 14px/17px Roboto;
  color: ${({ theme }) => theme.lightBlue1};
  margin-top: 7px;
`;
const GreyLine = styled.div`
  border-left: 1px solid ${({ theme }) => theme.gray3};
  height: 20px;
`;
const ClaimButton = styled(ButtonPrimary)`
  &&& {
    align-self: flex-end;
    margin-top: 18px;
    padding: 8px 20px;
    margin-left: auto;
    width: 100%;
    background: #00a575;
    text-transform: none;
  }
`;
const ButtonGhostGray = styled.div<{
  padding?: string;
  width?: string;
  borderRadius?: string;
  altDisabledStyle?: boolean;
}>`
  padding: ${({ padding }) => (padding ? padding : "18px")};
  width: ${({ width }) => (width ? width : "100%")};
  background-color: transparent;
  color: ${({ theme }) => theme.gray2};
  border: 1px solid ${({ theme }) => theme.gray2};
  border-radius: 6px;
  border-radius: ${({ borderRadius }) => borderRadius && borderRadius};
  cursor: text;
  text-align: center;
  display: flex;
  justify-content: center;
`;
const ButtonGhostLightblue = styled.div<{
  padding?: string;
  width?: string;
  borderRadius?: string;
  altDisabledStyle?: boolean;
}>`
  padding: ${({ padding }) => (padding ? padding : "18px")};
  width: ${({ width }) => (width ? width : "100%")};
  background-color: ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.white};
  border-radius: 6px;
  border-radius: ${({ borderRadius }) => borderRadius && borderRadius};
  cursor: text;
  text-align: center;
  display: flex;
  justify-content: center;
`;
export const Text = styled.p<{
  fontSize?: string;
  fontWeight?: string | number;
  color?: string;
  lineHeight?: string;
  textAlign?: string;
}>`
  font-weight: ${({ fontWeight }) => (fontWeight ? fontWeight : 400)};
  font-size: ${({ fontSize }) => (fontSize ? fontSize : "14px")};
  line-height: ${({ lineHeight }) => (lineHeight ? lineHeight : "24px")};
  text-align: ${({ textAlign }) => (textAlign ? textAlign : "left")};
  letter-spacing: 0.01em;
  color: ${({ theme, color }) => {
    if (color === "gray") return theme.gray2;
    if (color === "lightBlue") return theme.lightBlue1;
    return theme.white1;
  }};
`;
const StyledText = styled(Typography)`
  &&& {
    font-family: Inter;
    font-style: normal;
  }
`;
const StyledQuestionDiv = styled.div`
  &&& {
    width: 100%;
    height: 173px;
    // background: rgba(0, 0, 0, 0.5);
    border-radius: 16px;
    margin: 7px 0;
    padding-bottom: 10px;
    background-color: rgba(0, 0, 0, 0.5);
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    border: 1px solid #4c4b4b14;
    box-shadow: 12px 12px 25px #1a1b1c73;
  }
`;
const ButtonDiv = styled.div`
  &&& {
    display: flex;
    justify-content: space-evenly;
  }
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
    width: 148.93px;
    height: 40px;
    border-radius: 8px;
    text-transform: none;
    background-color: ${({ show, disabled }) =>
      disabled && show ? "#1D3050" : "#1A1A1680"};
    border: 1px solid
      ${({ show, disabled }) => (disabled && show ? "#3674dd" : "#262626")};
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
    width: 148.93px;
    height: 40px;
    border-radius: 8px;
    text-transform: none;
    background-color: ${({ show, disabled }) =>
      disabled && show ? "#1D503B" : "#1A1A1680"};
    border: 1px solid
      ${({ show, disabled }) => (disabled && show ? "#2C8845" : "#262626")};
  }
`;
const WhiteLine = styled.div`
  border-left: 1px solid ${({ theme }) => `${theme.yellow2}4F`};
  height: 35px;
  align-self: center;
  margin: 0 10px;
`;
const PredictionCard: React.FC<
  PredictionCardProps & React.HTMLAttributes<HTMLDivElement>
> = ({
  category,
  event,
  question,
  team_a_code,
  team_b_code,
  options,
  claimed,
  questionData,
  amount,
  position,
  bid_end_time,
  question_show_end_time,
  questionID,
  questionAddresses,
  updatePositionData,
  ...props
}) => {
  const [timestamp, setTimestamp] = useState(Math.round(Date.now() / 1000));
  const [isWalletConnected] = useWalletConnected();
  const [accountAddress] = useAccountAddress();
  const [chainId] = useChainId();
  const [, setShowWalletModal] = useWalletModal();
  const [showWaitingModal, setShowWaitingModal] = useState(false);
  const [isClaimed, setIsClaimed] = useState(claimed);
  const [, setExplorerLink] = useExplorerLink();
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [teamLogos] = useTeamLogos();
  const [gasLessToggle] = useGasLessToggle();
  const [error, setError] = useState<undefined | string>(undefined);
  const [currentNetwork] = useNetworkManager()

  useEffect(() => {
    if (getEpoch(bid_end_time) - timestamp > 0) {
      setError("Ongoing Market");
    } else if (!questionData.position) {
      setError("Resolution in progress");
    } else if (questionData.position === "C" && isClaimed) {
      setError("No Result");
    } else if (questionData.position !== position) {
      setError(`Lost ($${getFlooredFixed(amount, 4)})`);
    } else if (isClaimed) {
      setError(
        `Claimed ($${
          position === questionData.position
            ? questionData.position === "A"
              ? getFlooredFixed(
                  (parseFloat(amount) * rewardAmount) /
                    parseFloat(questionData?.ABetAmount),
                  2
                )
              : getFlooredFixed(
                  (parseFloat(amount) * rewardAmount) /
                    parseFloat(questionData?.BBetAmount),
                  2
                )
            : questionData.position === "C"
            ? amount
            : "0"
        })`
      );
    } else {
      setError(undefined);
    }
  }, [setError, questionData, position, isClaimed]);

  let rewardAmount =
    (parseFloat(questionData.totalAmount) * REWARD_RATE) / TOTAL_RATE;

  if (position === questionData.position) {
    if (position === "A") {
      if (questionData.BBetAmount === "0") {
        rewardAmount = parseFloat(questionData.totalAmount);
      }
    } else if (position === "B") {
      if (questionData.ABetAmount === "0") {
        rewardAmount = parseFloat(questionData.totalAmount);
      }
    }
  }

  const handleClaim = async () => {
    if (!isWalletConnected) {
      //alert("Connect Your Wallet First!")
      setShowWalletModal(true);
      return;
    }
    if (currentNetwork.networkId !== chainId) {
      await switchNetworkInMetamask(0);
      return;
    }
    console.log("Claim");
    console.log(questionID);
    setShowWaitingModal(true);
    const tx = await userClaimRewards({
      questionID: questionID,
      contractAddress: questionAddresses["factory"],
      accountAddress: accountAddress,
      gasLess: gasLessToggle,
    });
    setShowWaitingModal(false);
    if (tx) {
      setExplorerLink(network.explorer + tx);
      console.log("Claimtx inside comp -", tx);
      setShowConfirmationModal(true);
      setIsClaimed(true);
      updatePositionData();
    } else {
      toast.error("Claim Rewards Failed");
    }
    console.log("Bet Claim tx - ", tx);
  };

  useEffect(() => {
    const updateTimeStampInterval = setInterval(() => {
      setTimestamp(Math.round(Date.now() / 1000));
    }, 60000);
    return () => clearInterval(updateTimeStampInterval);
  }, []);
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <CardTranslucent {...props}>
        <MenuWrapper
          open={showWaitingModal}
          onClose={() => setShowWaitingModal(false)}
        >
          <WaitingCard
            message="Claiming Rewards"
            close={() => setShowWaitingModal(false)}
          />
        </MenuWrapper>
        <MenuWrapper
          open={showConfirmationModal}
          onClose={() => setShowConfirmationModal(false)}
        >
          <ConfirmationCard
            tweetUrl=""
            message="Rewards Claimed"
            close={() => setShowConfirmationModal(false)}
          />
        </MenuWrapper>
        {/* <CardStatus
        status={
          !questionData.ended
            ? "live"
            : position === questionData.position
            ? "won"
            : questionData.position === "C"
            ? "draw"
            : "lost"
        }
      >
        {!questionData.ended
          ? getEpoch(question_show_end_time) - timestamp > 0
            ? "Live"
            : "Ended"
          : position === questionData.position
          ? "Won"
          : questionData.position === "C"
          ? "No result"
          : "Lost"}
      </CardStatus> */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Event>{event}</Event>
          {questionData.ended ? (
            <>
              <DetailsTitle color={"yellow"}>
                {position === questionData.position ? (
                  <>
                    Won
                    <img src={WinImage} alt="Image" />
                  </>
                ) : questionData.position === "C" ? (
                  <>
                    Draw
                    <img src={DrawImage} alt="Image" />
                  </>
                ) : (
                  <>
                    Lost
                    <img src={LostImage} alt="Image" />
                  </>
                )}
              </DetailsTitle>
            </>
          ) : (
            <>
              <DetailsTitle color={"green"}>
                {getEpoch(bid_end_time) - timestamp > 0 ? "Ends In " : "Ended"}
                {getEpoch(bid_end_time) - timestamp > 0
                  ? secondsToDHms(getEpoch(bid_end_time) - timestamp)
                  : ""}
              </DetailsTitle>
            </>
          )}
        </Box>

        {!!team_b_code ? (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-around",
                marginTop: "10px",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <ImageBox>
                  <Image
                    src={teamLogos && teamLogos[team_a_code?.toUpperCase()]}
                  />
                </ImageBox>
                <Country>{team_a_code}</Country>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <VS>VS</VS>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row-reverse",
                  alignItems: "center",
                }}
              >
                <ImageBox>
                  <Image src={teamLogos && teamLogos[team_b_code]} />
                </ImageBox>
                <Country>{team_b_code}</Country>
              </Box>
            </Box>
            <StyledText
              fontSize="12px"
              textAlign="center"
              marginTop="10px"
              color="#FFA958"
              fontWeight="550"
            >
              {"Match Date : "}
              <Moment format="D MMM YYYY, k:m zz" withTitle>
                {new Date(changeDateFormat(bid_end_time))}
              </Moment>
            </StyledText>
          </>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "10px",
              }}
            >
              <ImageBox>
                <Image
                  src={teamLogos && teamLogos[team_a_code?.toUpperCase()]}
                  style={{ width: "50px" }}
                />
              </ImageBox>
              <Country>{team_a_code}</Country>
            </Box>
            <StyledText
              fontSize="14px"
              minHeight="19px"
              textAlign="center"
              marginTop="10px"
              color="#FFA958"
              fontWeight="550"
            >
              {" "}
            </StyledText>
          </>
        )}

        <StyledQuestionDiv>
          <Question>{question}</Question>

          <ButtonDiv>
            <StyledButtonDivA>
              <StyledButtonA
                show={position === "A"}
                disabled={true}
                variant="contained"
              >
                {options[0]}
              </StyledButtonA>
              <StyledText fontSize="12px" color="white" marginTop={`7px`}>
                {getMultiplierV2(
                  questionData?.totalAmount,
                  questionData?.ABetAmount
                ).toString()}
                x Current Payout
              </StyledText>
            </StyledButtonDivA>
            <StyledButtonDivB>
              <StyledButtonB
                show={position === "B"}
                disabled={true}
                variant="contained"
              >
                {options[1]}
              </StyledButtonB>
              <StyledText fontSize="12px" color="white" marginTop={`7px`}>
                {" "}
                {getMultiplierV2(
                  questionData?.totalAmount,
                  questionData?.BBetAmount
                ).toString()}
                x Current Payout
              </StyledText>
            </StyledButtonDivB>
          </ButtonDiv>
        </StyledQuestionDiv>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <StyledText fontSize="12px" fontWeight="600">
              Your Bid On {options[0]}
            </StyledText>
            <StyledText
              fontSize="14px"
              fontWeight="600"
              color={position === "A" ? "#3674DD" : "#5C5C5C"}
            >
              ${position === "A" ? getFlooredFixed(amount, 4) : "0.0"}
            </StyledText>
          </Box>
          <WhiteLine />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <StyledText fontSize="12px" fontWeight="600">
              Your Bid On {options[1]}
            </StyledText>
            <StyledText
              fontSize="14px"
              fontWeight="600"
              color={position === "B" ? "#3BC862" : "#5C5C5C"}
            >
              ${position === "B" ? getFlooredFixed(amount, 4) : "0.0"}
            </StyledText>
          </Box>
        </Box>

        <StyledText
          marginTop="8px"
          fontSize="14px"
          fontWeight="600"
          textAlign="center"
        >
          ${getFlooredFixed(questionData.totalAmount, 2)} TVL
        </StyledText>

        {
          <ClaimButton disabled={!!error} onClick={handleClaim}>
            {error
              ? error
              : `Claim ($${
                  position === questionData.position
                    ? questionData.position === "A"
                      ? getFlooredFixed(
                          (parseFloat(amount) * rewardAmount) /
                            parseFloat(questionData?.ABetAmount),
                          2
                        )
                      : getFlooredFixed(
                          (parseFloat(amount) * rewardAmount) /
                            parseFloat(questionData?.BBetAmount),
                          2
                        )
                    : questionData.position === "C"
                    ? amount
                    : "0"
                }
            )`}
          </ClaimButton>
        }
      </CardTranslucent>
    </>
  );
};

export default PredictionCard;
