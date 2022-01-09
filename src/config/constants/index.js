// //TODO:  bsc testnet network
// export const NFT_ADDRESS = "0x92FeDD40653409064bBAD981F88D7918693DDEd6";
// export const NFT_MARKET_ADDRESS = "0x6511E91cC7C71dEc6Ec029087C44f384F3eAD483";

// bsc new - Jan 09th
export const NFT_ADDRESS = "0xDacf70474aAA681F749A1539feDad98Ca761797C";
export const NFT_MARKET_ADDRESS = "0x092d8687F22FDDE0bceED51A5A7359fdF00E0CF3";

export const NFTStorageKey = process.env.REACT_APP_NFT_STORAGE_KEY;

export const Networks = {
  BSC: 56,
  BSCTestnet: 97,
};

export const PAYMENT_LIST = [
  { name: "FTM", value: "FTM" },
  { name: "Dark Matter Defi", value: "DMD" },
];

export const DEFAULT_NETWORK = {
  chainId: 97,
  jsonRpcProviderUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/",
};
export const DEFAULT_AVATAR = "/assets/img/avatars/avatar.jpg";
export const DEFAULT_COVER_IMAGE = "/assets/img/bg/bg.png";
export const DEFAULT_NICKNAME = "@user";
export const MAX_LIMIT_FOR_FTM = 200;
export const MAX_LIMIT_FOR_TOKEN = 10000;
// export const NFT_CNT_PER_PAGE = 15;
export const NFT_CNT_PER_PAGE = 5;
export const MAX_TIMESTAMP = 10000000000000;
export const MAX_LIKES_CNT = 1000000;
