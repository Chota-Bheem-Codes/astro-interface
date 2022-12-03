import styled from "styled-components";
import { walletList } from "../../config/ProviderConfig";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
const Wrapper = styled.div`
  width: 38rem;
  color: ${({ theme }) => theme.text1};
  opacity: 1;
  border-radius: 15px;
  backdrop-filter: opacity(0.3);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid #4c4b4b14;
  box-shadow: 12px 12px 25px #1a1b1c73;
  background: #ffffff15;
  grid-template-rows: auto auto;
  ${({ theme }) => theme.mediaWidth.upToSmall`
        max-width: 25rem;
		width: 80vw;
	    height: 90vh;
        display: flex;
        flex-direction: column;
  	`};
`;
const WalletsWrapper = styled.div`
  display: grid;
  place-items: center;
  grid-template-columns: auto auto;
  overflow: hidden;
  z-index: 4;
  width: 100%;
  height: 90%;
  overflow-y: scroll;
  padding: 5px 30px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
        max-width: 25rem;
		width: 80vw;
	    height: 80vh;
        display: flex;
        flex-direction: column;
        overflow-y: scroll;
  	`};
`;

const Logo = styled.img`
  height: 40px;
  width: 40px;
  transition: all 0.2s ease-in-out;
  ${({ theme }) => theme.mediaWidth.upToSmall`
		height: 25px;
  width: 25px;
  	`};
`;

const WalletWrapper = styled.div`
  width: 11rem;
  height: 6rem;
  // background: ${({ theme }) => theme.bg1}80;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 10px 25px;
  border-radius: 10px;
  cursor: pointer;
  display: grid;
  place-items: center;
  margin: 10px 0;
  margin-bottom: 30px;
  &:hover ${Logo} {
    transform: scale(1.1);
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
		margin-bottom: 30px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  `};
`;

const WalletName = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const Title = styled.div`
  font-size: 20px;
  grid-column: span 2;
  font-weight: 500;
  text-align: center;
  margin-top: 20px;
`;
const StyledCloseIcon = styled(CloseRoundedIcon)`
  position: absolute;
  color: white;
  right: 15px;
  top: 15px;
  width: 1.7rem !important;
  height: 1.7rem !important;
  cursor: pointer;
`;

const Web3Link = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-bottom: 20px;
  padding: 0 20px;
  text-align: center;
  text-decoration: underline;
  color: #4390F8;
`

interface Props {
  action: (walletId: string) => Promise<void>;
  close: () => void;
}

const WalletModal = ({ action, close }: Props) => {
  return (
    <Wrapper>
      <StyledCloseIcon onClick={close} />
      <Title>Connect To</Title>
      <WalletsWrapper>
        {walletList.map((wallet, index) => (
          <WalletWrapper key={index} onClick={() => action(wallet.id)}>
            <Logo src={wallet.logo} />
            <WalletName>{wallet.name}</WalletName>
          </WalletWrapper>
        ))}
      </WalletsWrapper>
    </Wrapper>
  );
};

export default WalletModal;
