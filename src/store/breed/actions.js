/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

export default {
  async registerEventCallbacks({ dispatch, rootState }) {
    rootState.CMContract.events.Breeding(function(error, _event) {
      if (error) {
        console.log(error);
      }
      console.log(_event);
      dispatch("getBreedingTokens");
    });

    rootState.CMContract.events.Hatched(function(error, _event) {
      if (error) {
        console.log(error);
      }
    });
    rootState.CMContract.events.Interrupted(function(error, _event) {
      if (error) {
        console.log(error);
      }
    });
  },
  async getBreedingTokens({ dispatch, commit, rootState }) {
    commit("setLoading", true, { root: true });

    const options = { from: rootState.w3.address };
    const tokens = await rootState.CMContract.methods
      .getBreedingTokens()
      .call(options);
    commit(
      "setBreedingTokens",
      tokens.map(token => parseInt(token, 10))
    );
    commit("setLoading", false, { root: true });
  },

  async breed({ commit, dispatch, rootState }, cms) {
    commit("setLoading", true, { root: true });

    const options = { from: rootState.w3.address };
    await rootState.CMContract.methods.breed(cms[0], cms[1]).send(options);
    dispatch("getBreedingTokens");
    commit("setLoading", false, { root: true });
    dispatch("hasHatched", cms);
  },

  async hatch({ rootState, dispatch, commit }, cms) {
    const options = { from: rootState.w3.address };
    await rootState.CMContract.methods.hatch(cms[0], cms[1]).send(options);
    dispatch("wallet/getWallet", {}, { root: true });
    commit("hatched", []);
    commit("setBreedingTokens", []);
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
  }
};
