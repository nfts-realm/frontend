import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import Switch from "react-switch";
import { toast } from "react-toastify";
import moment from "moment";
import axios from "axios";
import ReactSlider from "react-slider";
import { parseUnits } from "@ethersproject/units";
import AuthorMeta from "components/AuthorMeta";
import NFTDropzone from "components/Dropzone";
import ipfs from "utils/ipfsApi.js";
import { getNftContract, getMarketplaceContract } from "utils/web3";
import { getRealmNftAddress, getMarketplaceAddress } from "utils/addressHelpers";
import { getNftStorageClient } from "utils/nftStorage";
import { firestore } from "utils/firebase";
import { PAYMENT_LIST, MAX_TIMESTAMP } from "config/constants";
import { setUserProfile } from "store/actions";
import "styles/create.css";

const realmNftAddress = getRealmNftAddress();
const marketplaceAddress = getMarketplaceAddress();
const nftStorageClient = getNftStorageClient();

function Create() {
  const dispatch = useDispatch();
  const { library, account } = useWeb3React();
  const [user, setUser] = useState({
    account: account,
    avatar: "assets/img/avatars/avatar.jpg",
    ownerAvatar: "assets/img/avatars/avatar.jpg",
    imageCover: "/assets/img/bg/bg.png",
    firstName: "User",
    lastName: "",
    nickName: "@user",
    bio: "",
    twitter: "",
    telegram: "",
    instagram: "",
    subscribe: "",
    followers: [],
  });
  const [type, setType] = useState("image");
  // eslint-disable-next-line no-unused-vars
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState("art");
  const [isAttached, setIsAttached] = useState(false);
  const [attachFile, setAttachFile] = useState(null);
  const [name, setName] = useState("");
  const [royalties, setRoyalties] = useState(1);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [saleType, setSaleType] = useState("fix");
  const [buffer, setBuffer] = useState(null);
  const [attachBuffer, setAttachBuffer] = useState(null);
  const [isCreateProcess, setCreateProcess] = useState(false);
  const [isSale, setIsSale] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [auctionLength, setAuctionLength] = useState("12");
  const [paymentType, setPaymentType] = useState("FTM");
  const [rate, setRate] = useState(10);

  const history = useHistory();

  const marketplaceContract = getMarketplaceContract(library?.getSigner());
  const nftContract = getNftContract(library?.getSigner());

  useEffect(() => {
    updatePrice(paymentType);
  }, [paymentType]);

  useEffect(() => {
    dispatchUser(account);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const dispatchProfile = (payload) => {
    setUser(payload);
    dispatch(setUserProfile(payload));
  };

  const creatProfile = async (user_account) => {
    const author = {
      avatar: "/assets/img/avatars/avatar.jpg",
      imageCover: "/assets/img/bg/bg.png",
      ownerAvatar: "/assets/img/avatars/avatar.jpg",
      firstName: "User",
      lastName: "",
      nickName: "@user",
      account: user_account,
      bio: "",
      twitter: "",
      telegram: "",
      instagram: "",
      subscribe: "",
      followers: [],
    };
    await firestore.collection("users").doc(user_account).set(author);
    dispatchProfile(author);
  };

  const getFile = (file, isAttach = false) => {
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result;
      if (!isAttach) setBuffer(binaryStr);
      else setAttachBuffer(binaryStr);
    };
    reader.readAsArrayBuffer(file);
  };

  const onCreateNFT = async () => {
    if (!name || !description || !buffer) {
      toast.error("Please fill the NFT information.");
      return;
    }
    if (isSale && price <= 0) {
      toast.error("Price should not be zero.");
      return;
    }
    try {
      // account handling part, create account on firebase if current user is not existed on firebase
      if (!account) toast.error("Please connect your wallet first.");
      const userExist = (await firestore.collection("users").doc(account).get()).exists;
      if (!userExist) {
        await creatProfile(account);
        toast.error("Please create your profile first.");
        return;
      }

      // check nft detailed information if "sale" status is set to "true"
      if (!isSale || (isSale && saleType === "fix"))
        await library.getSigner(account).signMessage("Please check this account is yours");

      // handling nft creation part only when "account" is stored on firebase
      if (account) {
        setCreateProcess(true);
        const result = await ipfs.files.add(Buffer.from(buffer));
        const imgAttach = attachFile ? await ipfs.files.add(Buffer.from(attachBuffer)) : null;

        const cid = await nftStorageClient.storeDirectory([
          new File(
            [
              JSON.stringify({
                name: name,
                description: description,
                creator: account,
                type,
                category,
                royalties: royalties,
                image: `https://ipfs.io/ipfs/${result[0].hash}`,
                imageAttach: imgAttach ? `https://ipfs.io/ipfs/${imgAttach[0].hash}` : null,
              }),
            ],
            "metadata.json",
          ),
        ]);

        if (cid) {
          const tokenURI = `https://ipfs.io/ipfs/${cid}/metadata.json`;
          if (isSale && saleType === "auction") {
            const auction_length = parseInt(auctionLength) * 3600;
            // const auction_length = 1200;
            const isApproved = await nftContract.isApprovedForAll(account, marketplaceAddress);
            if (!isApproved) {
              const approve = await nftContract.setApprovalForAll(marketplaceAddress, true);
              await approve.wait();
            }

            const res = await marketplaceContract.createAuction(
              realmNftAddress,
              0,
              true,
              tokenURI,
              auction_length,
              paymentType,
              parseUnits(price.toString()),
              account,
            );

            res
              .wait()
              .then(async (result) => {
                const events = result?.events;
                if (events.length > 0) {
                  const args = events[events.length - 1].args;
                  const res1 = await firestore.collection("nfts").add({
                    nftCollection: realmNftAddress,
                    tokenId: parseInt(args.tokenId),
                    tokenURI,
                    ownerAvatar: user?.avatar || "/assets/img/avatars/avatar.jpg",
                    owner: account,
                    creator: account,
                    price: parseFloat(price),
                    isSale,
                    saleType: "auction",
                    paymentType: paymentType,
                    auctionLength: auction_length,
                    auctionCreator: account,
                    time: (parseInt(args.duration) + parseInt(args.auctionStart)) * 1000,
                    likes: [],
                    created: moment().valueOf(),
                    createdDesc: MAX_TIMESTAMP - moment().valueOf(),
                  });
                  if (res1?.id) {
                    firestore.collection("history").add({
                      userId: account,
                      oldUserId: account,
                      nftCollection: realmNftAddress,
                      nftId: res1.id,
                      actionType: 0,
                      price: parseFloat(price),
                      paymentType: paymentType,
                      time: moment().valueOf(),
                    });
                    firestore.collection("history").add({
                      userId: account,
                      oldUserId: account,
                      nftCollection: realmNftAddress,
                      nftId: res1.id,
                      actionType: 3,
                      price: parseFloat(price),
                      paymentType: paymentType,
                      time: moment().valueOf(),
                    });
                    toast.success("Create NFT and start auction");
                    setCreateProcess(false);
                    setIsAccept(false);
                    history.push(`/creator/${account}`);
                  } else {
                    setCreateProcess(false);
                    toast.error("Create failed.");
                  }
                }
              })
              .catch((err) => {
                toast.error("Create failed.");
                console.log("create and auction:", err);
              });
          } else {
            const res = await firestore.collection("nfts").add({
              nftCollection: realmNftAddress,
              tokenId: 0,
              tokenURI,
              ownerAvatar: user?.avatar || "/assets/img/avatars/avatar.jpg",
              owner: account,
              creator: account,
              price: parseFloat(price),
              paymentType: paymentType,
              isSale,
              saleType: "fix",
              auctionLength: 0,
              auctionCreator: null,
              time: 0,
              likes: [],
              created: moment().valueOf(),
              createdDesc: MAX_TIMESTAMP - moment().valueOf(),
              type,
              category,
              name,
              description,
            });

            if (res?.id) {
              firestore.collection("history").add({
                userId: account,
                oldUserId: account,
                nftCollection: realmNftAddress,
                nftId: res.id,
                actionType: 0,
                price: parseFloat(price),
                paymentType: paymentType,
                time: moment().valueOf(),
              });
              toast.success("Create NFT");
              setCreateProcess(false);
              setIsAccept(false);
              history.push(`/creator/${account}`);
            } else {
              setCreateProcess(false);
              toast.error("Create failed.");
            }
          }
        } else {
          toast.error("Uploading failed");
          setCreateProcess(false);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const updatePrice = (_newPaymentType) => {
    const token = _newPaymentType === "FTM" ? "fantom" : "dark-matter-defi";
    axios
      .get(`https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`)
      .then((res) => {
        console.log("res:", res);
        if (res.status === 200) {
          const cur_rate = res.data[token]?.usd;
          if (cur_rate) setRate(cur_rate);
        } else {
          console.log("not found price");
        }
      })
      .catch((err) => console.log(err));
  };

  const dispatchUser = async (user_id) => {
    if (user_id) {
      const userInfo = (await firestore.collection("users").doc(user_id).get()).data();
      dispatch(setUserProfile(userInfo));
      setUser(userInfo);
    }
  };

  return (
    <main className="main">
      <div className="main__author" data-bg="/assets/img/bg/bg.png">
        <img src={user?.imageCover || "/assets/img/bg/bg.png"} width="100%" height="100%" alt="" />
      </div>
      <div className="container">
        <div className="row row--grid">
          <div className="col-12 col-xl-3">
            <div className="author author--page">
              <AuthorMeta data={user} />
            </div>
          </div>
          <div className="col-12 col-xl-9">
            {/* title */}
            <div className="main__title main__title--create">
              <h2>Create and List an item for sale</h2>
            </div>
            {/* end title */}

            {/* create form */}
            <form action="#" className="sign__form sign__form--create">
              <div className="row">
                <div className="col-12">
                  <div className="sign__group">
                    <label className="sign__label" htmlFor="type">
                      NFT Type
                    </label>
                    <select id="type" name="type" className="sign__select" onChange={(e) => setType(e.target.value)}>
                      <option value="image">Image</option>
                      <option value="audio">Audio</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                </div>

                <div className="col-12">
                  <label className="sign__label" htmlFor="files">
                    Upload file
                  </label>
                </div>

                {type === "audio" ? (
                  <div className="nft-dropzone">
                    <NFTDropzone
                      nftType="Audio"
                      onChange={(newFile) => {
                        setFile(newFile);
                        getFile(newFile);
                      }}
                    />
                  </div>
                ) : type === "video" ? (
                  <div className="nft-dropzone">
                    <NFTDropzone
                      nftType="Video"
                      onChange={(newFile) => {
                        setFile(newFile);
                        getFile(newFile);
                      }}
                    />
                  </div>
                ) : type === "image" ? (
                  <div className="nft-dropzone">
                    <NFTDropzone
                      nftType="image"
                      onChange={(newFile) => {
                        setFile(newFile);
                        getFile(newFile);
                      }}
                    />
                  </div>
                ) : (
                  ""
                )}

                <div className="col-12 pt-3">
                  <div className="sign__group filter__checkboxes">
                    <input
                      id="private"
                      type="checkbox"
                      name="private"
                      checked={isAttached}
                      onChange={() => {
                        setIsAttached(!isAttached);
                      }}
                    />
                    <label className="sign__label" htmlFor="private">
                      Attach a private file/unlockable content?
                    </label>
                  </div>
                </div>

                {isAttached && (
                  <div className="nft-dropzone">
                    <NFTDropzone
                      nftType={"all"}
                      onChange={(newFile) => {
                        getFile(newFile, true);
                        setAttachFile(newFile);
                      }}
                    />
                  </div>
                )}

                <div className="col-12">
                  <div className="sign__group">
                    <label className="sign__label" htmlFor="category">
                      Select Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      className="sign__select"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
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
                </div>

                <div className="col-12">
                  <div className="sign__group">
                    <label className="sign__label" htmlFor="name">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      className="sign__input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-12 col-md-4">
                  <div className="sign__group">
                    <label className="sign__label" htmlFor="royalties">
                      Royalties: {royalties}%
                    </label>
                    <ReactSlider
                      className="horizontal-slider"
                      thumbClassName="example-thumb"
                      trackClassName="example-track"
                      defaultValue={1}
                      value={royalties}
                      onChange={(e) => {
                        setRoyalties(e);
                      }}
                      min={1}
                      max={20}
                      renderTrack={(props, state) => <div {...props}>{state.valueNow}</div>} //custom track
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="sign__group">
                    <label className="sign__label" htmlFor="description">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className="sign__textarea"
                      placeholder="e. g. 'After purchasing you will able to received...'"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                  </div>
                </div>

                <div className="col-12">
                  <h4 className="sign__title">Price and type</h4>
                </div>

                <div className="col-12">
                  <div className="sign__group">
                    <label className="sign__label mr-3" htmlFor="sale">
                      Sale :
                    </label>

                    <Switch
                      onChange={() => {
                        setIsSale(!isSale);
                      }}
                      checked={isSale}
                      height={26}
                    />
                  </div>
                </div>
                {isSale && (
                  <>
                    <div className="col-12">
                      <div className="sign__group">
                        <label className="sign__label col-12" htmlFor="saleType">
                          Sale Type
                        </label>
                        <select
                          id="saleType"
                          name="saleType"
                          className="sign__select col-12 col-md-6 mt-0"
                          value={saleType}
                          onChange={(e) => setSaleType(e.target.value)}
                        >
                          <option value="fix">Fixed</option>
                          <option value="auction">Auction</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-12 col-md-6">
                      <div className="sign__group">
                        <label className="sign__label" htmlFor="length">
                          Payment Type
                        </label>
                        <select
                          id="length"
                          name="length"
                          className="sign__select mt-0"
                          value={paymentType}
                          onChange={(e) => setPaymentType(e.target.value)}
                        >
                          {PAYMENT_LIST.map((payment, index) => (
                            <option value={payment.value} key={index}>
                              {payment.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    {saleType === "auction" && (
                      <div className="col-12 col-md-6">
                        <div className="sign__group">
                          <label className="sign__label" htmlFor="length">
                            Auction Length
                          </label>
                          <select
                            id="length"
                            name="length"
                            className="sign__select mt-0"
                            value={auctionLength}
                            onChange={(e) => setAuctionLength(e.target.value)}
                          >
                            <option value="12">12 hours</option>
                            <option value="24">24 hours</option>
                            <option value="48">2 days</option>
                            <option value="72">3 days</option>
                            <option value="168">7 days</option>
                          </select>
                        </div>
                      </div>
                    )}
                    <div className="col-12 col-md-6">
                      <div className="sign__group">
                        <label className="sign__label" htmlFor="price">
                          {saleType !== "fix" ? "Starting Bid " : ""}Price - in "{paymentType}"
                        </label>
                        <input
                          id="price"
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          name="price"
                          className="sign__input"
                          placeholder=""
                        />

                        <label className="sign__label col-12 mt-1" htmlFor="price">
                          Price in USD: ${price * rate}
                        </label>

                        <label className="sign__label col-12" htmlFor="price">
                          current {paymentType} price: 1 {paymentType} = ${rate}
                        </label>
                      </div>
                    </div>
                  </>
                )}

                <div className="col-12">
                  <div className="sign__group filter__checkboxes mt-2">
                    <input
                      id="private-accept"
                      type="checkbox"
                      name="private-accept"
                      checked={isAccept}
                      onChange={() => {
                        setIsAccept(!isAccept);
                      }}
                    />
                    <label className="sign__label" htmlFor="private-accept">
                      I agree to the{" "}
                      <a href="assets/terms/Terms and Conditions for Purchasers.pdf" target="_blank" className="ml-1">
                        Terms and conditions
                      </a>
                    </label>
                  </div>
                  {isAccept && (
                    <button
                      type="button"
                      className="col-12 col-xl-3 sign__btn"
                      onClick={onCreateNFT}
                      disabled={isCreateProcess}
                    >
                      {isCreateProcess ? "Creating..." : "Create item"}
                    </button>
                  )}
                </div>
              </div>
            </form>
            {/* end create form */}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Create;
