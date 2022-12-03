import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../";
import { networkList } from "../../config/Constants";

export interface NetworkType {
  name: string;
  networkId: string;
  rpc: string;
  explorer: string;
  logo: string;
  id: number;
  baseUrl: string;
  graphEndpoint: string;
  gameToken: {
    address: string;
    name: string;
    symbol: string;
    decimals: string;
  };
}

interface NetworkState {
  network: NetworkType;
}

const initialState: NetworkState = {
  network: networkList[0],
};

export const selectNetworkSlice = createSlice({
  name: "selectNetwork",
  initialState,
  reducers: {
    selectNetwork: (state, action: PayloadAction<NetworkType>) => {
      state.network = action.payload;
    },
  },
});

export const { selectNetwork } = selectNetworkSlice.actions;

export const network = (state: RootState) => state.selectNetwork.network;

export default selectNetworkSlice.reducer;
