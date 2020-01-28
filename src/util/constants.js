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
      "0xd857760B7850224b81f5a7903c31AD8D183F1061",
    MarketContract:
      process.env.CRYPTOMON_ADDRESS ||
      "0x3AF5026400d38e40D534795c24175312D7AEcFa9"
  }
};
