/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import axios from "axios";

export default {
  async fetchMarketData({ commit, rootState }) {
    var listedTokenIds = await rootState.MKContract.methods
      .getListedTokens()
      .call({ from: rootState.w3.address });

    listedTokenIds = listedTokenIds.filter(token => token != 0);

    const promises = [];
    listedTokenIds.forEach(tokenId => {
      promises.push(
        new Promise(async resolve => {
          const uri = await rootState.CMContract.methods
            .tokenURI(tokenId)
            .call({ from: rootState.w3.address });
          const response = await axios.get(uri);

          // handle success
          const pokedex_number = parseInt(uri.split("/").pop(), 10);
          const web3 = rootState.w3.instance();
          // get cryptomon price
          const BN = web3.utils.BN;
          const priceWei = await rootState.MKContract.methods
            .getTokenPrice(tokenId)
            .call({ from: rootState.w3.address });
          const priceEth = web3.utils.fromWei(new BN(priceWei), "ether");
          // get estimated fees
          const estimatedBuyGas = await rootState.MKContract.methods
            .buyToken(tokenId)
            .estimateGas({ value: priceWei, from: rootState.w3.address });
          const estimatedBuyFees =
            estimatedBuyGas * (await web3.eth.getGasPrice());
          const feesEth = web3.utils.fromWei(new BN(estimatedBuyFees), "ether");
          // construct object
          const obj = {
            ...response.data,
            price: parseFloat(priceEth, 10),
            priceWei: priceWei,
            estimatedFeesWei: estimatedBuyFees,
            estimatedFees: parseFloat(feesEth, 10),
            image_url: `https://morning-springs-53559.herokuapp.com/cryptomon/images/${pokedex_number}.png`,
            pokedex_number: pokedex_number,
            tokenId: parseInt(tokenId, 10)
          };
          resolve(obj);
        })
      );
    });
    const listedTokens = await Promise.all(promises);
    commit("setMarketData", listedTokens);
  },

  async buyToken({ rootState, state }, tokenId) {
    const price = state.listedTokens.find(token => token.tokenId === tokenId)
      .priceWei;
    const options = { value: price, from: rootState.w3.address };
    await rootState.MKContract.methods.buyToken(tokenId).send(options);
  },

  async registerEventCallbacks({ dispatch, rootState }) {
    rootState.MKContract.events.Sold(function(error, _event) {
      if (error) {
        console.log(error);
      }
      dispatch("wallet/getWallet", {}, { root: true });
      dispatch("fetchMarketData");
    });

    rootState.MKContract.events.Listed(function(error, _event) {
      if (error) {
        console.log(error);
      }
      const web3 = rootState.w3.instance();
      if (
        _event.returnValues._by ==
        web3.utils.toChecksumAddress(rootState.w3.address)
      ) {
        dispatch("wallet/getWallet", {}, { root: true });
      }
      dispatch("fetchMarketData");
    });
    rootState.MKContract.events.Unlisted(function(error, _event) {
      if (error) {
        console.log(error);
      }
      const web3 = rootState.w3.instance();
      if (
        _event.returnValues._by ==
        web3.utils.toChecksumAddress(rootState.w3.address)
      ) {
        dispatch("wallet/getWallet", {}, { root: true });
      }
      dispatch("fetchMarketData");
    });
  }
};
