import React from "react";
import { Link } from "react-router-dom";
import { useMarketplace } from "store/hooks";

function Banner() {
  const { marketFeeForFantom, marketFeeForToken } = useMarketplace();

  return (
    <div className="container">
      <p className="nft-text-center nft-font-18 text-white nft-pt-60">
        Create, explore, & collect digital art NFTs but also connect with artists & collectors
      </p>
      <p className="nft-text-center nft-font-36 text-white">The #1 community focused NFT Marketplace</p>
      <p className="nft-text-center d-flex justify-center items-center mt-4">
        <div>
          <a href="https://www.darkmatterdefi.com" target="_blank" rel="noopener noreferrer">
            <img
              className="d-none d-lg-block"
              src="assets/img/logo/dmd_logo_big.png"
              height="200px"
              alt="bg-main-left"
            />
          </a>

          <p className="my-1 mx-5 text-white nft-font-22">$DMD Token</p>
          <p className="mx-5 text-white nft-font-22">{`${marketFeeForToken}% Fee`}</p>
        </div>
        <div className="d-none d-lg-block">
          <Link to="/explore" className="explore-btn my-1 mx-5 text-white">
            Explore Marketplace
          </Link>
          <br />
          <Link to="/explore" className="explore-btn my-1 mx-5 text-white">
            Buy $DMD
          </Link>
        </div>
        <div>
          <img className="d-none d-lg-block" src="assets/img/logo/ftm_logo.png" height="200px" alt="bg-main-right" />
          <p className="my-1 mx-5 text-white nft-font-22">$FTM Token</p>
          <p className="mx-5 text-white nft-font-22">{`${marketFeeForFantom}% Fee`}</p>
        </div>
      </p>
    </div>
  );
}

export default Banner;
