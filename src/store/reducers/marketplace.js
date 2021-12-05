import * as actionTypes from "store/constants";

const initialUserData = {
  marketFeeForFantom: 0,
  marketFeeForToken: 0,
};

export function marketplaceReducer(state = initialUserData, action) {
  switch (action.type) {
    case actionTypes.SET_MARKETPLACE_FEE_FOR_FANTOM:
      return {
        ...state,
        marketFeeForFantom: action.payload,
      };
    case actionTypes.SET_MARKETPLACE_FEE_FOR_TOKEN:
      return {
        ...state,
        marketFeeForToken: action.payload,
      };
    default:
      return state;
  }
}
