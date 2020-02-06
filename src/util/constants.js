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
      "0xC5986E7BDEbc2B1007cd713ba8d3526a21247684",
    MarketContract:
      process.env.MARKET_ADDRESS || "0x7aD154D3291f2A3620597e9e628F7A60c18bD6b4"
  }
};
