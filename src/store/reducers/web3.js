import * as actionTypes from "store/constants";
import { DEFAULT_NETWORK } from "config/constants";

const initialState = {
  web3: null,
  chainId: DEFAULT_NETWORK.chainId,
  userAccount: null,
  tokenBalance: 0,
  bnbBalance: 0,
};

export function web3Reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.SET_WEB3_DATA:
      return {
        ...state,
        ...action.payload,
      };
    case actionTypes.UPDATE_CHAIN_ID:
      return {
        ...state,
        chainId: action.payload,
      };
    case actionTypes.UPDATE_WEB3_USER_ADDRESS:
      return {
        ...state,
        userAccount: action.payload,
      };
    default:
      return state;
  }
}
