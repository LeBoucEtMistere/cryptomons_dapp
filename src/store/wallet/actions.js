/* eslint-disable no-console */

import axios from "axios";

export default {
  async initWallet({ dispatch, commit }) {
    commit("clearTokenIds");
    commit("clearDiffs");
    commit("clearListedTokenIds");
    commit("clearLoadingTokenIds");
    commit("clearTokens");
    await dispatch("syncTokenIdsDiff");
    await dispatch("syncTokens");
    await dispatch("syncListedTokens");
  },
  async refreshWallet({ dispatch, commit }) {
    commit("clearDiffs");
    await dispatch("syncTokenIdsDiff");
    await dispatch("syncTokens");
    await dispatch("syncListedTokens");
  },
  async transferToken({ dispatch, rootState, commit }, payload) {
    commit("setTokenLoading", payload.tokenId);
    const web3 = rootState.w3.instance();
    if (web3.utils.isAddress(payload.to)) {
      try {
        await rootState.CMContract.methods
          .safeTransferFrom(rootState.w3.address, payload.to, payload.tokenId)
          .send({ from: rootState.w3.address });
        dispatch("syncListedTokens");
      } catch (error) {
        if (error.code !== 4001) console.log(error);
      } finally {
        commit("unsetTokenLoading", payload.tokenId);
      }
    } else {
      console.log("Trying to transfer to invalid ETh address");
    }
  },
  async listToken({ rootState, dispatch, commit }, payload) {
    commit("setTokenLoading", payload.tokenId);
    const web3 = rootState.w3.instance();
    const price = web3.utils.toWei(payload.price, "ether");
    try {
      await rootState.CMContract.methods
        .approve(rootState.MKContract._address, payload.tokenId)
        .send({ from: rootState.w3.address });
      await rootState.MKContract.methods
        .listToken(payload.tokenId, price)
        .send({
          from: rootState.w3.address,
          gasLimit: 1000000
        });
      dispatch("syncListedTokens");
    } catch (error) {
      if (error.code !== 4001) console.log(error);
    } finally {
      commit("unsetTokenLoading", payload.tokenId);
    }
  },
  async unlistToken({ rootState, dispatch, commit }, payload) {
    try {
      commit("setTokenLoading", payload.tokenId);
      await rootState.MKContract.methods.unlistToken(payload.tokenId).send({
        from: rootState.w3.address,
        gasLimit: 1000000
      });
      // unapprove market on token
      await rootState.CMContract.methods
        .approve("0x0000000000000000000000000000000000000000", payload.tokenId)
        .send({ from: rootState.w3.address });
      dispatch("syncListedTokens");
    } catch (error) {
      if (error.code !== 4001) console.log(error);
    } finally {
      commit("unsetTokenLoading", payload.tokenId);
    }
  },

  async syncListedTokens({ rootState, commit, state }) {
    const listedTokens = (
      await rootState.MKContract.methods
        .getListedTokens()
        .call({ from: rootState.w3.address })
    ).map(tokenId => parseInt(tokenId, 10));
    const toAdd = new Set([...listedTokens].filter(x => state.tokenIds.has(x)));
    commit("clearListedTokenIds");
    toAdd.forEach(tokenId => {
      commit("markTokenAsListed", tokenId);
    });
  },

  async syncTokenIdsDiff({ rootState, commit, state }) {
    const balance = await rootState.CMContract.methods
      .balanceOf(rootState.w3.address)
      .call({ from: rootState.w3.address });

    const tokenIds = new Set();

    for (var i = 0; i < balance; i++) {
      const id = await rootState.CMContract.methods
        .tokenOfOwnerByIndex(rootState.w3.address, i)
        .call({ from: rootState.w3.address });
      tokenIds.add(parseInt(id, 10));
    }

    const toRemove = new Set([...state.tokenIds].filter(x => !tokenIds.has(x)));

    commit("setDiffRemove", toRemove);

    const toAdd = new Set([...tokenIds].filter(x => !state.tokenIds.has(x)));

    commit("setDiffAdd", toAdd);
  },
  async syncTokens({ dispatch, state, commit }) {
    for (let tokenId of state.tokenIdsToRemove) {
      commit("removeToken", tokenId);
      commit("removeTokenId", tokenId);
    }

    for (let tokenId of state.tokenIdsToAdd) {
      dispatch("loadToken", tokenId);
      commit("addTokenId", tokenId);
    }

    commit("clearDiffs");
  },

  async loadToken({ rootState, commit }, tokenId) {
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

    // construct the token object
    const obj = {
      ...response.data,
      image_url: `https://morning-springs-53559.herokuapp.com/cryptomon/images/${pokedex_number}.png`,
      pokedex_number: pokedex_number,
      tokenId: tokenId
    };

    commit("addToken", obj);
  }
};
