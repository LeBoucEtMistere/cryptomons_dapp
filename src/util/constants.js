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
      "0xC6CCA2A11EF4D954CbaADD03e0AEca35c9C1626B",
    MarketContract:
      process.env.CRYPTOMON_ADDRESS ||
      "0x84d31b68d0745F19BbBf731549DEafFCBA9886E2"
  }
};
