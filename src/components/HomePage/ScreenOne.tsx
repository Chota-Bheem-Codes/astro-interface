import { Stack, Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";
import BGimg from "../../assets/screenOneBG.svg";
import Button from "@mui/material/Button";
import { QuestionData } from "../../state/questions/slice";
import {
  useQuestionBetDataMapping,
  useTeamLogos,
} from "../../state/questions/hooks";
import { encodedID, getFlooredFixed } from "../../utils";
import { useHistory } from "react-router-dom";

const Wrapper = styled.div`
  &&& {
    position: relative;
    overflow-x: hidden;
    padding: 0px 100px;
    ${({ theme }) => theme.mediaWidth.upToSmall`
  padding: 0px;
  height: auto;

`};
  }
`;
const BGS1 = styled.img<{ visible?: boolean }>`
  position: absolute;
  width: calc(860 / 1680 * 100vw);
  height: calc(780 / 1680 * 100vw);
  left: calc(600 / 1680 * 100vw);
  top: calc(30 / 1680 * 100vw);
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
  ${({ theme }) => theme.mediaWidth.upToSmall<{ visible?: boolean }>`
  width: 718px;
  height: 651px;
  left: -175px;
  top: 220px;
  display: ${({ visible }) => (visible ? "block" : "none")};

`};
`;
const SubWrapper = styled.div`
  &&& {
    display: flex;
    justify-content: space-evenly;
    width: auto;
    height: 650px;
    margin: auto;
    position: relative;
    overflow: hidden;
    ${({ theme }) => theme.mediaWidth.upToSmall`
  display: grid;
  grid-gap: 58px;
  margin-top:120px;
  position: relative;
  overflow: hidden;
  height: auto;

`};
  }
`;
const BoxLeft = styled.div`
  &&& {
    display: grid;
    place-content: center;
  }
`;
const HeadingB1 = styled(Typography)`
  &&& {
    font-family: Inter;
    font-style: normal;
    font-weight: bold;
    font-size: 48px;
    line-height: 58px;
    color: #ffffff;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    font-family: Inter;
    font-style: normal;
    font-weight: bold;
    font-size: 36px;
    line-height: 44px;
    text-align: center;
    `};
  }
`;
const TextB1 = styled(Typography)`
  &&& {
    margin-top: 16px;
    font-family: Inter;
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 26px;
    color: #ffffff;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 16px;
    line-height: 26px;
    /* or 162% */
    
    text-align: center;
    `};
  }
`;
const ButtonB1 = styled(Button)`
  &&& {
    padding: 20px;
    width: fit-content;
    margin-top: 42px;

    height: 37px;
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    /* identical to box height */
    text-align: center;
    color: #ffffff;
    text-transform: none;
    background: #189AB4;
    border-radius: 4px;
    :hover {
      background: #75E6DA;
      border: 1px solid #3bc862;
    }
    ${({ theme }) => theme.mediaWidth.upToSmall`
    padding: 20px;
    width: fit-content;
height: 37px;
margin: 42px auto;

    `};
  }
`;
const BoxRight = styled.div`
  display: grid;
  place-content: center;
`;
const QuestionBox = styled.div`
  display: grid;
  place-content: center;
`;
const SubBox = styled.div<{ visible?: boolean }>`
  // display: grid;
  // place-content: center;
  width: 458px;
  height: 300px;
  background: #0e3234;
  backdrop-filter: blur(42px);
  border-radius: 4px;
  visibility: ${({ visible }) => (visible ? "visible" : "hidden")};
  ${({ theme }) => theme.mediaWidth.upToSmall<{ visible?: boolean }>`
  width: 324.82px;
  height: 300px;
  margin-bottom: 100px;
  display: ${({ visible }) => (visible ? "block" : "none")};

  `};
`;
const HeadSubBox = styled.div`
  width: auto;
  height: 80px;
  background: #0f373c;
  backdrop-filter: blur(42px);
  // position: fixed;
  border-radius: 4px 4px 0px 0px;
`;
const Elements = styled.div`
  display: flex;
  padding: 25px;
`;
const Circle = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 30px;
  background: #c4c4c4;
`;
const Placeholder = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 30px;
  background: #c4c4c4;
`;

const Content = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  /* or 200% */
  margin: 0 12px;
  display: flex;
  align-items: center;
  letter-spacing: 0.01em;
  text-transform: uppercase;

  color: #689ea5;
`;
// const Image = styled.img`
//   width: 35px;
//   height: 35px;
// `;
const CatTag = styled.div`
  position: relative;
  left: 350px;
  bottom: 80px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 4px 12px;
  width: 100.29px;
  height: 24px;
  background: #af2eff;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  left: 225px;
  width: 92.75px;
  height: 21.77px;
}
  `};
