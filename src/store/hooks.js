import { useEffect } from "react";
import { BigNumber } from "@ethersproject/bignumber";
import { useWeb3React } from "@web3-react/core";
import { useSelector, useDispatch } from "react-redux";
import { getMarketplaceStorageContract } from "utils/web3";
import useInterval from "hooks/useInterval";
import { setMarketplaceFeeForFantom, setMarketplaceFeeForToken } from "store/actions";

const fetchMarketplacePublicData = async (dispatch) => {
  const mpStorageContract = getMarketplaceStorageContract();
  if (mpStorageContract) {
    try {
      const ftmFee = await mpStorageContract.marketFeeForFTM();
      dispatch(setMarketplaceFeeForFantom((100 * ftmFee.toNumber()) / 1000));

      const tokenFee = await mpStorageContract.marketFeeForToken();
      dispatch(setMarketplaceFeeForToken((100 * tokenFee.toNumber()) / 1000));
    } catch (error) {
      console.log("error", error);
    }
  }
};

export const useFetchPublicData = () => {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   fetchMarketplacePublicData(dispatch);
  // }, [dispatch]);

  useInterval(() => {
    fetchMarketplacePublicData(dispatch);
  }, 5000);
};

// Marketplace
export const useMarketplace = () => {
  const { account } = useWeb3React();
  const marketplaceState = useSelector((state) => state.marketplace);
  const dispatch = useDispatch();

  useInterval(() => {
    // dispatch(fetchEmperor(account));
  }, 5);

  return marketplaceState;
};
