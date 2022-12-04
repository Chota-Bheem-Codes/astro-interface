import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import walletReducer from "./wallet/slice";
import questionReducer from "./questions/slice";
import nftReducer from "./nft/slice";
import selectNetworkReducer from "./network/slice";

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    questions: questionReducer,
    nft: nftReducer,
    selectNetwork: selectNetworkReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
