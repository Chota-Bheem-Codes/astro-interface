import { useCallback } from "react";
import {
  useAppSelector as useSelector,
  useAppDispatch as useDispatch,
} from "../../hooks";
import { network, NetworkType, selectNetwork } from "./slice";

export function useNetworkManager(): [
  NetworkType,
  (newNetwork: NetworkType) => void
] {
  const currentNetwork = useSelector(network);
  const dispatch = useDispatch();

  const setCurrentNetwork = useCallback(
    (newNetwork: NetworkType) => dispatch(selectNetwork(newNetwork)),
    [currentNetwork, dispatch]
  );

  return [currentNetwork, setCurrentNetwork];
}
