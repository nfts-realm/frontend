import * as actionTypes from "store/constants";

const initialNfts = {
  items: [],
  selected: null,
};

export function nftReducer(state = initialNfts, action) {
  switch (action.type) {
    case actionTypes.NFT_SET_SELECTED:
      return {
        ...state,
        selected: action.payload,
      };
    case actionTypes.NFT_SET_ITEMS:
      return {
        ...state,
        items: action.payload,
      };
    default:
      return state;
  }
}
