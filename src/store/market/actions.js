/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import axios from "axios";

export default {
  async fetchMarketData({ commit, rootState }) {
    console.log("fetchMarketData action");
    //commit("setLoading", true, { root: true });
    const web3 = rootState.w3.instance();

    var listedTokenIds = await rootState.MKContract.methods
      .getListedTokens()
      .call({ from: rootState.w3.address });

    listedTokenIds = listedTokenIds.filter(token => token != 0);

    const BN = web3.utils.BN;
    const gasPrice = new BN(await web3.eth.getGasPrice());

    const promises = [];
    listedTokenIds.forEach(tokenId => {
      promises.push(
        new Promise(async resolve => {
          const uri = await rootState.CMContract.methods
            .tokenURI(tokenId)
            .call({ from: rootState.w3.address });
          const response = await axios.get(
            uri[0] === "h"
              ? uri
              : "https://morning-springs-53559.herokuapp.com/cryptomon/meta/" +
                  uri
          );

          // handle success
          const pokedex_number = parseInt(uri.split("/").pop(), 10);

          // get cryptomon price

          const priceWei = await rootState.MKContract.methods
            .getTokenPrice(tokenId)
            .call({ from: rootState.w3.address });
          const priceEth = web3.utils.fromWei(new BN(priceWei), "ether");
          // get estimated fees
          const estimatedBuyGas = await rootState.MKContract.methods
            .buyToken(tokenId)
            .estimateGas({ value: priceWei, from: rootState.w3.address });
          const estimatedBuyFees = new BN(estimatedBuyGas).mul(gasPrice);
          const feesEth = web3.utils.fromWei(estimatedBuyFees, "ether");
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
    //commit("setLoading", false, { root: true });
    console.log("end fetchMarketData action");
  },

  async buyToken({ rootState, state, commit, dispatch }, tokenId) {
    commit("setLoading", true, { root: true });
    const price = state.listedTokens.find(token => token.tokenId === tokenId)
      .priceWei;
    const options = { value: price, from: rootState.w3.address };
    await rootState.MKContract.methods.buyToken(tokenId).send(options);
    dispatch("wallet/getWallet", {}, { root: true });
    commit("setLoading", false, { root: true });
  },

  async registerEventCallbacks({ dispatch, rootState }) {
    rootState.MKContract.events.Sold({ fromBlock: "latest" }, function(
      error,
      _event
    ) {
      if (error) {
        console.log(error);
      }
      dispatch("fetchMarketData");
    });

    rootState.MKContract.events.Listed({ fromBlock: "latest" }, function(
      error,
      _event
    ) {
      if (error) {
        console.log(error);
      }
      dispatch("fetchMarketData");
    });
    rootState.MKContract.events.Unlisted({ fromBlock: "latest" }, function(
      error,
      _event
    ) {
      console.log("blablablabla");
      if (error) {
        console.log(error);
      }
      console.log(_event);
      dispatch("fetchMarketData");
    });
  }
};
