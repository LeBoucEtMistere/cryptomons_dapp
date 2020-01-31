/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

export default {
  async registerEventCallbacks({ dispatch, rootState }) {
    rootState.CMContract.events.Breeding(function(error, _event) {
      if (error) {
        console.log(error);
      }
      console.log(_event);
    });

    rootState.CMContract.events.Hatched(function(error, _event) {
      if (error) {
        console.log(error);
      }
      console.log(_event);
    });
    rootState.CMContract.events.Interrupted(function(error, _event) {
      if (error) {
        console.log(error);
      }
      console.log(_event);
    });
  },
  async getBreedingTokens({ commit, rootState }) {
    //commit("setLoading", true, { root: true });

    const options = { from: rootState.w3.address };
    const tokens = (
      await rootState.CMContract.methods.getBreedingTokens().call(options)
    ).map(token => parseInt(token, 10));
    const myTokens = rootState.wallet.wallet.map(token => token.tokenId);

    const filtered = tokens.filter(token => {
      return myTokens.includes(token);
    });
    commit(
      "setBreedingTokens",
      filtered.map(token => parseInt(token, 10))
    );
    //commit("setLoading", false, { root: true });
  },

  async breed({ commit, dispatch, rootState }, cms) {
    console.log("breed action");
    commit("setLoading", true, { root: true });

    const options = { from: rootState.w3.address };
    await rootState.CMContract.methods.breed(cms[0], cms[1]).send(options);
    dispatch("getBreedingTokens");
    commit("setLoading", false, { root: true });
    dispatch("hasHatched", cms);
  },

  async hatch({ rootState, dispatch, commit }, cms) {
    console.log("hatch action");
    commit("setLoading", true, { root: true });
    const options = { from: rootState.w3.address };
    const tx = await rootState.CMContract.methods
      .hatch(cms[0], cms[1])
      .send(options);
    console.log(tx);
    console.log(tx.events);
    console.log(tx.events.Transfer);
    console.log(tx.events[0]);
    console.log(tx.events[1]);
    console.log(tx.events.Transfer.returnValues);
    await dispatch("wallet/getWallet", {}, { root: true });
    commit("hatched", []);
    commit("setBreedingTokens", []);
    commit("setLoading", false, { root: true });
    commit("parent1", cms[0]);
    commit("parent2", cms[1]);
    commit("child", parseInt(tx.events.Transfer.returnValues.tokenId, 10));
    commit("showHatchDialog", true);
  },
  async hasHatched({ dispatch, rootState, commit }, cms) {
    setTimeout(async () => {
      const options = { from: rootState.w3.address };
      const v = await rootState.CMContract.methods
        .hasHatched(cms[0], cms[1])
        .call(options);
      console.log(v);
      if (!v) {
        dispatch("hasHatched", cms);
      } else {
        commit("hatched", cms);
      }
    }, 1000);
  },
  async resetHatchDialog({ commit }) {
    commit("parent1", null);
    commit("parent2", null);
    commit("child", null);
    commit("showHatchDialog", false);
  }
};
