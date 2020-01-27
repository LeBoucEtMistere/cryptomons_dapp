export const constants = {
  networks: {
    "1": "Main Net",
    "2": "Deprecated Morden test network",
    "3": "Ropsten test network",
    "4": "Rinkeby test network",
    "42": "Kovan test network",
    "4447": "Truffle Develop Network",
    "5777": "Ganache Blockchain"
  },
  addresses: {
    CryptomonContract:
      process.env.MARKET_ADDRESS ||
      "0x16375526bFCe11D263c96E3D99F60191a6c905a9",
    MarketContract:
      process.env.CRYPTOMON_ADDRESS ||
      "0x5bcA7C67Cf680647339af71ffe35C1305c645Be8"
  }
};