`;
const CatText = styled(Typography)`
  &&& {
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 10px;
    line-height: 24px;
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    color: #ffffff;
  }
`;
const StyledQuestion = styled(Typography)`
  &&& {
    min-height: 75px;
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 26px;
    margin: 24px 32px;
    display: flex;
    align-items: center;
    letter-spacing: 0.01em;
    color: #ffffff;
    ${({ theme }) => theme.mediaWidth.upToSmall`
    font-size: 16px;
    line-height: 26px;

  `};
  }
`;
const StyledStack = styled(Stack)`
  display: flex;
  justify-content: center;
`;
const StyledButton = styled(Button)`
  &&& {
    width: 200px;
    height: 40px;
    border: 1px solid #3bc862;
    box-sizing: border-box;
    border-radius: 4px;
    font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.01em;
    color: #3bc862;
    :hover {
      background: #75E6DA;
      border: 1px solid #3bc862;
    }
    ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 133.56px;
    height: 48px;

  `};
  }
`;
const StyledButtonY = styled(Button)`
  &&& {
    width: 200px;
    height: 40px;
    border: 1px solid #3674dd;
    box-sizing: border-box;
    border-radius: 4px;
    font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 0.01em;
    color: #3674dd;
    :hover {
      background: #1d3050;
      border: 1px solid #3674dd;
    }
    ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 133.56px;
    height: 48px;

  `};
  }
`;
const Value = styled(Typography)`
  &&& {
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    line-height: 24px;
    display: flex;
    align-items: center;
    letter-spacing: 0.01em;
    color: #689ea5;
    margin: 14px 22px;
  }
`;

function ScreenOne({ top }: { top: QuestionData }) {
  const history = useHistory();
  const [teamLogos] = useTeamLogos();
  const [questionBetDataMapping] = useQuestionBetDataMapping();
  const handleClick = () => {
    const slash =
      history.location.pathname[history.location.pathname.length - 1] === "/"
        ? ""
        : "/";
    if (top)
      history.push(
        "prediction-markets" +
          slash +
          top?.category.toLowerCase() +
          slash +
          top.question_id.toLowerCase()
      );
  };
  return (
    <Wrapper>
      <SubWrapper>
        <BoxLeft>
          <HeadingB1>
            Decentralized <br /> Prediction Markets
          </HeadingB1>
          <TextB1>
            Encash your knowledge, predict the right
            <br /> outcome of an event and win rewards.
          </TextB1>
          <ButtonB1
            onClick={() => history?.push("/prediction-markets/football")}
          >
            View All Markets
          </ButtonB1>
        </BoxLeft>
        <BoxRight>
          <BGS1 visible={!!top} src={BGimg} alt="" />
          <QuestionBox>
            <SubBox visible={!!top}>
              <HeadSubBox>
                <Elements>
                  {!top ? (
                    <Placeholder />
                  ) : (
                    <>
                      {top?.team_b === "" ? (
                        <>
                          <Circle
                            src={
                              teamLogos &&
                              top &&
                              teamLogos[top.team_a_code.toUpperCase()]
                            }
                          />
                          <Content>
                            {top?.team_a_code} <br />
                            {/* Match Date: 15 Oct 2021, 16:00 IST */}
                          </Content>
                        </>
                      ) : (
                        <>
                          <Content>
                            {top?.team_a_code} <br />
                            {/* Match Date: 15 Oct 2021, 16:00 IST */}
                          </Content>
                          <Circle
                            src={
                              teamLogos &&
                              top &&
                              teamLogos[top.team_a_code.toUpperCase()]
                            }
                          />
                          <Content style={{ fontSize: "10px" }}>
                            vs <br />
                          </Content>
                          <Circle
                            src={
                              teamLogos &&
                              top &&
                              teamLogos[top.team_b_code.toUpperCase()]
                            }
                          />
                          <Content>
                            {top?.team_b_code} <br />
                          </Content>
                        </>
                      )}
                    </>
                  )}
                </Elements>
                <CatTag>
                  <CatText>{top?.category}</CatText>
                </CatTag>
              </HeadSubBox>
              <StyledQuestion>{top?.question}</StyledQuestion>
              <StyledStack spacing={2} direction="row">
                <StyledButtonY onClick={handleClick}>
                  {top?.options[0]}
                </StyledButtonY>
                <StyledButton onClick={handleClick}>
                  {top?.options[1]}
                </StyledButton>
              </StyledStack>
              <Value>
                Value Locked: $
                {top
                  ? getFlooredFixed(
                      questionBetDataMapping
                        ? questionBetDataMapping[encodedID(top.question_id)]
                            ?.totalAmount
                        : "0",
                      1
                    )
                  : ""}
              </Value>
            </SubBox>
          </QuestionBox>
        </BoxRight>
      </SubWrapper>
    </Wrapper>
  );
}

export default ScreenOne;
