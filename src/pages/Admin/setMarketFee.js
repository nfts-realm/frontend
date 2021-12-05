import React, { useState } from "react";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import { getMarketplaceContract } from "utils/web3";

function SetMarketFee() {
  const { library } = useWeb3React();
  // eslint-disable-next-line no-unused-vars
  const [mainFee, setMainFee] = useState("7.5");
  const [tokenFee, setTokenFee] = useState("5");
  const [isProcessingFTM, setIsProcessingFTM] = useState(false);
  const [isProcessingToken, setIsProcessingToken] = useState(false);

  const marketplaceContract = getMarketplaceContract(library?.getSigner());

  const setMarketFeeForFTM = async () => {
    if (mainFee === "" || parseFloat(mainFee) < 1) {
      toast.error("Invalid Fee!");
      return;
    }
    setIsProcessingFTM(true);

    try {
      const res = await marketplaceContract.setMarketFeeForFantom(parseFloat(mainFee) * 10);
      res
        .wait()
        .then(async (result) => {
          console.log(result);
          setIsProcessingFTM(false);
          toast.success("Market Fee For FTM Payment has been updated successfully!");
        })
        .catch((e) => {
          console.log(e);
          toast.error("Failed to update Fee!");
          setIsProcessingFTM(false);
        });
    } catch (err) {
      setIsProcessingFTM(false);
      toast.error("Failed to update Fee!");
    }
  };

  const setMarketFeeForToken = async () => {
    if (tokenFee === "" || parseFloat(tokenFee) < 1) {
      toast.error("Invalid Fee!");
      return;
    }
    setIsProcessingToken(true);

    try {
      const res = await marketplaceContract.setMarketFeeForToken(parseFloat(tokenFee) * 10);
      res
        .wait()
        .then(async (result) => {
          console.log(result);
          toast.success("Market Fee For Token Payment has been updated successfully!");
          setIsProcessingToken(false);
        })
        .catch((e) => {
          console.log(e);
          toast.error("Failed to update Fee!");
          setIsProcessingToken(false);
        });
    } catch (err) {
      setIsProcessingToken(false);
      toast.error("Failed to update Fee!");
    }
  };

  return (
    <div className="col-12 col-xl-4 col-md-4">
      <div className="asset__info">
        <h2 className="text-white">Set Market Fee</h2>
        <div className="asset__action row">
          <p className="asset__text col-12 pb-2">Market Fee For FTM</p>
          <input
            id="toAddress"
            type="text"
            name="toAddress"
            className="sign__input col-12 height-sm"
            placeholder="7.5"
            value={mainFee || ""}
            onChange={(e) => {
              setMainFee(e.target.value);
            }}
          />
        </div>
        <div className="d-flex justify-center">
          <button
            className="asset__btn asset__btn--clr height-sm col-12"
            disabled={isProcessingFTM}
            onClick={setMarketFeeForFTM}
          >
            {isProcessingFTM ? "REGISTERING..." : "Set Fee For FTM"}
          </button>
        </div>
        <div className="asset__action row">
          <p className="asset__text col-12 py-2">Market Fee For Token</p>
          <input
            id="toAddress"
            type="text"
            name="toAddress"
            className="sign__input col-12 height-sm"
            placeholder="5"
            value={tokenFee || ""}
            onChange={(e) => {
              setTokenFee(e.target.value);
            }}
          />
        </div>
        <div className="d-flex justify-center">
          <button
            className="asset__btn asset__btn--clr height-sm col-12"
            disabled={isProcessingToken}
            onClick={setMarketFeeForToken}
          >
            {isProcessingToken ? "REGISTERING..." : "Set Fee For Token"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SetMarketFee;
