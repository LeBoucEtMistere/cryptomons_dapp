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
      "0xB75BD31D13FdFd59A1B16eE2062C196ec6db2dA0",
    MarketContract:
      process.env.CRYPTOMON_ADDRESS ||
      "0xdF12D74863C7920aFacD8EA6dE9ead5Fd84db708"
  }
};
