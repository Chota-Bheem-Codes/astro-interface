import { Typography } from "@mui/material";
import React from "react";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useUserBalance } from "../../state/wallet/hooks";
import { getFlooredFixed } from "../../utils";
import { QuestionData } from "../../state/questions/slice";
import { Box as MuiBox } from "@mui/system";
import Moment from "react-moment";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  changeDateFormat,
  epochConverter,
  getEpoch,
} from "../../utils/getEpoch";
import { useTeamLogos } from "../../state/questions/hooks";
const Wrapper = styled.div`
  color: white;
  width: 378px;
  height: auto;
  opacity: 1;
  border-radius: 15px;
  backdrop-filter: opacity(0.3);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid #4c4b4b14;
  box-shadow: 12px 12px 25px #1a1b1c73;
  background: #ffffff10;
  ${({ theme }) => theme.mediaWidth.upToSmall`
      width: auto;
      margin: 0px 10px;

      `};
`;
const VS = styled.p`
  color: ${({ theme }) => theme.gray2};
  font: normal normal 500 10px/12px Roboto;
`;
const StyledTextHead = styled(Typography)`
  &&& {
    font-weight: bold;
    font-size: 14px;
    margin: 17px auto;
  }
`;
const Country = styled.p`
  color: ${({ theme }) => theme.white};
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
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
const StyledQuestion = styled.p`
  &&& {
    font-weight: 500;
    font-size: 16px;
    margin: 20px;
  }
`;
const StyledStack = styled.div`
  &&& {
    display: grid;
    justify-content: center;
  }
`;
const StyledBullBear = styled(Typography)`
  &&& {
    font-weight: bold;
    font-size: 20px;
    margin: 20px;
    color: #ff3f86;
  }
`;

const StyledQuestionDiv = styled.div`
  &&& {
    width: auto;
    height: auto;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 16px;
    margin: 16px;
    padding-bottom: 20px;
    -webkit-backdrop-filter: blur(30px);
    backdrop-filter: blur(30px);
    -webkit-backdrop-filter: blur(30px);
    border: 1px solid #4c4b4b14;
    box-shadow: 12px 12px 25px #1a1b1c73;

    ${({ theme }) => theme.mediaWidth.upToSmall`
    &&&{
      width: auto;
      height: auto;
    }
    `};
  }
`;

const StyledText = styled(Typography)`
  &&& {
    font-size: 12px;
    margin: 10px;
    color: #ffa958;
  }
`;
const StyledText3 = styled(Typography)`
  &&& {
    font-size: 12px;
    margin: 10px 22px;
    color: #c4c4c4;
  }
`;
const StyledText2 = styled(Typography)`
  &&& {
    display: flex;
    font-size: 14px;
    margin: 18px 22px;
    color: #ffa958;
  }
`;
const Span = styled(Typography)`
  &&& {
    font-size: 14px;
    color: white;
    font-weight: 600;
  }
`;
const Box = styled.div`
  &&& {
    margin-left: 20px;
    margin-right: 20px;
  }
`;
const StyledButton = styled(Button)`
  &&& {
    color: white;
    height: 48px;
    border-radius: 8px;
    width: -webkit-fill-available;
    margin: 0px 20px;
    background-color: #3674dd;
  }
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
const StyledTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#00A576",
  },
  "& label": {
    color: "#76767D",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#00A576",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#00A576",
    },
    "&:hover fieldset": {
      borderColor: "#00A576",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#00A576",
    },
    "&.MuiFormLabel-root": {
      color: "#76767D",
    },
  },
});


const StyledCloseButton = styled(CancelIcon)`
  &&& {
    color: #7b7d85;
    font-size: 24px;
    position: absolute;
    top: 1.5%;
    left: 92%;
    :hover {
      color: white;
    }
  }
`;
const StyledInputField = styled(StyledTextField)`
  width: -webkit-fill-available;
  input {
    color: white !important;
  }
  background: linear-gradient(
    0deg,
    rgba(116, 116, 128, 0.3),
    rgba(116, 116, 128, 0.3)
  );
  border-radius: 10px;
`;
interface Props {
  close: () => void;
  input: string;
  question: QuestionData;
  setInput: (x: string) => void;
  action: () => void;
  option: string;
}

function InputBox({ input, question, setInput, action, option, close }: Props) {
  const [userBalance] = useUserBalance();
  const [teamLogos] = useTeamLogos();
  const re = /^\d*\.?\d*$/;

  const handleChange = (event: any) => {
    if (re.test(event.target.value)) {
      setInput(event.target.value);
    }
  };

  return (
    <Wrapper>
      <StyledStack>
        <StyledTextHead> Set Position</StyledTextHead>
        <StyledHead>{question.tournament}</StyledHead>
        {/* <StyledBullBear>{option}</StyledBullBear> */}
      </StyledStack>
      <StyledCloseButton onClick={close} />

      {question.team_b !== "" ? (
        <>
          <MuiBox
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
              marginTop: "10px",
            }}
          >
            <MuiBox
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <ImageBox>
                <Image
                  src={
                    teamLogos && teamLogos[question.team_a_code?.toUpperCase()]
                  }
                />
              </ImageBox>
              <Country>{question.team_a_code}</Country>
            </MuiBox>
            <MuiBox
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <VS>VS</VS>
            </MuiBox>
            <MuiBox
              sx={{
                display: "flex",
                flexDirection: "row-reverse",
                alignItems: "center",
              }}
            >
              <ImageBox>
                <Image src={teamLogos && teamLogos[question.team_b_code]} />
              </ImageBox>
              <Country>{question.team_b_code}</Country>
            </MuiBox>
          </MuiBox>
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
        </>
      ) : (
        <>
          <MuiBox
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
                src={
                  teamLogos && teamLogos[question.team_a_code?.toUpperCase()]
                }
                style={{ width: "50px" }}
              />
            </ImageBox>
            <Country>{question.team_a_code}</Country>
          </MuiBox>
        </>
      )}
      <StyledQuestionDiv>
        <StyledQuestion>{question.question}</StyledQuestion>
        <StyledText2>
          Your Prediction: <Span> &nbsp; {option} </Span>
        </StyledText2>
        <StyledText3 color="#C4C4C4">
          Available to bid: {getFlooredFixed(userBalance, 4)} Astro Test Token
        </StyledText3>
        <Box>
          <StyledInputField
            label="Input Your Bid"
            type="number"
            id="custom-css-outlined-input"
            onChange={handleChange}
          />
        </Box>
      </StyledQuestionDiv>
      <StyledButton fullWidth variant="contained" onClick={action}>
        Place Bid
      </StyledButton>
    </Wrapper>
  );
}
export default InputBox;
