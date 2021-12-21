import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { firestore } from "utils/firebase";
import { MAX_LIKES_CNT } from "config/constants";
import Loader from "components/Loader";
import EthCard from "components/EthCard";
import Preview from "components/Preview";

function Featured() {
  const [maxNft, setMaxNft] = useState({});
  const [follow, setFollow] = useState(maxNft?.likes);
  const [loading, setLoading] = useState(false);
  const { account } = useWeb3React();

  useEffect(() => {
    getMaxNFT();
  }, []);

  const getMaxNFT = async () => {
    setLoading(true);
    try {
      const x = (await firestore.collection("nfts").orderBy("likesCount", "desc").get()).docs[0];
      const temp = x.data();
      fetch(temp.tokenURI)
        .then((res) => res.json())
        .then((result) => {
          const item = { id: x.id, ...temp, ...result };
          setFollow(item.likes);
          setMaxNft(item);
        });
    } catch (error) {
      console.log("firebase nfts data fetch error:", error);
    }

    setLoading(false);
  };

  const increaseLikes = () => {
    if (account) {
      const user_index = follow.indexOf(account);
      if (maxNft.creator === account) {
        toast.error("You are a creator");
        return;
      }
      let temp = [...follow];
      if (user_index > -1) {
        temp[user_index] = temp[temp.length - 1];
        temp.pop();
      } else {
        temp = [...temp, account];
      }
      firestore
        .collection("nfts")
        .doc(maxNft.id)
        .update({ likes: temp, likesCount: temp.length, likesCountDesc: MAX_LIKES_CNT - temp.length })
        .then(() => {
          setFollow(temp);
          toast.success(`You ${user_index === -1 ? "" : "un"}followed NFT`);
        })
        .catch((err) => {
          toast.error(err);
        });
    } else {
      toast.error("Please connect your wallet first");
    }
  };

  return (
    <div className="row">
      <div className="col-12 col-xl-8">
        <Loader isLoading={loading} />
        {!loading && <Preview data={maxNft} />}
      </div>
      <div className="col-12 col-xl-4 pt-4">
        <div className="col-12 d-flex justify-content-center mt-2">
          <EthCard data={maxNft} />
        </div>
        <div className="d-flex justify-content-center">
          <div className="col-12 d-flex justify-content-around mt-1 nft-color-white nft-mw-350 my-4">
            {/* <div className="d-flex justify-content-around items-center">
              <img
                src="assets/img/Group181.png"
                alt="chain"
                className="view-icon mr-1"
              />
              <span>View</span>
            </div> */}
            <div
              className="d-flex justify-content-around items-center nft-color-white cursor-pointer"
              onClick={increaseLikes}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" width="25px" height="25px" className="mr-2">
                <path
                  fillRule="evenodd"
                  fill={follow?.length && follow.includes(account) ? "#eb5757" : "#fff"}
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{follow?.length}</span>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <Link to={`/item/${maxNft.id}`} className="buy-btn">
            {maxNft?.saleType === "fix" ? "Buy Now" : "Place Bid"}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Featured;
