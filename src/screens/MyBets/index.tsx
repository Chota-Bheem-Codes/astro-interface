import { useState, useEffect } from "react";
import { ButtonBlue } from "../../components/Button";
import PredictionCard from "../../components/PredictionCard";
import { getMyBetDataGraph } from "../../util/getData";
import Grid from "@mui/material/Grid";
import PieChart from "../../components/PieChart/PieChart";
import { Box } from "@mui/system";
import { useHistory } from "react-router-dom";
import { useWalletModal } from "../../state/wallet/hooks";
import styled from "styled-components";
import { Stack, Typography } from "@mui/material";
import {
  useMatchData,
  useQuestionAddresses,
  useQuestionMapping,
  useUserBets,
  useUserBetsMapping,
} from "../../state/questions/hooks";
import {
  encodedID,
  getFlooredFixed,
  groupByIdBet,
  sortMyPositions,
} from "../../utils";
import useWeb3Modal from "../../hooks/useWeb3Modal";
import { REWARD_RATE, TOTAL_RATE } from "../../config/Constants";
import Buttons from "../../components/Buttons";
import { useNetworkManager } from "../../state/network/hooks";
const NetEarning = styled(Box)`
  background: #00a57630;
  border: 1px solid #00a576;
  box-sizing: border-box;
  border-radius: 8px;
  color: ${({ theme }) => theme.white1};
  padding: 12px 14px;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  letter-spacing: 0.01em;
  height: fit-content;
  min-width: 250px;
  width: 100%;
  .green {
    font-weight: 600;
    font-size: 24px;
    line-height: 29px;
    color: ${({ theme }) => theme.green1};
  }
  .red {
    font-weight: 600;
    font-size: 24px;
    line-height: 29px;
    color: ${({ theme }) => theme.red1};
  }
  @media only screen and (max-width: 900px) {
    & > p {
      white-space: nowrap;
    }
    & {
      min-width: 180px;
    }
  }
`;
const EarningDetail = styled(Box)`
  display: flex;
  flex-direction: column;
  font: normal normal 500 13px/18px Roboto;
  color: ${({ theme }) => theme.white1};
  padding: 12px 0;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
  .claimed {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: ${({ theme }) => `${theme.green3}`};
  }
  .unclaimed {
    font-weight: 600;
    font-size: 16px;
    line-height: 24px;
    color: ${({ theme }) => `${theme.yellow3}`};
  }
`;
const EarningDetailStack = styled(Stack)`
  background: #00a57630;
  border: 1px solid #00a576;
  padding: 9px;
  box-sizing: border-box;
  border-radius: 8px;
  @media only screen and (max-width: 900px) {
    background: transparent;
    border: none;
  }
`;
const WhiteLine = styled.div`
  border-left: 1px solid ${({ theme }) => `${theme.yellow2}4F`};
  height: 40px;
  align-self: center;
  margin: 0 10px;
`;
const ClaimButton = styled(ButtonBlue)`
  &&& {
    text-transform: none;
    margin-top: 25px;
    @media only screen and (max-width: 900px) {
      padding: 9px;
    }
  }
`;
const StyledFlexBox = styled.div`
  &&& {
    width: 90%;
    margin: auto;
    @media only screen and (max-width: 900px) {
      width: 100%;
    }
  }
`;
const StyledText = styled(Typography)`
  &&& {
    font-family: Inter;
    font-style: normal;
  }
`;
const MyPositionsDetails = styled.div`
  &&& {
    opacity: 1;
    margin: 0px 40px;
    position: relative;
    padding: 10px 35px;
    background: linear-gradient(91.56deg, #131a1e 44.93%, #003022 140.31%);
    border-radius: 16px;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
&&&{
  margin: 0px 10px;
  padding: 10px;


}
`};
`;
const Tabs = styled.div`
  &&& {
    display: flex;
    margin: 30px 50px 16px 50px;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
&&&{
  margin: 30px 0px 16px 0px;

}
`};
`;

const TabButton = styled.button<{
  value: number;
  index: number;
}>`
  color: ${({ value, index, theme }) =>
    value === index ? theme.white : "#878787"};
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 19px;
  border: none;
  border-bottom: 2px solid
    ${({ value, index, theme }) =>
      value === index ? theme.white : "transparent"};
  padding: 4px;
  outline: none;
  background: transparent;
  cursor: pointer;
  margin-right: 10px;
  @media only screen and (max-width: 900px) {
    width: 50%;
    margin: 0;
  }
`;
const RedDot = styled.div`
  background-color: red;
  border-radius: 50%;
  width: 4px;
  height: 4px;
  position: absolute;
  left: 100%;
  bottom: 100%;
`;
const BannerButton = styled(ButtonBlue)`
  &&&& {
    padding: 10px 0;
    text-transform: capitalize;
    background: #c2c640;
    max-width: 140px;
    margin-top: 30px;
    min-width: 200px;
  }
`;
const Banner2Header = styled(StyledText)`
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  margin-bottom: 25px;
  @media only screen and (max-width: 475px) {
    margin-bottom: 20px;
    font-size: 16px;
    line-height: 22px;
  }
`;
const Banner2 = styled.div`
&&&{  
margin: auto;
  margin-top: 50px;
  padding: 32px;
  opacity: 1;
  border-radius: 15px;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 10px;
  justify-content: center;
  align-items: center;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  &&&{
   margin-left: 25px;
  }
  `};
  `;

const MyBets = () => {
  const history = useHistory();
  let [myBetsData, setMyBetsData] = useUserBets();
  myBetsData = myBetsData ?? [];
  const { currentAccountAddress } = useWeb3Modal();
  const [showWalletModal, setShowWalletModal] = useWalletModal();
  const [currentQuestionMapping] = useQuestionMapping();
  const [questionAddresses] = useQuestionAddresses();
  const [, setUserBetsMapping] = useUserBetsMapping();
  const [currentTab, setCurrentTab] = useState(0);
  const [currentNetwork] = useNetworkManager()
  const fetchData = async () => {
    if (!currentAccountAddress) return;
    const response = await getMyBetDataGraph(currentNetwork.graphEndpoint,currentAccountAddress);
    setMyBetsData(
      response && currentQuestionMapping
        ? sortMyPositions(response, currentQuestionMapping)
        : []
    );
    setUserBetsMapping(groupByIdBet(response));
  };

  useEffect(() => {
    fetchData();
  }, [currentAccountAddress]);

  useEffect(() => {}, [myBetsData]);

  return (
    <>
      <Buttons />
      <StyledFlexBox>
        <MyPositionsDetails>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems="flex-end"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row-reverse", md: "row" },
              }}
              flexGrow={2}
              justifyContent="space-between"
            >
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                padding={{ xs: "10px 0", md: "30px 0" }}
              >
                <StyledText
                  display={{ md: "block", xs: "none" }}
                  fontWeight={"bold"}
                  fontSize="36px"
                >
                  Your Positions
                </StyledText>
                <Stack direction={{ xs: "column", md: "row" }}>
                  <NetEarning
                    marginRight={{ xs: "0", md: "10px" }}
                    marginBottom={{ xs: "20px", md: "0px" }}
                  >
                    <p>Net Earnings</p>
                    <p className="green">
                      {"$ "} {getFlooredFixed(getTotalWonAmount(myBetsData), 2)}
                    </p>
                  </NetEarning>
                  {/* <NetEarning>
                    <p>Total Amount in Bets</p>
                    <p className="red">
                      {"$ "} {getFlooredFixed(getTotalWonAmount(myBetsData), 2)}
                    </p>
                  </NetEarning> */}
                </Stack>
              </Box>
              <Box maxWidth={"230px"} margin="auto">
                <PieChart
                  won={getTotalWon(myBetsData)}
                  lost={
                    getTotalGamePlayed(myBetsData) - getTotalWon(myBetsData)
                  }
                />
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "fl",
                justifyContent: "center",
                flexDirection: "column",
                width: "100%",
                padding: { xs: "0", md: "30px 0" },
                maxWidth: { xs: "100%", md: "350px" },
              }}
            >
              <EarningDetailStack direction={{ md: "row" }} width="100%">
                <EarningDetail>
                  <p>Claimed</p>
                  <p className="claimed">
                    {getFlooredFixed(getTotalClaimed(myBetsData), 2)}$
                  </p>
                </EarningDetail>
                <WhiteLine />
                <EarningDetail>
                  <p>Unclaimed</p>
                  <p className="unclaimed">
                    {getFlooredFixed(
                      getTotalWonAmount(myBetsData) -
                        getTotalClaimed(myBetsData),
                      2
                    )}
                    $
                  </p>
                </EarningDetail>
              </EarningDetailStack>
              {/* <ClaimButton>Claim All</ClaimButton> */}
            </Box>
          </Stack>
        </MyPositionsDetails>

        <Tabs>
          <TabButton
            value={currentTab}
            index={0}
            onClick={() => setCurrentTab(0)}
          >
            Live Markets
          </TabButton>
          <TabButton
            value={currentTab}
            index={1}
            onClick={() => setCurrentTab(1)}
          >
            <span style={{ position: "relative" }}>
              {parseFloat(
                getFlooredFixed(
                  getTotalWonAmount(myBetsData) - getTotalClaimed(myBetsData),
                  2
                )
              ) > 0.0 && <RedDot />}
              Closed Markets
            </span>
          </TabButton>
        </Tabs>

        <Grid container columnSpacing={4} rowSpacing={{ xs: 1, sm: 2 }}>
          {questionAddresses &&
            myBetsData
              ?.filter((item: any) => {
                if (currentTab === 0) return !item.question.position;
                else if (currentTab === 1) return !!item.question.position;
                else return true;
              })
              ?.map((item: any) => {
                console.log(
                  currentQuestionMapping &&
                    currentQuestionMapping[item.question.id].question
                );
                return currentQuestionMapping ? (
                  <Grid
                    item
                    xs={12}
                    md={6}
                    lg={4}
                    key={currentQuestionMapping[item.question.id].question_no}
                  >
                    <PredictionCard
                      claimed={item.claimed}
                      category={
                        currentQuestionMapping[item.question.id].category
                      }
                      event={
                        currentQuestionMapping[item.question.id].tournament
                      }
                      question={
                        currentQuestionMapping[item.question.id].question
                      }
                      bid_end_time={
                        currentQuestionMapping[item.question.id].bid_end_time
                      }
                      question_show_end_time={
                        currentQuestionMapping[item.question.id]
                          .question_show_end_time
                      }
                      questionData={item.question}
                      amount={item.amount}
                      position={item.position}
                      team_a_code={
                        currentQuestionMapping[item.question.id].team_a_code
                      }
                      team_b_code={
                        currentQuestionMapping[item.question.id].team_b_code
                      }
                      options={currentQuestionMapping[item.question.id].options}
                      questionID={
                        currentQuestionMapping[item.question.id].question_id
                      }
                      questionAddresses={questionAddresses}
                      updatePositionData={fetchData}
                    />
                  </Grid>
                ) : (
                  <></>
                );
              })}
          {!currentAccountAddress && (
            <Banner2>
              <Banner2Header fontWeight="bold">
                Connect your wallet to view your positions!
              </Banner2Header>

              <BannerButton onClick={() => setShowWalletModal(true)}>
                Connect Wallet
              </BannerButton>
            </Banner2>
          )}
          {currentAccountAddress &&
            (myBetsData.length < 1 ? (
              <Banner2>
                <Banner2Header fontWeight="bold">
                  Looks like you haven't participated in our markets yet. What
                  are you waiting for predict now and earn rewards!
                </Banner2Header>

                <BannerButton
                  onClick={() => history.push("/prediction-markets/football")}
                >
                  Predict Now
                </BannerButton>
              </Banner2>
            ) : (
              myBetsData?.filter((item: any) => {
                if (currentTab === 0) return !item.question.ended;
                else if (currentTab === 1) return item.question.ended;
                else return true;
              }).length < 1 && (
                <>
                  <Banner2>
                    <Banner2Header fontWeight="bold">
                      {currentTab === 0
                        ? "You don't have an open position in any of the current markets. Predict now to earn rewards!"
                        : "The markets you have participated in are not yet resolved. You can check your positions under Live Positions tab!"}
                    </Banner2Header>

                    {currentTab === 0 ? (
                      <BannerButton
                        onClick={() =>
                          history.push("/prediction-markets/football")
                        }
                      >
                        Predict Now
                      </BannerButton>
                    ) : (
                      <BannerButton onClick={() => setCurrentTab(0)}>
                        Check your positions
                      </BannerButton>
                    )}
                  </Banner2>{" "}
                </>
              )
            ))}
        </Grid>
      </StyledFlexBox>
    </>
  );
};

export default MyBets;

const getTotalWon = (myBetsData: any[]) => {
  return myBetsData.reduce((total, current) => {
    if (current.position === current.question.position) return total + 1;
    return total;
  }, 0);
};

const getTotalWonAmount = (myBetsData: any[]) => {
  return myBetsData.reduce((total, current) => {
    let rewardAmount =
      (current.question.totalAmount * REWARD_RATE) / TOTAL_RATE;
    if (current.position === current.question.position) {
      if (current.position === "A") {
        if (current.question.BBetAmount === "0") {
          rewardAmount = parseFloat(current.question.totalAmount);
        }
      } else if (current.position === "B") {
        if (current.question.ABetAmount === "0") {
          rewardAmount = parseFloat(current.question.totalAmount);
        }
      }
    }
    if (current.position === current.question.position) {
      if (current.position === "A")
        return (
          total +
          (parseFloat(current.amount) * rewardAmount) /
            parseFloat(current.question?.ABetAmount)
        );
      if (current.position === "B")
        return (
          total +
          (parseFloat(current.amount) * rewardAmount) /
            parseFloat(current.question?.BBetAmount)
        );
    }
    if (current.position === "C") return total + parseFloat(current.amount);
    return total;
  }, 0);
};
const getTotalGamePlayed = (myBetsData: any[]) => {
  return myBetsData.reduce((total, current) => {
    if (current.question.position) return total + 1;
    return total;
  }, 0);
};
const getTotalClaimed = (myBetsData: any[]) => {
  return myBetsData.reduce((total, current) => {
    let rewardAmount =
      (current.question.totalAmount * REWARD_RATE) / TOTAL_RATE;
    if (current.position === current.question.position) {
      if (current.position === "A") {
        if (current.question.BBetAmount === "0") {
          rewardAmount = parseFloat(current.question.totalAmount);
        }
      } else if (current.position === "B") {
        if (current.question.ABetAmount === "0") {
          rewardAmount = parseFloat(current.question.totalAmount);
        }
      }
    }

    if (current.position === current.question.position && current.claimed) {
      if (current.position === "A")
        return (
          total +
          (parseFloat(current.amount) * rewardAmount) /
            parseFloat(current.question?.ABetAmount)
        );
      if (current.position === "B")
        return (
          total +
          (parseFloat(current.amount) * rewardAmount) /
            parseFloat(current.question?.BBetAmount)
        );
    }
    if (current.position === "C" && current.claimed)
      return total + parseFloat(current.amount);
    return total;
  }, 0);
};
