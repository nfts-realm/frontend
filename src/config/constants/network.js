export const BSC_TESTNET_PARAMS = {
  chainId: "0x61",
  chainName: "BSC Testnet C-Chain",
  nativeCurrency: {
    name: "Binance Coin",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
  blockExplorerUrls: ["https://explorer.binance.org/smart-testnet"],
};

export const BSC_MAINNET_PARAMS = {
  chainId: "0x38",
  chainName: "BSC Mainnet C-Chain",
  nativeCurrency: {
    name: "Binance Coin",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: ["https://bsc-dataseed1.ninicoin.io"],
  blockExplorerUrls: ["https://bscscan.com/"],
};

export const FTM_TESTNET_PARAMS = {
  chainId: "0x0fa2",
  chainName: "Fantom Testnet C-Chain",
  nativeCurrency: {
    name: "Fantom Coin",
    symbol: "FTM",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.testnet.fantom.network/"],
  blockExplorerUrls: ["https://bscscan.com/"],
};

export const FTM_MAINNET_PARAMS = {
  chainId: "0xfa",
  chainName: "Fantom Mainnet C-Chain",
  nativeCurrency: {
    name: "Fantom Coin",
    symbol: "FTM",
    decimals: 18,
  },
  rpcUrls: ["https://rpc.ftm.tools"],
  blockExplorerUrls: ["https://ftmscan.com"],
};
