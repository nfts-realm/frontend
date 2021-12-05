import { ethers } from "ethers";
import { getRealmNftAddress, getMarketplaceAddress, getPayTokenAddress } from "utils/addressHelpers";
import MarketplaceAbi from "config/abi/marketplace.json";
import NftsRealmAbi from "config/abi/realmNft.json";
import Erc20Abi from "config/abi/erc20.json";
import { DEFAULT_NETWORK } from "config/constants";
import {
  BSC_TESTNET_PARAMS,
  BSC_MAINNET_PARAMS,
  FTM_TESTNET_PARAMS,
  FTM_MAINNET_PARAMS,
} from "config/constants/network";

export const getNetworkParams = (networkId) => {
  // bsc network
  if (networkId === 97) return BSC_TESTNET_PARAMS;
  if (networkId === 56) return BSC_MAINNET_PARAMS;

  // ftm network
  if (networkId === 4002) return FTM_TESTNET_PARAMS;
  if (networkId === 250) return FTM_MAINNET_PARAMS;

  return BSC_TESTNET_PARAMS;
};

export const getContract = (address, abi, signer) => {
  if (signer) {
    return new ethers.Contract(address, abi, signer);
  }
  const jsonRpcProvider = new ethers.providers.JsonRpcProvider(DEFAULT_NETWORK.jsonRpcProviderUrl);
  return new ethers.Contract(address, abi, jsonRpcProvider);
};

export const getNftContract = (signer) => {
  return getContract(getRealmNftAddress(), NftsRealmAbi, signer);
};

export const getMarketplaceContract = (signer) => {
  return getContract(getMarketplaceAddress(), MarketplaceAbi, signer);
};

export const getErc20TokenContract = (signer) => {
  return getContract(getMarketplaceAddress(), Erc20Abi, signer);
};

export const getPayTokenContract = (name, signer) => {
  return getContract(getPayTokenAddress(name), Erc20Abi, signer);
};
