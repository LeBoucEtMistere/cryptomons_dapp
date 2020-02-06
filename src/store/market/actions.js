/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
import axios from "axios";

export default {
  async buyToken({ rootState, state, commit, dispatch }, tokenId) {
    try {
      commit("setTokenLoading", tokenId);
      const price = state.listedTokens.find(token => token.tokenId === tokenId)
        .priceWei;
      const options = { value: price, from: rootState.w3.address };
      await rootState.MKContract.methods.buyToken(tokenId).send(options);
      dispatch("wallet/refreshWallet", {}, { root: true });
      dispatch("refreshMarket");
    } catch (error) {
      if (error.code !== 4001) console.log(error);
    } finally {
      commit("unsetTokenLoading", tokenId);
    }
  },

  async registerEventCallbacks({ rootState, commit }) {
    rootState.MKContract.events.Sold({ fromBlock: "latest" }, function(
      error,
      _event
    ) {
      if (error) {
        console.log(error);
      }
      commit("setNewContentAvailable");
    });

    rootState.MKContract.events.Listed({ fromBlock: "latest" }, function(
      error,
      _event
    ) {
      if (error) {
        console.log(error);
      }
      commit("setNewContentAvailable");
    });
    rootState.MKContract.events.Unlisted({ fromBlock: "latest" }, function(
      error,
      _event
    ) {
      if (error) {
        console.log(error);
      }
      //console.log(_event);
      commit("setNewContentAvailable");
    });
  },

  async initMarket({ dispatch, commit }) {
    commit("clearTokenIds");
    commit("clearLoadingTokenIds");
    commit("clearDiffs");
    commit("clearTokens");
    commit("unsetNewContentAvailable");
    await dispatch("syncTokenIdsDiff");
    await dispatch("syncTokens");
  },
  async refreshMarket({ dispatch, commit }) {
    commit("clearDiffs");
    commit("unsetNewContentAvailable");
    await dispatch("syncTokenIdsDiff");
    await dispatch("syncTokens");
  },

  async syncTokenIdsDiff({ rootState, commit, state }) {
    const listedTokenIds = new Set(
      (
        await rootState.MKContract.methods
          .getListedTokens()
          .call({ from: rootState.w3.address })
      ).map(tokenId => parseInt(tokenId, 10))
    );

    const toRemove = new Set(
      [...state.listedTokenIds].filter(x => !listedTokenIds.has(x))
    );

    commit("setDiffRemove", toRemove);

    const toAdd = new Set(
      [...listedTokenIds].filter(x => !state.listedTokenIds.has(x))
    );

    commit("setDiffAdd", toAdd);
  },
  async syncTokens({ dispatch, state, rootState, commit }) {
    const web3 = rootState.w3.instance();
    const BN = web3.utils.BN;
    const gasPrice = new BN(await web3.eth.getGasPrice());

    for (let tokenId of state.listedTokenIdsToRemove) {
      commit("removeToken", tokenId);
      commit("removeTokenId", tokenId);
    }

    for (let tokenId of state.listedTokenIdsToAdd) {
      dispatch("loadToken", { tokenId, gasPrice, BN, web3 });
      commit("addTokenId", tokenId);
    }

    commit("clearDiffs");
  },

  async loadToken({ rootState, commit }, { tokenId, gasPrice, BN, web3 }) {
    // fetch metadata URI
    const uri = await rootState.CMContract.methods
      .tokenURI(tokenId)
      .call({ from: rootState.w3.address });
    const response = await axios.get(
      uri[0] === "h"
        ? uri
        : "https://morning-springs-53559.herokuapp.com/cryptomon/meta/" + uri
    );
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

    commit("addToken", obj);
  }
};
