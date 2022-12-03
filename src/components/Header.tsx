import React, { useState } from "react";
import Astro from "../assets/astro-removebg.png";
import styled from "styled-components";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Wallet from "../components/Wallet";
import { useHistory, NavLink, useLocation } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { MEDIA_WIDTHS } from "../theme";
import MenuIcon from "@mui/icons-material/Menu";
import { Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ToggleButton from "@mui/material/ToggleButton";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SecurityIcon from "@mui/icons-material/Security";
import NetworkSwitch from "./NetworkSwitch";

const Wrapper = styled.div`
  z-index: 9998 !important;
  position: relative;
  width: 100%;
`;
const StyledNavbar = styled(AppBar)`
  &&& {
    background: none;
    padding: 15px 94px;
    ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 10px 5px;
      `};
  }
`;
const MainLogo = styled.img`
  width: 145px;
  cursor: pointer;

  ${({ theme }) => theme.mediaWidth.upToLarge`
      visibility: visible;
      margin: 10px;
      `};
  ${({ theme }) => theme.mediaWidth.upToSmall`
      width: 95px;
      margin: 10px;

      `};
  transition: all 0.2s ease-in-out;
`;
const StyledStack = styled(Stack)`
  &&& {
    margin-left: auto;
  }
`;
const Menu = styled.div`
  position: relative;
  ${({ theme }) => theme.mediaWidth.upToSmall`
  display: none;
`};
`;
const StyledListItemText = styled(ListItemText)`
  &&& {
    font-weight: bold;
  }
`;
const StyledListSubheader = styled(ListSubheader)`
  &&& {
    background: #189AB4;
    color: white;
    line-height: 13px;
    border-radius: 15px 15px 0px 0px;
    font-size: 12px;
    font-weight: bold;
    padding: 8px;
    margin-top: -2px;
    width: -webkit-fill-available;
    position: static;
  }
`;
const StyledListItemButton = styled(ListItemButton)`
  &&& {
    :hover {
      color: #189AB4;
    }
  }
`;
const StyledListItemIcon = styled(ListItemIcon)`
  &&& {
    min-width: 40px;
    color: white;
    :hover {
      color: #189AB4;
    }
    ${({ theme }) => theme.mediaWidth.upToSmall`
  display: none;
`};
  }
`;
const StyledDropdown = styled.div`
  &&& {
    position: absolute;
    top: 120%;
    right: 10%;
    transform: translate(0px, 0px);
    width: max-content;
    border-radius: 15px;
    backdrop-filter: opacity(0.5);
    -webkit-backdrop-filter: blur(30px);
    border: 1px solid #4c4b4b14;
    box-shadow: 12px 12px 25px #1a1b1c73;
    background: rgb(0 0 0 / 70%);
    color: white;
    z-index: 1;
  }
`;
const StyledMenuButton = styled(ToggleButton)`
  &&& {
    height: 40px;
    border-radius: 15px;
    border: 2px solid #189AB4;
    text-transform: none;
    color: white;
    :hover {
      background-color: #189AB4;
      border: #189AB4;
      color: white;
    }
  }
`;
const StyledStack2 = styled(Stack)`
  &&& {
    margin-left: 30px;
    ${({ theme }) => theme.mediaWidth.upToSmall`
      display: none;
    `};
  }
`;
const StyledGreyLine = styled.div`
  mix-blend-mode: normal;
  border: 1px solid #189AB4;
  width: 100%;
  color: #189AB4;
`;

const StyledButton = styled(Button)`
  &&& {
    height: 40px;
    border-radius: 25px;
    border: 2px solid #fa005d;
    text-transform: none;
    color: #fa005d;
    :hover {
      background-color: #fa005d;
      border: #fa005d;
      color: white;
    }
    ${({ theme }) => theme.mediaWidth.upToSmall`
        display: none;
      `};
  }
