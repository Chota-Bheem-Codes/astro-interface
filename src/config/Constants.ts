import { KeyValueType } from "../state/questions/slice";
import AUS from "../assets/images/nft/AUS.jpeg";
// import AUS_WINNER from "../assets/images/nft/AUS_WINNER.jpeg";
import BAN from "../assets/images/nft/BAN.jpeg";
import ENG from "../assets/images/nft/ENG.jpeg";
import IND from "../assets/images/nft/IND.jpeg";
// import IND_RUNNER_UP from "../assets/images/nft/IND_RUNNER_UP.png";
import NZ from "../assets/images/nft/NZ.jpeg";
import PAK from "../assets/images/nft/PAK.jpeg";
import SA from "../assets/images/nft/SA.jpeg";
import SL from "../assets/images/nft/SL.jpeg";
import WI from "../assets/images/nft/WI.jpeg";
import AFG from "../assets/images/nft/AFG.jpeg";
import NZ_RUNNER_UP from "../assets/images/nft/NZ_RUNNER_UP.png";
import AUS_WINNER from "../assets/images/nft/AUS_WINNER.png";

export const teamLogos: KeyValueType = {
  IND: "https://raw.githubusercontent.com/astro/prediction-market-data/main/team-images/IND.png",
  AFG: "https://raw.githubusercontent.com/astro/prediction-market-data/main/team-images/AFG.png",
  AUS: "https://raw.githubusercontent.com/astro/prediction-market-data/main/team-images/AUS.png",
  BDESH:
    "https://raw.githubusercontent.com/astro/prediction-market-data/main/team-images/BDESH.png",
  BAN: "https://raw.githubusercontent.com/astro/prediction-market-data/main/team-images/BDESH.png",
  ENG: "https://raw.githubusercontent.com/astro/prediction-market-data/main/team-images/ENG.png",
  IRE: "https://raw.githubusercontent.com/astro/prediction-market-data/main/team-images/IRE.png",
  NAM: "https://raw.githubusercontent.com/astro/prediction-market-data/main/team-images/NAM.png",
  NL: "https://raw.githubusercontent.com/astro/prediction-market-data/main/team-images/NL.png",
  NZ: "https://raw.githubusercontent.com/astro/prediction-market-data/main/team-images/NZ.png",
  OMN: "https://raw.githubusercontent.com/astro/prediction-market-data/main/team-images/OMN.png",
  PAK: "https://raw.githubusercontent.com/astro/prediction-market-data/main/team-images/PAK.png",
  PNG: "https://raw.githubusercontent.com/astro/prediction-market-data/main/team-images/PNG.png",
  SA: "https://raw.githubusercontent.com/astro/prediction-market-data/main/team-images/SA.png",
  SCO: "https://raw.githubusercontent.com/astro/prediction-market-data/main/team-images/SCO.png",
  SL: "https://raw.githubusercontent.com/astro/prediction-market-data/main/team-images/SL.png",
  WI: "https://raw.githubusercontent.com/astro/prediction-market-data/main/team-images/WI.png",
  NYKAA:
    "https://raw.githubusercontent.com/yoda-xyz/match-data/main/team-images/NYKAA.png",
};

export const teamNFT: KeyValueType = {
  AUS,
  BAN,
  ENG,
  IND,
  NZ,
  PAK,
  SA,
  SL,
  WI,
  AFG,
  NZ_RUNNER_UP,
  AUS_WINNER,
};

// export const maticTestnetUSDC = {
//   address: "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735",
//   name: "TEST Token",
//   symbol: "TEST",
//   decimals: 18,
// };
const maticTestnetNft = "0xaa5547bE113D914A37a68CBb47C5Df12874591f9";
const maticMainnetNft = "0x9DeE284C31ba5839870314a0F27F4c17eE6B2963";

const maticTestnetUSDC = {
  address: "0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735",
  name: "TEST Token",
  symbol: "TEST",
  decimals: 18,
};
// export const maticTestnetNft = "0xf44F27C464E766C07075838315004619E985fb27";

export const MINIMUM_BET_AMOUT = 0.1;
export const REWARD_RATE = 97;
export const TOTAL_RATE = 100;

const mainnetGameToken = {
  address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
  name: "USDC Token",
  symbol: "USDC",
  decimals: "6",
};

const testnetGameToken = {
  address: "0x2eEe3947c2747Aa6206B64064eb3AB1ddf0BC35b",
  name: "DFYN Test Token",
  symbol: "DFYN",
  decimals: "18",
};

export const networkTestnet = {
  networkId: "4",
  rpc: "https://rinkeby.infura.io/v3/16c3adc0500c486e8431ebfb82334fdf",
  explorer: "https://rinkeby.etherscan.io/tx/",
};
// export const networkTestnet = {
//   networkId: "80001",
//   rpc: "https://matic-mumbai.chainstacklabs.com",
//   explorer: "https://mumbai.polygonscan.com/tx/",
// };

const networkMainnet = {
  name: "M",
  networkId: "137",
  rpc: "https://liberty10.shardeum.org/",
  explorer: "https://explorer-liberty10.shardeum.org/tx/",
  id: 0,
  gameToken: {
    address: "0x2eEe3947c2747Aa6206B64064eb3AB1ddf0BC35b",
    name: "DFYN Test Token",
    symbol: "DFYN",
    decimals: "18",
  },
};

export const NETWORK_LIST_TESTNET = [
  {
    name: "Cronos Testnet",
    id: 0,
    networkId: "338",
    rpc: "https://evm-t3.cronos.org",
    explorer: "https://testnet.cronoscan.com/tx/",
    logo: "https://cryptologos.cc/logos/cronos-cro-logo.png?v=023",
    baseUrl:
      "https://raw.githubusercontent.com/Chota-Bheem-Codes/astro-game-data/main",
    graphEndpoint:
      "https://graph.cronoslabs.com/subgraphs/name/astro-prediction-markets/astro",
    gameToken: {
      address: "0xfF2e69aAd5b6a4903347aADcd70E632AF0015B8F",
      name: "Astro Test Token",
      symbol: "ASTRO",
      decimals: "18",
    },
  },
  {
    name: "Shardeum Liberty Testnet",
    networkId: "137",
    id: 1,
    rpc: "https://liberty10.shardeum.org/",
    explorer: "https://explorer-liberty10.shardeum.org/tx/",
    logo: "https://img.api.cryptorank.io/coins/150x150.shardeum1665056595732.png",
    baseUrl:
      "https://raw.githubusercontent.com/Chota-Bheem-Codes/astro-game-data/main",
    graphEndpoint:
      "https://graph.cronoslabs.com/subgraphs/name/astro-prediction-markets/astro",
    gameToken: {
      address: "0xfF2e69aAd5b6a4903347aADcd70E632AF0015B8F",
      name: "Astro Test Token",
      symbol: "ASTRO",
      decimals: "18",
    },
  },
];

export const networkList = NETWORK_LIST_TESTNET;

export const network = networkMainnet;
// export const network = networkTestnet;

// export const maticNft = maticTestnetNft;
export const maticNft = maticMainnetNft;

// export const gameToken = maticTestnetUSDC;
export const gameToken = mainnetGameToken;
