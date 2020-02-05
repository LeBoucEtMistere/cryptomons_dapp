/* eslint-disable no-console */

import axios from "axios";

export default {
  async initWallet({ dispatch, commit }) {
    commit("clearTokenIds");
    commit("clearListedTokenIds");
    commit("clearLoadingTokenIds");
    commit("clearWallet");
    await dispatch("syncTokenIds");
    await dispatch("syncTokensMetadata");
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
        dispatch("getWallet");
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
      dispatch("syncListedTokens");
    } catch (error) {
      if (error.code !== 4001) console.log(error);
    } finally {
      commit("unsetTokenLoading", payload.tokenId);
    }
  },
  async syncTokenIds({ rootState, commit }) {
    const CMC = rootState.CMContract;
    const balance = await CMC.methods
      .balanceOf(rootState.w3.address)
      .call({ from: rootState.w3.address });

    commit("clearTokenIds");

    for (var i = 0; i < balance; i++) {
      const id = await CMC.methods
        .tokenOfOwnerByIndex(rootState.w3.address, i)
        .call({ from: rootState.w3.address });
      commit("addTokenId", parseInt(id, 10));
    }
  },
  async syncTokensMetadata({ dispatch, state }) {
    for (const tokenId of state.tokenIds) {
      dispatch("syncTokenMetadata", tokenId);
    }
  },

  async syncTokenMetadata({ rootState, commit }, tokenId) {
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
  }
};
