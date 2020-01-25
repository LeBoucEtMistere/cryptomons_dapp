/* eslint-disable no-console */

import axios from "axios";

export default {
  async getWallet({ commit, state, rootState }) {
    console.log("getWallet Action being executed");
    const CMC = rootState.CMContract;
    const builded_wallet = [];

    const balance = await CMC.methods
      .balanceOf(rootState.w3.address)
      .call({ from: rootState.w3.address });

    commit("setCMBalance", balance);

    const promises = [];
    for (var i = 0; i < state.balance; i++) {
      promises.push(
        CMC.methods
          .tokenOfOwnerByIndex(rootState.w3.address, i)
          .call({ from: rootState.w3.address })
      );
    }
    const tokenIds = await Promise.all(promises);

    const promises2 = [];
    tokenIds.forEach(tokenId => {
      promises2.push(
        new Promise(async resolve => {
          const uri = await CMC.methods
            .tokenURI(tokenId)
            .call({ from: rootState.w3.address });
          const response = await axios.get(uri);

          // handle success
          const pokedex_number = parseInt(uri.split("/").pop(), 10);
          const obj = {
            ...response.data,
            image_url: `https://morning-springs-53559.herokuapp.com/cryptomon/images/${pokedex_number}.png`,
            pokedex_number: pokedex_number,
            tokenId: parseInt(tokenId, 10)
          };
          resolve(obj);
        })
      );
    });

    const cryptomons_metadata = await Promise.all(promises2);

    const listedTokens = await rootState.MKContract.methods
      .getListedTokens()
      .call({ from: rootState.w3.address });

    cryptomons_metadata.forEach(token => {
      builded_wallet.push({
        ...token,
        isListed: listedTokens.includes(token.tokenId.toString())
      });
    });
    commit("setWallet", builded_wallet);
  },
  async transferToken({ dispatch, rootState }, payload) {
    console.log(payload);
    const web3 = rootState.w3.instance();
    if (web3.utils.isAddress(payload.to)) {
      await rootState.CMContract.methods
        .safeTransferFrom(rootState.w3.address, payload.to, payload.tokenId)
        .send({ from: rootState.w3.address });
      dispatch("getWallet");
    } else {
      console.log("Trying to transfer to invalid ETh address");
    }
  },
  async listToken({ rootState }, payload) {
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
    } catch (error) {
      console.log(error);
    }
  }
};
