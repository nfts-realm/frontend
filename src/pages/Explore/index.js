import React, { useState, useEffect } from "react";
import { FaTimesCircle } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";
import BreadCrumb from "components/BreadCrumb";
import Card from "components/Card";
import Loader from "components/Loader";
import { client } from "utils/algolia";
import { firestore } from "utils/firebase";
import { NFT_CNT_PER_PAGE, PAYMENT_LIST, MAX_LIMIT_FOR_FTM, MAX_LIMIT_FOR_TOKEN } from "config/constants";
import "styles/explore.css";

const breadCrumbData = [
  { title: "Home", page: "/" },
  { title: "Explorer", page: "/explorer" },
];

function Explore() {
  const [price, setPrice] = useState(100);
  const [cards, setCards] = useState([]);
  const [order, setOrder] = useState("new");
  const [saleType, setSaleType] = useState("all");
  const [category, setCategory] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pageNFT, setPageNFT] = useState(0);
  const [paymentType, setPaymentType] = useState("FTM");

  const getNFTListFromAlgolia = async (isNew = false) => {
    try {
      setIsLoading(true);
      let algolia;
      if (order === "least") algolia = client.initIndex("NFTs_likesCount_asc");
      else if (order === "most") algolia = client.initIndex("NFTs_likesCount_desc");
      else if (order === "old") algolia = client.initIndex("NFTs_created_asc");
      else algolia = client.initIndex("NFTs");

      const filter = [];
      filter.push([`paymentType:${paymentType}`]);
      if (saleType !== "all") filter.push([`saleType:${saleType}`]);
      if (category !== "all") filter.push([`category:${category}`]);
      filter.push([`isSale:${false}`]);

      const res = await algolia.search(searchText, {
        hitsPerPage: 15,
        page: isNew ? 0 : pageNFT,
        facets: ["*", "category", "creator", "isSale", "owner", "saleType", "paymentType"],
        facetFilters: filter,
        numericFilters: [`price<${price}`],
      });

      const lists = [];
      for (let i = 0; i < res.hits.length; i++) {
        let doc = res.hits[i];
        await fetch(doc.tokenURI)
          .then((res) => res.json())
          .then((result) => {
            const nft_data = result !== undefined && result !== null ? { ...doc, ...result } : { ...doc };
            lists.push(nft_data);
          });
      }

      setTimeout(() => {
        setCards(isNew ? lists : [...cards, ...lists]);
      }, 1000);
      setPageNFT(isNew ? 1 : pageNFT + 1);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  // from firestore
  const getNFTList = async (isNew = false) => {
    try {
      setIsLoading(true);

      let orderByFilter = "createdDesc";
      if (order === "old") orderByFilter = "created";
      if (order === "least") orderByFilter = "likesCount";
      if (order === "most") orderByFilter = "likesCountDesc";

      let nftDocsQuery = firestore
        .collection("nfts")
        .orderBy("price")
        .where("price", "<", price || 1)
        .where("paymentType", "==", paymentType)
        .where("isSale", "==", false)
        .limit(NFT_CNT_PER_PAGE)
        .orderBy(orderByFilter)
        .startAt(isNew ? 0 : pageNFT * NFT_CNT_PER_PAGE);

      if (saleType !== "all") nftDocsQuery = nftDocsQuery.where("saleType", "==", saleType);
      if (category !== "all") nftDocsQuery = nftDocsQuery.where("category", "==", category);

      const nftDocs = await nftDocsQuery.get();

      let lists = [];
      if (nftDocs && nftDocs.docs.length > 0) {
        for (let i = 0; i < nftDocs.docs.length; i++) {
          const nftData = { id: nftDocs.docs[i].id, ...nftDocs.docs[i].data() };

          try {
            await fetch(nftData.tokenURI)
              .then((res) => res.json())
              .then((result) => {
                const nftDataInDetail =
                  result !== undefined && result !== null ? { ...nftData, ...result } : { ...nftData };
                lists.push(nftDataInDetail);
              });
          } catch (err2) {}
        }
      }

      setTimeout(() => {
        setCards(isNew ? lists : [...cards, ...lists]);
      }, 1000);
      if (nftDocs.docs.length >= NFT_CNT_PER_PAGE) {
        setPageNFT(pageNFT + 1);
      }
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getNFTList(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saleType, category, order, price, searchText, paymentType]);

  const sliderChange = (e) => {
    setPrice(e.target.value);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleReset = () => {
    setSearchText("");
    setPrice(MAX_LIMIT_FOR_FTM);
    setOrder("new");
  };

  return (
    <main className="main">
      <div className="container">
        <div className="row row--grid">
          <BreadCrumb data={breadCrumbData} />
          <div className="col-12">
            <div className="main__title main__title--page nft-border-bottom pb-3">
              <h2>Type your keywords</h2>
              <div className="search-outline d-flex justify-content-center align-items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  className="search-input"
                  value={searchText}
                  onChange={(e) => handleSearch(e)}
                />
                <button className="email-btn">
                  <BsSearch onClick={() => getNFTList(true)} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row row--grid">
          <div className="col-12 col-xl-3">
            <div className="slide-container mt-3">
              <label className="sign__label" htmlFor="subcategory">
                PRICE RANGE <span style={{ fontSize: "20px", color: "white" }}>{price} </span> {paymentType}
              </label>
              <input
                type="range"
                min="1"
                max={paymentType === "FTM" ? MAX_LIMIT_FOR_FTM : MAX_LIMIT_FOR_TOKEN}
                className="slider"
                id="myRange"
                value={price}
                onChange={(e) => sliderChange(e)}
              />
              <div className="d-flex justify-content-between">
                <p className="nft-color-white">1 {paymentType}</p>
                <p className="nft-color-white">
                  {paymentType === "FTM" ? MAX_LIMIT_FOR_FTM : MAX_LIMIT_FOR_TOKEN} {paymentType}
                </p>
              </div>
            </div>
            <div className="sign__group">
              <label className="sign__label" htmlFor="subcategory">
                Payment Type:
              </label>
              <select
                name="paymentType"
                className="explore__select"
                value={paymentType}
                onChange={(e) => {
                  setPaymentType(e.target.value);
                }}
              >
                {PAYMENT_LIST.map((payment, index) => (
                  <option value={payment.value} key={index}>
                    {payment.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="sign__group">
              <label className="sign__label" htmlFor="subcategory">
                Filter by:
              </label>
              <select
                name="subcategory"
                className="explore__select"
                value={order}
                onChange={(e) => {
                  setOrder(e.target.value);
                }}
              >
                <option value="new">Newest</option>
                <option value="old">Oldest</option>
                <option value="most">Most liked</option>
                <option value="least">Least liked</option>
              </select>
            </div>
            <div className="sign__group">
              <label className="sign__label" htmlFor="subcategory">
                Sale Type:
              </label>
              <select
                name="subcategory"
                className="explore__select"
                value={saleType}
                onChange={(e) => {
                  setSaleType(e.target.value);
                }}
              >
                <option value="all">All</option>
                <option value="fix">Fixed</option>
                <option value="auction">Auction</option>
              </select>
            </div>
            <div className="sign__group">
              <label className="sign__label" htmlFor="subcategory">
                Categories:
              </label>
              <select
                name="subcategory"
                className="explore__select"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
              >
                <option value="all">All</option>
                <option value="art">Art</option>
                <option value="music">Music</option>
                <option value="film">Film</option>
                <option value="sports">Sports</option>
                <option value="education">Education</option>
                <option value="photography">Photography</option>
                <option value="games">Games</option>
                <option value="other">Other</option>
              </select>
            </div>
            {/* <div className="filter__checkboxes mb-3">
              <input
                id="type5"
                type="checkbox"
                name="type5"
                checked={isSale}
                onChange={(e) => {
                  setIsSale(e.target.checked);
                }}
              />
              <label htmlFor="type5" style={{ fontSize: 18, color: "white" }}>
                On Sale
              </label>
            </div> */}
            <div onClick={() => handleReset()} className="nft-pointer">
              <p className="reset m-0">
                <FaTimesCircle className="mr-2" />
                Reset filter
              </p>
            </div>
          </div>

          <div className="col-12 col-xl-9">
            <Loader isLoading={isLoading} />

            <div className="row row--grid relative">
              {cards.map((card, index) => (
                <div className="col-12 col-sm-6 col-lg-4" key={`card-${index}`}>
                  <Card data={card} />
                </div>
              ))}

              <div className="col-12 d-flex justify-center">
                <button
                  className="asset__btn asset__btn--full asset__btn--clr height-sm"
                  style={{ width: 150, margin: "50px auto" }}
                  onClick={() => {
                    getNFTList(false);
                  }}
                >
                  Load More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Explore;
