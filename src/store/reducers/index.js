import { combineReducers } from "redux";
import { web3Reducer } from "./web3";
import { userReducer } from "./user";
import { priceReducer } from "./price";
import { nftReducer } from "./nft";
import { marketplaceReducer } from "./marketplace";

const rootReducer = combineReducers({
  web3: web3Reducer,
  user: userReducer,
  price: priceReducer,
  nfts: nftReducer,
  marketplace: marketplaceReducer,
});

export default rootReducer;
