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
      "0xca58a89D3A1c68526d97DBDa167bc9f0c08D4019",
    MarketContract:
      process.env.CRYPTOMON_ADDRESS ||
      "0x52F032bED4f1DD6e2333Dd068Df0b8078F88BA38"
  }
};
