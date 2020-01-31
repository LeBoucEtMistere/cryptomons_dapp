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
      "0x6011906db65fE14f816d8a8aB85cA43E98437989",
    MarketContract:
      process.env.MARKET_ADDRESS || "0x88022ce5792aC24C74b2f63Bc3AD72812D10f24b"
  }
};
