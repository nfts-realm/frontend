import * as actionTypes from "store/constants";

const initialPrice = {
  bnb: 0,
  ftm: 0,
};

export function priceReducer(state = initialPrice, action) {
  switch (action.type) {
    case actionTypes.UPDATE_TOKEN_PRICE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
