import * as actionTypes from "store/constants";

export function setMarketplaceFeeForFantom(payload) {
  return {
    type: actionTypes.SET_MARKETPLACE_FEE_FOR_FANTOM,
    payload: payload,
  };
}

export function setMarketplaceFeeForToken(payload) {
  return {
    type: actionTypes.SET_MARKETPLACE_FEE_FOR_TOKEN,
    payload: payload,
  };
}
