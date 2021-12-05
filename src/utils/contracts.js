import { Contract } from "@ethersproject/contracts";
import { getRealmNftAddress, getMarketplaceAddress } from "utils/addressHelpers";
import MarketplaceAbi from "config/abi/marketplace.json";
import NftsRealmAbi from "config/abi/realmNft.json";

export const getContract = (address, abi, signer) => {
  return new Contract(address, abi, signer);
};

export const getNftContract = (signer) => {
  return getContract(getRealmNftAddress(), NftsRealmAbi, signer);
};

export const getMarketplaceContract = (signer) => {
  return getContract(getMarketplaceAddress(), MarketplaceAbi, signer);
};
