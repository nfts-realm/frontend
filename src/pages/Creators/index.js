import React, { useEffect, useState } from "react";
import BreadCrumb from "components/BreadCrumb";
import Creator from "components/Creator";
import { useWeb3React } from "@web3-react/core";
import Loader from "components/Loader";
import Filter from "./Filter";
import { firestore } from "utils/firebase";

const breadCrumbData = [
  { title: "Home", page: "/" },
  { title: "Creators", page: "/creators" },
];

function Creators() {
  const [creators, setCreators] = useState([]);
  const [sortOption, setSortOption] = useState("mostP");
  const [filterData, setFilter] = useState(creators);
  const [isLoading, setIsLoading] = useState(true);
  const { account } = useWeb3React();

  useEffect(() => {
    getUsers();
  }, []);

  const handleSearch = (e) => {
    if (typeof e === "string") {
      const input = e.toLowerCase();
      setFilter(
        sortOption === "following"
          ? creators.filter(
              (x) =>
                (x.firstName?.toLowerCase().includes(input) ||
                  x.lastName?.toLowerCase().includes(input) ||
                  x.nickName?.toLowerCase().includes(input) ||
                  x.bio?.toLowerCase().includes(input)) &&
                x.followers.includes(account),
            )
          : creators
              .filter(
                (x) =>
                  x.firstName?.toLowerCase().includes(input) ||
                  x.lastName?.toLowerCase().includes(input) ||
                  x.nickName?.toLowerCase().includes(input) ||
                  x.bio?.toLowerCase().includes(input),
              )
              .sort((a, b) => {
                if (sortOption === "mostP") return b.followers.length - a.followers.length;
                if (sortOption === "leastP") return a.followers.length - b.followers.length;
                if (sortOption === "mostS") return b.price - a.price;
                if (sortOption === "leastS") return a.price - b.price;
                return true;
              }),
      );
    }
  };

  const handleSort = (sortType) => {
    setSortOption(sortType);
    const temp =
      sortType === "following"
        ? creators.filter((x) => x.followers.includes(account))
        : creators.sort((a, b) => {
            if (sortType === "mostP") return b.followers.length - a.followers.length;
            if (sortType === "leastP") return a.followers.length - b.followers.length;
            if (sortType === "mostS") return b.price - a.price;
            if (sortType === "leastS") return a.price - b.price;
            return true;
          });
    setFilter(temp);
  };

  const getUsers = async () => {
    setIsLoading(true);
    const userDocs = await firestore.collection("users").get();
    let creatorLists = [];
    for (let i = 0; i < userDocs.docs.length; i++) {
      const doc = userDocs.docs[i].data();
      const userNfts = await firestore
        .collection("history")
        .where("oldUserId", "==", doc.account)
        .where("actionType", "==", 1)
        .get();
      const userPrices = userNfts.docs.map((x) => x.data().price);
      const userPrice = userPrices.length > 0 ? userPrices.reduce((a, b) => a + b) : 0;
      // creatorLists.push({ ...doc });
      creatorLists.push({ ...doc, price: userPrice });
    }
    setCreators(creatorLists);
    setFilter(creatorLists);
    setIsLoading(false);
  };

  const updateFollower = (index) => {
    const temp = creators.map((x) => {
      if (x.account === index) {
        const tt = x;
        const ind = tt.followers.indexOf(account);
        if (ind === -1) tt.followers.push(account);
        else {
          tt.followers[ind] = tt.followers[tt.followers.length - 1];
          tt.followers.pop();
        }
        return tt;
      } else return x;
    });
    setCreators(temp);
    handleSearch("");
  };

  return (
    <main className="main">
      <div className="container">
        <div className="row row--grid">
          <BreadCrumb data={breadCrumbData} />
          <div className="col-12">
            <div className="main__title main__title--page">
              <h1>Creators</h1>
            </div>
          </div>
          <Filter onChange={(e) => handleSearch(e)} onSort={(e) => handleSort(e)} />
        </div>
        <div className="row row--grid">
          <Loader isLoading={isLoading} />
          {filterData.map((creator, index) => (
            <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={`creator-${index}`}>
              <Creator data={creator} id={index} updateFollower={updateFollower} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Creators;