`;
const StyledButton2 = styled(NavLink)<{ active: boolean }>`
  &&& {
    font-family: Inter;
    font-style: normal;
    font-weight: 300;
    font-size: 16px;
    line-height: 15px;
    text-decoration: none;
    text-align: center;
    color: ${({ active }) => (active ? "#189AB4" : "white")};
    :hover {
      color: #189AB4;
    }
  }
`;
const StyledButton3 = styled(StyledButton2)`
  &&& {
    font-size: 15px;
  }
`;
const StyledMenuIcon = styled(MenuIcon)`
  &&& {
    display: none;
    color: white;
    cursor: pointer;
    margin: 10px 5px 10px 0px;
    :hover {
      color: #189AB4;
    }
    ${({ theme }) => theme.mediaWidth.upToSmall`
      display: inline-block;
  `};
  }
`;
const StyledDrawer = styled(Drawer)`
  display: none;
  z-index: 9999 !important;
  position: relative;
  ${({ theme }) => theme.mediaWidth.upToSmall`
		display: inline-block;
  	`};
`;

const StyledCancelIcon = styled(CloseIcon)`
  display: none;
  color: white;
  position: absolute;
  right: 10px;
  top: 10px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
		display: inline-block;
  	`};
`;
const NavigationLinks = styled.div`
  display: grid;
  row-gap: 50px;
  margin-left: 20px;
  margin-top: 40px;
`;

const SideMenuWrapper = styled.div`
  background: linear-gradient(90deg, #170B3B 0%, #0E050F 100%);
  width: 80vw;
  height: 100vh;
`;
const Icons = styled.div`
  &&& {
    display: flex;
    margin: auto;
  }
`;

function Header() {
  const history = useHistory();
  const currentRoute = useLocation();
  const upToSmall = useMediaQuery(`(max-width: ${MEDIA_WIDTHS.upToSmall}px)`);

  const [openMenu, setOpenMenu] = useState(false);
  const [infoDropdown, setInfoDropdown] = useState(false);

  const HeadLogo = () =>
    upToSmall ? (
      <MainLogo src={Astro} onClick={() => history?.push("/")} />
    ) : (
      <MainLogo src={Astro} onClick={() => history?.push("/")} />
    );

  return (
    <Wrapper>
      <Box sx={{ flexGrow: 1 }}>
        <StyledNavbar position="static">
          <StyledDrawer
            anchor="left"
            open={openMenu}
            onClose={() => setOpenMenu(false)}
          >
            <SideMenuWrapper>
              <StyledCancelIcon onClick={() => setOpenMenu(false)} />
              <NavigationLinks>
                <StyledButton3
                  onClick={() => setOpenMenu(false)}
                  to="/home"
                  active={currentRoute.pathname.includes("/prediction-markets")}
                >
                  Home
                </StyledButton3>
                <StyledButton3
                  onClick={() => setOpenMenu(false)}
                  to="/prediction-markets/cricket"
                  active={currentRoute.pathname.includes("/prediction-markets")}
                >
                  Prediction Markets
                </StyledButton3>
                <StyledButton3
                  onClick={() => setOpenMenu(false)}
                  to="/nft"
                  active={currentRoute.pathname === "/nft"}
                >
                  NFT Prediction
                </StyledButton3>
              </NavigationLinks>
            </SideMenuWrapper>
          </StyledDrawer>
          <Toolbar>
            <StyledMenuIcon onClick={() => setOpenMenu((x) => !x)} />
            <HeadLogo />
            <StyledStack2 direction="row" spacing={2}>
              <StyledButton2
                to="/prediction-markets/cricket"
                active={currentRoute.pathname.includes("/prediction-markets")}
              >
                Prediction Markets
              </StyledButton2>
            </StyledStack2>
            <StyledStack direction="row" spacing={1}>
             
              <NetworkSwitch/>
              <Wallet />
             
            </StyledStack>
          </Toolbar>
        </StyledNavbar>
      </Box>

      <StyledGreyLine />
    </Wrapper>
  );
}

export default Header;
