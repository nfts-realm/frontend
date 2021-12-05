import * as actionTypes from "store/constants";

export function setNftSelectedItem(payload) {
  return {
    type: actionTypes.NFT_SET_SELECTED,
    payload: payload,
  };
}

export function setNftItems(payload) {
  return {
    type: actionTypes.NFT_SET_ITEMS,
    payload: payload,
  };
}
