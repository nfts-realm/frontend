import React from "react";
import { LazyLoad } from "react-observer-api";
import "intersection-observer";
import Banner from "./banner";
import Featured from "./featured";
import LiveAuction from "./liveAuction";
import TopSeller from "./topSeller";
import TopBuyer from "./topBuyer";
import GetStarted from "./getStarted";
import "styles/main.css";

function Main() {
  const style = {
    padding: 10,
  };
  const options = {
    rootMargin: "100px",
    threshold: 1.0,
  };

  return (
    <main className="main">
      <LazyLoad style={style} options={options}>
        <Banner />
      </LazyLoad>
      <LazyLoad style={style} options={options}>
        <Featured />
      </LazyLoad>
      <div className="container">
        <LazyLoad style={style} options={options}>
          <LiveAuction />
        </LazyLoad>
        <LazyLoad style={style} options={options}>
          <TopSeller />
        </LazyLoad>
        <LazyLoad style={style} options={options}>
          <TopBuyer />
        </LazyLoad>
        <LazyLoad style={style} options={options}>
          <GetStarted />
        </LazyLoad>
      </div>
    </main>
  );
}

export default Main;
