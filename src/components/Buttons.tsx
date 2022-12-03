import React from "react";
import Stack from "@mui/material/Stack";
import styled from "styled-components";
import Button from "@mui/material/Button";
import { useHistory, useLocation } from "react-router";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useCurrentPage, useGasLessToggle } from "../state/questions/hooks";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ButtonDiv = styled.div`
  &&& {
    display: flex;
    justify-content: space-between;
    margin: 28px auto 48px auto;
    width: 85%;
    ${({ theme }) => theme.mediaWidth.upToSmall`
      display: none;
  `};
  }
`;

const MobileButtonDiv = styled.div`
  &&& {
    display: none;
    ${({ theme }) => theme.mediaWidth.upToSmall`
      display: flex;
      justify-content: space-between;
      margin: 28px auto;
      width: 90%;`};
  }
`;
const BackgroundDiv = styled.div`
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  padding: 8px;
  width: fit-content;
  height: 51px;
`;
const OutLinedButtonBack = styled(Button)`
  &&& {
    margin: 28px 120px;
    color: white;
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    height: 51px;
    border: 1px solid #189AB4;
    box-sizing: border-box;
    border-radius: 8px;
    text-transform: none;
    padding: 16px;
    :hover {
      background: #189AB4;
    }
    ${({ theme }) => theme.mediaWidth.upToSmall`
      margin: 28px 30px;
  `};
  }
`;
const OutLinedButton = styled(Button)<{
  active?: boolean;
}>`
  &&& {
    width: auto;
    color: white;
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 19px;
    height: 48px;
    border: 1px solid #189AB4;
    box-sizing: border-box;
    border-radius: 8px;
    text-transform: none;
    padding: 16px;
    & > .type {
      color: ${({ active, theme }) => (active ? theme.green1 : theme.red1)};
      font-weight: bold;
    }
    :hover {
      background: #189AB4;
    }
  }
`;
const OutLinedButtonMobile = styled(Button)<{
  active?: boolean;
}>`
    &&& {
      color: white;
      padding: 8px
      font-family: Inter;
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      line-height: 19px;
      height: 40px;
      border: 1px solid #189AB4;
      box-sizing: border-box;
      border-radius: 8px;
      text-transform: none;
      & > .type {
        color: ${({ active, theme }) => (active ? theme.green1 : theme.red1)};
        font-weight: bold;
      }
      // padding: 4px 8px;
      // margin-top: 8px;
      :hover {
        background: #189AB4;
      }
    }
  `;
const RightButtonsDiv = styled.div`
  width: fit-content;
  height: 51px;
`;
const StyledStack = styled(Stack)`
  height: 36px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    &&&{
      display: flex;
      justify-content: center;
      padding: 15px 0px;
      
    }
  `}
`;
const FormControlDiv = styled(FormControl)`
  &&& {
    color: #f2f2f2;
  }
`;
const MenuItemDiv = styled(MenuItem)`
  &&& {
    font-family: Inter;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    color: #189AB4;
  }
`;
const SelectDiv = styled(Select)`
  &&& {
    height: 40px;
    width: 128px;
    background: #189AB4;
    border-radius: 4px;

    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    color: #f2f2f2;
  }
`;
const StyledButton = styled(Button)<{ active: boolean }>`
  &&& {
    font-family: Inter;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 19px;
    height: 36px;
    color: #4f4f4f;
    border-radius: 4px;
    text-transform: none;
    background: ${({ active }) => (active ? "#189AB4" : "none")};
    color: ${({ active }) => (active ? "white" : "none")};
    padding: 16px;
    :hover {
      background: #189AB4;
    }
  }
