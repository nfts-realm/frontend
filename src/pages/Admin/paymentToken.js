import React, { useState } from "react";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import { isAddress } from "@ethersproject/address";
import { getMarketplaceContract } from "utils/web3";

function PaymentToken() {
  const { library, account } = useWeb3React();
  // eslint-disable-next-line no-unused-vars
  const [tokenAddress, setTokenAddress] = useState("");
  const [payoutAddress, setPayoutAddress] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const marketplaceContract = getMarketplaceContract(library?.getSigner());

  const setPaymentToken = async () => {
    if (tokenName === "") {
      toast.error("Invalid token Name!");
      return;
    }
    if (tokenAddress === "" || !isAddress(tokenAddress)) {
      toast.error("Invalid token address!");
      return;
    }
    if (payoutAddress === "" || !isAddress(payoutAddress)) {
      toast.error("Invalid payout address!");
      return;
    }
    setIsProcessing(true);
    try {
      const res = await marketplaceContract.setTokenAddress(tokenName, tokenAddress, payoutAddress, {
        from: account,
      });
      res
        .wait()
        .then(async (result) => {
          console.log(result);
          toast.success("Payment Token has been registered successfully!");
          setIsProcessing(false);
          setTokenAddress("");
          setPayoutAddress("");
          setTokenName("");
        })
        .catch((e) => {
          console.log(e);
          toast.error("Failed to set payment token!");

          setIsProcessing(false);
        });
    } catch (err) {
      setIsProcessing(false);
      toast.error("Failed to set payment token!");
    }
  };

  return (
    <div className="col-12 col-xl-4 col-md-4">
      <div className="asset__info">
        <h2 className="text-white">Set Payment Token</h2>
        <div className="asset__action row">
          <p className="asset__text col-12 pb-2">Token Name</p>
          <input
            id="tokenName"
            type="text"
            name="tokenName"
            className="sign__input col-12 height-sm"
            placeholder="ex: DMD."
            value={tokenName || ""}
            onChange={(e) => {
              setTokenName(e.target.value);
            }}
          />
        </div>
        <div className="asset__action row">
          <p className="asset__text col-12 py-2">Token Address</p>
          <input
            id="tokenAddress"
            type="text"
            name="tokenAddress"
            className="sign__input col-12 height-sm"
            placeholder="ex: 0x600bE5FcB9338BC3938e4790EFBeAaa4F77D6893."
            value={tokenAddress || ""}
            onChange={(e) => {
              setTokenAddress(e.target.value);
            }}
          />
        </div>
        <div className="asset__action row">
          <p className="asset__text col-12 py-2">Payout Address</p>
          <input
            id="payoutAddress"
            type="text"
            name="payoutAddress"
            className="sign__input col-12 height-sm"
            placeholder="ex: 0x600bE5FcB9338BC3938e4790EFBeAaa4F77D6893."
            value={payoutAddress || ""}
            onChange={(e) => {
              setPayoutAddress(e.target.value);
            }}
          />
        </div>
      </div>
      <div className="d-flex justify-center">
        <button className="asset__btn asset__btn--clr height-sm" disabled={isProcessing} onClick={setPaymentToken}>
          {isProcessing ? "REGISTERING..." : "SET PAYMENT TOKEN"}
        </button>
      </div>
    </div>
  );
}

export default PaymentToken;
