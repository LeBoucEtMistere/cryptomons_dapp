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
      "0xA74a9678e59D390535a982B5986dD6f1c3fa3806",
    MarketContract:
      process.env.CRYPTOMON_ADDRESS ||
      "0x6514D1908D5598E81F11827cdd00Ea768e660b22"
  }
};
