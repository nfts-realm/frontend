import { NFTStorage } from "nft.storage";
import { NFTStorageKey } from "config/constants";

export const getNftStorageClient = () => {
  return new NFTStorage({ token: NFTStorageKey });
};
