import {
  KeyValueType,
  MatchData,
  QuestionBetData,
  QuestionData,
  QuestionMapping,
  UserBet,
} from "../state/questions/slice";
import { epochConverter, getEpoch } from "../utils/getEpoch";

const BASE_URL =
  "https://raw.githubusercontent.com/Chota-Bheem-Codes/astro-game-data/main";
const MATCH_DATA = `${BASE_URL}/match-data-final/match-n-questions.json`;
const GENERAL_DATA = `${BASE_URL}/match-data-final/general-n-questions.json`;

const GRAPH_ENDPOINT =
  "https://api.thegraph.com/subgraphs/name/chota-bheem-codes/prediction-market";
export const getQuestionDataGraph = async (GRAPH_ENDPOINT: string) => {
  try {
    const res = await fetch(GRAPH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        {
          questions(first:1000){
           id
           ABetAmount
           BBetAmount
           totalAmount
           }
        }
        `,
      }),
    });
    const data = await res.json();
    const result: QuestionBetData[] = data.data.questions;
    return result;
  } catch (e) {
    console.log("Error - ", e);
  }
};

export const getMyBetDataGraph = async (
  GRAPH_ENDPOINT: string,
  userAddress: string
) => {
  try {
    console.log(userAddress);
    const res = await fetch(GRAPH_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        {
          user(id:"${userAddress.toLowerCase()}"){
            bets(first:1000){
               question{
                id
                position
                ended
                ABetAmount
                BBetAmount
                totalAmount
              }
              position
              amount
              claimed
            }
          }
        }
        `,
      }),
    });
    const data = await res.json();
    const result: UserBet[] = data.data.user.bets;
    return result;
  } catch (e) {
    console.log("Error - ", e);
  }
};

const questionUrl: { [key: string]: string } = {
  cricket: MATCH_DATA,
  general: GENERAL_DATA,
};

export const getQuestionData = async (code: string, BASE_URL: string) => {
  try {
    let url = "";
    const CRYPTO_DATA = `${BASE_URL}/match-data-final/crypto-n-questions.json`;
    const FOOTBALL_DATA = `${BASE_URL}/match-data-final/football-n-questions.json`;

    if (code === "football") {
      url = FOOTBALL_DATA;
    }
    if (code === "crypto") {
      url = CRYPTO_DATA;
    }

    const res = await fetch(url);
    const data: MatchData[] = await res.json();
    return data;
  } catch (e) {
    console.log("Question Fetch Error - ", e);
  }
};

export const getTheContractAddresses = async (BASE_URL: string) => {
  const CONTRACT_ADDRESSES = `${BASE_URL}/match-data-final/questions-contracts-address.json`;
  try {
    const res = await fetch(CONTRACT_ADDRESSES);
    const data: KeyValueType = await res.json();
    return data;
  } catch (e) {
    console.log("Question Address Fetch Error - ", e);
  }
};

export const getTeamLogos = async (BASE_URL: string) => {
  const TEAM_LOGOS = `${BASE_URL}/match-data-final/team-logo.json`;
  try {
    const res = await fetch(TEAM_LOGOS);
    const data: KeyValueType = await res.json();
    return data;
  } catch (e) {
    console.log("Team-Logos Fetch Error - ", e);
  }
};

export const getQuestionMappingData = async (BASE_URL: string) => {
  const QUESTION_DATA = `${BASE_URL}/match-data-final/id-question-map.json`;
  try {
    const res = await fetch(QUESTION_DATA);
    const data: QuestionMapping = await res.json();
    return data;
  } catch (e) {
    console.log("Question ID key valye pair - ", e);
  }
};
export interface QuestionDataWithAmount extends QuestionData {
  totalAmount: string;
}

export const getQuestionWithHightestTVL = async (
  GRAPH_ENDPOINT: string,
  BASE_URL: string
) => {
  const items = await getQuestionDataGraph(GRAPH_ENDPOINT);

  const questionMapData = await getQuestionMappingData(BASE_URL);
  const sortedItems_ =
    items
      ?.sort((a, b) => {
        if (parseFloat(a.totalAmount) < parseFloat(b.totalAmount)) {
          return 1;
        }
        if (parseFloat(a.totalAmount) > parseFloat(b.totalAmount)) {
          return -1;
        }
        return 0;
      })
      .filter((item) => parseFloat(item.totalAmount) > 20) ?? [];

  const topThree = [];
  const topTypes: string[] = [];
  for (let i = 0; i < sortedItems_.length; i++) {
    if (
      questionMapData &&
      !(
        getEpoch(questionMapData[sortedItems_[i].id].bid_end_time) <
        epochConverter(new Date().toUTCString())
      )
    ) {
      // topThree.push({...questionMapData[(sortedItems_[i].id)],totalAmount: sortedItems_[i].totalAmount})
      if (!topTypes.includes(questionMapData[sortedItems_[i].id].category)) {
        topThree.push({
          ...questionMapData[sortedItems_[i].id],
          totalAmount: sortedItems_[i].totalAmount,
        });
        topTypes.push(questionMapData[sortedItems_[i].id].category);
      }
    }
    if (topThree.length >= 3) {
      break;
    }
  }
  for (let i = 0; i < sortedItems_.length; i++) {
    if (topThree.length >= 3) {
      break;
    }
    if (
      questionMapData &&
      !(
        getEpoch(questionMapData[sortedItems_[i].id].bid_end_time) <
        epochConverter(new Date().toUTCString())
      )
    ) {
      // topThree.push({...questionMapData[(sortedItems_[i].id)],totalAmount: sortedItems_[i].totalAmount})
      if (
        !topThree
          .map((item) => item.question_id)
          .includes(questionMapData[sortedItems_[i].id].question_id)
      ) {
        topThree.push({
          ...questionMapData[sortedItems_[i].id],
          totalAmount: sortedItems_[i].totalAmount,
        });
      }
    }
  }

  return (
    topThree?.sort((a, b) => {
      if (parseFloat(a.totalAmount) < parseFloat(b.totalAmount)) {
        return 1;
      }
      if (parseFloat(a.totalAmount) > parseFloat(b.totalAmount)) {
        return -1;
      }
      return 0;
    }) ?? []
  );
};
