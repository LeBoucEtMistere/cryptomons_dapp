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
      "0x7b9d24F4e106ed56879bb8B72E995F09Ad0BA38B",
    MarketContract:
      process.env.MARKET_ADDRESS || "0x3683C7a0F27080d7697ed9011D266f9ae4eBc20C"
  }
};
