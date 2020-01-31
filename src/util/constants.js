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
      process.env.CRYPTOMON_ADDRESS ||
      "0xe98437C0E30852624Ab355a14De5dF5F408b4A10",
    MarketContract:
      process.env.MARKET_ADDRESS || "0x95448469865e1fA161b2906E01a5fA57E4D2618E"
  }
};