`;
function Buttons() {
  const history = useHistory();
  const currentRoute = useLocation();
  const [gasMode, setGasMode] = useGasLessToggle();
  const [currentPage, setCurrentPage] = useCurrentPage();

  const handleChange = (event: any) => {
    setCurrentPage(event.target.value as string);
  };
  return (
    <Wrapper>
      {currentRoute.pathname.includes("/prediction-markets/my-positions") ? (
        <>
          <ButtonDiv>
            <OutLinedButton
              onClick={() => history?.push("/prediction-markets/general")}
              variant="outlined"
            >
              <ArrowBackIcon sx={{ marginRight: "4px" }} fontSize="small" />
              {"Back"}
            </OutLinedButton>

            <RightButtonsDiv>
              <StyledStack direction="row" spacing={3}>
                {/* <OutLinedButton
                  variant="outlined"
                  startIcon={<LocalGasStationIcon />}
                  onClick={() => setGasMode(!gasMode)}
                  active={gasMode}
                >
                  Gasless Mode:&nbsp;
                  <span className="type">{gasMode ? "ON" : "OFF"}</span>
                </OutLinedButton> */}
              </StyledStack>
            </RightButtonsDiv>
          </ButtonDiv>
          <MobileButtonDiv>
            <OutLinedButtonMobile
              onClick={() => history?.push("/prediction-markets/general")}
              variant="outlined"
            >
              <ArrowBackIcon sx={{ marginRight: "4px" }} fontSize="small" />
              {"Back"}
            </OutLinedButtonMobile>
            <OutLinedButtonMobile
              variant="outlined"
              startIcon={<LocalGasStationIcon />}
              onClick={() => setGasMode(!gasMode)}
              active={gasMode}
            >
              {<span className="type">{gasMode ? " ON" : " OFF"}</span>}
            </OutLinedButtonMobile>
          </MobileButtonDiv>
        </>
      ) : (
        <>
          <ButtonDiv>
            <BackgroundDiv>
              <StyledStack direction="row" spacing={1}>
                {/* <StyledButton
                  onClick={() => history?.push("/prediction-markets/cricket")}
                  active={currentRoute.pathname.includes(
                    "/prediction-markets/cricket"
                  )}
                  variant="text"
                >
                  {" "}
                  Cricket
                </StyledButton> */}
                <StyledButton
                  onClick={() => history?.push("/prediction-markets/football")}
                  active={currentRoute.pathname.includes(
                    "/prediction-markets/football"
                  )}
                  variant="text"
                >
                  {" "}
                  Football
                </StyledButton>
                <StyledButton
                  onClick={() => history?.push("/prediction-markets/crypto")}
                  active={currentRoute.pathname.includes(
                    "/prediction-markets/crypto"
                  )}
                  variant="text"
                >
                  {" "}
                  Crypto
                </StyledButton>
                {/* <StyledButton
                  onClick={() => history?.push("/prediction-markets/general")}
                  active={currentRoute.pathname.includes(
                    "/prediction-markets/general"
                  )}
                  variant="text"
                >
                  {" "}
                  General
                </StyledButton> */}
              </StyledStack>
            </BackgroundDiv>
            <RightButtonsDiv>
              <StyledStack direction="row" spacing={3}>
                {/* <OutLinedButton
                  variant="outlined"
                  startIcon={<LocalGasStationIcon />}
                  onClick={() => setGasMode(!gasMode)}
                  active={gasMode}
                >
                  Gasless Mode:&nbsp;
                  <span className="type">{gasMode ? "ON" : "OFF"}</span>
                </OutLinedButton> */}

                <OutLinedButton
                  onClick={() =>
                    history?.push("/prediction-markets/my-positions")
                  }
                  variant="outlined"
                >
                  My Positions
                </OutLinedButton>
              </StyledStack>
            </RightButtonsDiv>
          </ButtonDiv>
          <MobileButtonDiv>
            <Box sx={{ minWidth: 120 }}>
              <FormControlDiv sx={{ m: 0, minWidth: 120 }}>
                <SelectDiv
                  value={currentPage}
                  onChange={(e) => handleChange(e)}
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItemDiv
                    value={10}
                    onClick={() => {
                      history?.push("/prediction-markets/cricket");
                      setCurrentPage("Cricket");
                    }}
                  >
                    Cricket
                  </MenuItemDiv>
                  <MenuItemDiv
                    value={20}
                    onClick={() => {
                      history?.push("/prediction-markets/football");
                      setCurrentPage("Football");
                    }}
                  >
                    Football
                  </MenuItemDiv>
                  <MenuItemDiv
                    value={30}
                    onClick={() => {
                      history?.push("/prediction-markets/crypto");
                      setCurrentPage("Crypto");
                    }}
                  >
                    Crypto
                  </MenuItemDiv>
                  <MenuItemDiv
                    value={40}
                    onClick={() => {
                      history?.push("/prediction-markets/general");
                      setCurrentPage("General");
                    }}
                  >
                    General
                  </MenuItemDiv>
                </SelectDiv>
              </FormControlDiv>
            </Box>
            <OutLinedButtonMobile
              variant="outlined"
              startIcon={<LocalGasStationIcon />}
              onClick={() => setGasMode(!gasMode)}
              active={gasMode}
            >
              {<span className="type">{gasMode ? " ON" : " OFF"}</span>}
            </OutLinedButtonMobile>
            <OutLinedButtonMobile
              onClick={() => history?.push("/prediction-markets/my-positions")}
              variant="outlined"
            >
              My Positions
            </OutLinedButtonMobile>
          </MobileButtonDiv>
        </>
      )}
    </Wrapper>
  );
}

export default Buttons;
