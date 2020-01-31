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
      "0x259b38813Be0A7e6468EC0b5ECC4328dC822107E",
    MarketContract:
      process.env.MARKET_ADDRESS || "0xd5C9Ea1245524f3Be7925256916399498e93E43F"
  }
};
