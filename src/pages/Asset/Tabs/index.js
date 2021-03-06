import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { isAddress } from "@ethersproject/address";
import { toast } from "react-toastify";
import SweetAlert from "sweetalert-react";
import "sweetalert/dist/sweetalert.css";
import { firestore } from "utils/firebase";
import { getMarketplaceContract } from "utils/web3";
import { DEFAULT_AVATAR } from "config/constants";

function Tabs(props) {
  const { account, library } = useWeb3React();
  const { historyData, bidsData, item, docId } = props;
  // eslint-disable-next-line no-unused-vars
  const [toAddress, setToAddress] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [isTransferring, setIsTransfer] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const history = useHistory();

  const mpContract = getMarketplaceContract(library?.getSigner());

  const getStr = (type) => {
    if (type === 0) return "Created ";
    if (type === 1) return "Buy ";
    if (type === 2) return "Bid placed ";
    if (type === 3) return "Auction created ";
    if (type === 4) return "Auction ended ";
    if (type === 5) return "Auction canceled ";
  };

  const burnNFT = () => {
    setIsShow(true);
  };

  const onConfirmBurn = async () => {
    const { nftCollection, tokenId } = item;

    setIsShow(false);
    setIsBurning(true);
    try {
      const res = await mpContract.burn(nftCollection, tokenId);
      res
        .wait()
        .then(async (result) => {
          console.log(result);
          await firestore.collection("nfts").doc(docId).delete();
          toast.success("The NFT has been successfully burned.");
          setIsBurning(false);
          history.push("/explore");
        })
        .catch((err) => {
          toast.error("Failed to burn.");
          console.log(err);
          setIsBurning(false);
        });
    } catch (err) {
      console.log(err);
      toast.error("Failed to burn.");
      setIsBurning(false);
    }
  };

  const sendNFT = async () => {
    const { tokenId } = item;

    if (toAddress === "" || !isAddress(toAddress)) {
      toast.error("Please provide a valid address.");
      return;
    }

    if (tokenId === "") {
      toast.error("Invalid token ID.");
      return;
    }

    setIsTransfer(true);

    try {
      const res = await mpContract.giveaway(
        toAddress,
        item.nftCollection,
        item.tokenId,
        item.paymentType,
        item.price,
        item.royalties,
        item.tokenURI,
      );
      res.wait().then(async (result) => {
        console.log(result);
        firestore
          .collection("users")
          .where("account", "==", toAddress)
          .get()
          .then(async (querySnapshot) => {
            let avatar;
            if (!querySnapshot.empty) {
              const user = querySnapshot.docs[0].data();
              // rest of your code
              avatar = user.avatar;
            } else {
              avatar = DEFAULT_AVATAR;
            }
            await firestore.collection("nfts").doc(docId).update({
              owner: toAddress,
              ownerAvatar: avatar,
            });
            toast.success("The NFT has been successfully transferred.");
            setIsTransfer(false);

            history.push("/explore");
          })
          .catch(function (error) {
            toast.error("Failed to send transfer");
            console.log("Error getting documents: ", error);
            setIsTransfer(false);
          });
      });
    } catch (err) {
      console.log("giveaway err", err);
      toast.error("Failed to send transfer");
      setIsTransfer(false);
    }
  };

  // const updateSetting = async () => {
  // try {
  //   if (item.isSale && saleType !== item.saleType) {
  //     toast.error("Please stop selling first");
  //     return;
  //   }
  //   if (!account) {
  //     toast.error("Please connect your wallet first.");
  //     return;
  //   }
  //   if (item.tokenId !== 0) {
  //     const res = await mpContract.updatePrice(
  //       item.tokenId,
  //       parseUnits(newPrice.toString())
  //     );
  //     await res.wait();
  //   }
  //   await firestore
  //     .collection("nfts")
  //     .doc(item.id)
  //     .update({
  //       price: parseFloat(newPrice),
  //       saleType: saleType,
  //     });
  //   toast.success("Success to update.");
  // } catch (err) {
  //   toast.error("Fail to update");
  // }
  // };

  return (
    <>
      <ul className="nav nav-tabs asset__tabs" role="tablist">
        <li className="nav-item">
          <a
            className="nav-link active"
            data-toggle="tab"
            href="#tab-1"
            role="tab"
            aria-controls="tab-1"
            aria-selected="true"
          >
            History
          </a>
        </li>

        <li className="nav-item">
          <a
            className="nav-link"
            data-toggle="tab"
            href="#tab-2"
            role="tab"
            aria-controls="tab-2"
            aria-selected="false"
          >
            Bids
          </a>
        </li>

        <li className="nav-item">
          <a
            className="nav-link"
            data-toggle="tab"
            href="#tab-3"
            role="tab"
            aria-controls="tab-3"
            aria-selected="false"
          >
            Actions
          </a>
        </li>
      </ul>

      <div className="tab-content">
        <div className="tab-pane fade show active" id="tab-1" role="tabpanel">
          <div className="asset__actions fancy-scrollbar">
            {historyData.map((data, index) => (
              <div
                className={`asset__action ${data.verified === true ? "asset__action--verified" : ""}`}
                key={`history-${index}`}
              >
                <img src={data.avatar} alt="" />
                <p>
                  {getStr(data.actionType)} for{" "}
                  <b>
                    {data.ftmPrice} {item.paymentType}
                  </b>{" "}
                  {data.timeAgo} <br />
                  by {data.nickName}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="tab-pane fade" id="tab-2" role="tabpanel">
          <div className="asset__actions fancy-scrollbar">
            {bidsData.map((data, index) => (
              <div
                className={`asset__action ${data.verified === true ? "asset__action--verified" : ""}`}
                key={`history-${index}`}
              >
                <img src={data.avatar} alt="" />
                <p>
                  {getStr(data.actionType)} for{" "}
                  <b>
                    {data.ftmPrice} {item.paymentType}
                  </b>{" "}
                  {data.timeAgo} <br />
                  by {data.nickName}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="tab-pane fade" id="tab-3" role="tabpanel">
          {item.owner === account && item.saleType === "fix" ? (
            <div className="asset__actions fancy-scrollbar">
              <div className="asset__action row">
                <p className="asset__text col-4 pr-0">Transfer To:</p>
                <input
                  id="toAddress"
                  type="text"
                  name="toAddress"
                  className="sign__input col-8 height-sm"
                  placeholder="ex: 0x600bE5FcB9338BC3938e4790EFBeAaa4F77D6893."
                  value={toAddress || ""}
                  onChange={(e) => {
                    setToAddress(e.target.value);
                  }}
                />
              </div>
              <div className="d-flex justify-center">
                <button className="asset__btn asset__btn--clr height-sm" disabled={isTransferring} onClick={sendNFT}>
                  {isTransferring ? "TRANSFERRING..." : "TRANSFER NFT"}
                </button>
              </div>
              <div className="asset__action row">
                <p className="asset__text col-4 pr-0">Or Burn:</p>
              </div>
              <div className="asset__actions">
                <div className="d-flex justify-center">
                  <button className="asset__btn asset__btn--red height-sm" onClick={burnNFT}>
                    {isBurning ? "DELETING..." : "DELETE NFT"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="asset__actions asset__action">
              <p className="mx-auto asset__text">
                {item.owner !== account
                  ? "You are not owner."
                  : "You cannot take any actions with this Auctioning NFT."}
              </p>
            </div>
          )}
        </div>
      </div>
      <SweetAlert
        show={isShow}
        title="Are you sure?"
        text="Do you want to delete it permanently?"
        showCancelButton
        onConfirm={onConfirmBurn}
        onCancel={() => {
          setIsShow(false);
        }}
      />
    </>
  );
}

export default Tabs;
