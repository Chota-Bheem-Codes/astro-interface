import React from "react";
import styled from "styled-components";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Tick from "../../assets/vectors/tick.png";
// import ellipse from "../../assets/vectors/ellipse-55.png";
import { useHistory } from "react-router";
import { useExplorerLink } from "../../state/questions/hooks";
import TwitterIcon from "@mui/icons-material/Twitter";

interface Props {
  message: string;
  tweetUrl: string;
  close: () => void;
}

const Wrapper = styled.div`
  color: white;
  width: 378px;
  height: 390px;
  opacity: 1;
  background: linear-gradient(
    152.97deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  backdrop-filter: blur(42px);
  /* Note: backdrop-filter has minimal browser support */

  border-radius: 16px;
  display: grid;
  place-items: center;
  padding-top: 40px;
  padding-bottom: 12px;
  // background: #ffffff10;
  ${({ theme }) => theme.mediaWidth.upToSmall`
        max-width: 350px;
		width: 95vw;
  	`};
`;
const StyledCloseIcon = styled(CloseRoundedIcon)`
  position: absolute;
  color: white;
  right: 10px;
  top: 10px;
  width: 1.7rem !important;
  height: 1.7rem !important;
  cursor: pointer;
`;
const TransactionIcon = styled.img`
  &&& {
    width: 86px;
    height: 86px;
    display: grid;
    place-items: center;
  }
`;
const Heading = styled.div`
  margin-top: 35px;
  font-size: 24px;
  font-style: normal;
  font-weight: 300;
  line-height: 0px;
  letter-spacing: 0em;
  text-align: center;
  ${({ theme }) => theme.mediaWidth.upToSmall`
        font-size: 22px;
  	`};
`;

const Explorer = styled.div`
  font-style: normal;
  font-weight: 300;
  font-size: 14px;
  line-height: 2px;
  text-align: center;
  text-decoration-line: underline;
  color: #fa025d;
  cursor: pointer;
  ${({ theme }) => theme.mediaWidth.upToSmall`
        font-size: 14px;
  	`};
`;

const Add = styled.div`
  height: 30px;
  background: rgba(231, 65, 89, 0.2);
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  cursor: pointer;
  ${({ theme }) => theme.mediaWidth.upToSmall`
        font-size: 14px;
  	`};
`;

const CloseButton = styled.div`
  width: 300px;
  height: 55px;
  background: #fa025d;
  border-radius: 10px;
  font-style: normal;
  font-weight: 300;
  font-size: 22px;
  display: grid;
  place-items: center;
  cursor: pointer;
  ${({ theme }) => theme.mediaWidth.upToSmall`
        font-size: 20px;
        width: 95%;
        height: 50px;
  	`};
`;

const SwapState = styled.div`
  font-size: 16px;
  color: #ffffff99;
  font-style: normal;
  font-weight: 300;
  line-height: 27px;
  letter-spacing: 0em;
  text-align: left;
  ${({ theme }) => theme.mediaWidth.upToSmall`
        font-size: 16px;
  	`};
`;

const TwitterLink = styled.div`
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #3674dd;
  width: 268px;
  height: 48px;
  border-radius: 8px;
`;

const ConfirmationCard = ({ message, close, tweetUrl }: Props) => {
  const history = useHistory();
  const [explorerLink] = useExplorerLink();
  const openTransaction = () => {
    window.open(explorerLink);
  };

  return (
    <Wrapper>
      <StyledCloseIcon onClick={close} />
      <TransactionIcon src={Tick} />

      <Heading>Transaction Successful</Heading>

      {/* {tweetUrl && (
        <TwitterLink
          onClick={() =>
            window.open(
              tweetUrl,
              "_blank",
              "resizable=yes,top=300,left=500,width=600,height=400"
            )
          }
        >
          Share on &nbsp;
          <TwitterIcon />
        </TwitterLink>
      )} */}
      <SwapState>
        {message ? (
          message
        ) : (
          <Explorer
            onClick={() => {
              history?.push("/prediction-markets/my-positions");
              close();
            }}
          >
            My Bets{" "}
          </Explorer>
        )}
      </SwapState>
      {/* <Explorer onClick={openTransaction}>View on explorer</Explorer> */}

      {/* <CloseButton onClick={close}>Close</CloseButton> */}
    </Wrapper>
  );
};

export default ConfirmationCard;
