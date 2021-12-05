import React, { useState, useEffect } from "react";
import { firestore } from "utils/firebase";
import Card from "components/Card";
import Loader from "components/Loader";

function LiveAuction() {
  const [loading, setLoading] = useState(true);
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    getNFTLists();
  }, []);

  const getNFTLists = async () => {
    try {
      setLoading(true);
      let res = firestore.collection("nfts");
      res = res.where("saleType", "==", "auction");
      res = res.limit(4);
      const nfts = await res.get();
      let nfts_list = [];
      for (let i = 0; i < nfts.docs.length; i++) {
        const x = nfts.docs[i];
        const temp = x?.data();
        if (temp?.tokenURI)
          fetch(temp.tokenURI)
            .then((res) => res.json())
            .then((result) => {
              const ite = { id: x.id, ...temp, ...result };
              nfts_list.push(ite);
            });
      }
      setTimeout(() => {
        setNfts(nfts_list);
      }, 1000);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Spinner play={play || playNFT} /> */}
      <p className="nft-text-center nft-font-36 text-white nft-mt-100">
        Discover the world’s top creators & collectors
      </p>
      <p className="nft-text-center nft-font-18 text-white nft-pt-60">
        NFTs Realm is the leading destination to find creative work and is the home to the world's best NFT creators
        Connect with people, interact with them and trade your NFTs
      </p>
      {/* <!-- live auctions --> */}
      <section className="row row--grid">
        {/* <!-- title --> */}
        <div className="col-12">
          <div className="main__title">
            <h2>
              <a href="/explore">Live auctions</a>
            </h2>
          </div>
        </div>
        {/* <!-- end title --> */}

        {/* <!-- carousel --> */}
        <div className="col-12">
          <Loader isLoading={loading} />
          <div className="main__carousel-wrap my__caro">
            <div className="main__carousel my__card">
              {nfts.map((card, index) => index < 4 && <Card data={card} key={`card-${index}`} />)}
            </div>
            {/* <button
              className="main__nav main__nav--prev"
              data-nav="#live"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M17,11H9.41l3.3-3.29a1,1,0,1,0-1.42-1.42l-5,5a1,1,0,0,0-.21.33,1,1,0,0,0,0,.76,1,1,0,0,0,.21.33l5,5a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L9.41,13H17a1,1,0,0,0,0-2Z" />
              </svg>
            </button>
            <button
              className="main__nav main__nav--next"
              data-nav="#live"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M17.92,11.62a1,1,0,0,0-.21-.33l-5-5a1,1,0,0,0-1.42,1.42L14.59,11H7a1,1,0,0,0,0,2h7.59l-3.3,3.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l5-5a1,1,0,0,0,.21-.33A1,1,0,0,0,17.92,11.62Z" />
              </svg>
            </button> */}
          </div>
        </div>
        {/* <!-- end carousel --> */}
      </section>
      {/* <!-- end live auctions --> */}
    </>
  );
}

export default LiveAuction;
