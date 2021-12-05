import addresses from "config/constants/address";
import { DEFAULT_NETWORK } from "config/constants";

export const getAddress = (address) => {
  const chainId = process.env.REACT_APP_CHAIN_ID;
  return address[chainId] ? address[chainId] : address[DEFAULT_NETWORK.chainId];
};

export const getRealmNftAddress = () => {
  return getAddress(addresses.realmNft);
};
export const getMarketplaceAddress = () => {
  return getAddress(addresses.marketplace);
};
export const getDmdTokenAddress = () => {
  return getAddress(addresses.dmd);
};

export const getPayTokenAddress = (name) => {
  if (name.toLowerCase() === "dmd") return getDmdTokenAddress();
  return getDmdTokenAddress();
};
