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
      "0xA5e98727aB7dA671de2001aFD5084aAd1ef0d389",
    MarketContract:
      process.env.CRYPTOMON_ADDRESS ||
      "0x2b7e943d3c44827cEd916685EAD34bda68F4E800"
  }
};
