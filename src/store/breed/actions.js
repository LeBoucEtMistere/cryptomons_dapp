/* eslint-disable no-unused-vars */
/* eslint-disable no-console */

export default {
  async registerEventCallbacks({ rootState }) {
    rootState.CMContract.events.Breeding(function(error, _event) {
      if (error) {
        console.log(error);
      }
      //console.log(_event);
    });

    rootState.CMContract.events.Hatched(function(error, _event) {
      if (error) {
        console.log(error);
      }
      //console.log(_event);
    });
    rootState.CMContract.events.Interrupted(function(error, _event) {
      if (error) {
        console.log(error);
      }
      //console.log(_event);
    });
  },
  async getBreedingTokens({ commit, rootState }) {
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
  },

  async breed({ dispatch, rootState, commit }, cms) {
    try {
      commit("wallet/setTokenLoading", cms[0], { root: true });
      commit("wallet/setTokenLoading", cms[1], { root: true });
      const options = { from: rootState.w3.address };
      await rootState.CMContract.methods.breed(cms[0], cms[1]).send(options);
      dispatch("getBreedingTokens");
      dispatch("hasHatched", cms);
    } catch (error) {
      if (error.code !== 4001) console.log(error);
    } finally {
      commit("wallet/unsetTokenLoading", cms[0], { root: true });
      commit("wallet/unsetTokenLoading", cms[1], { root: true });
    }
  },

  async hatch({ rootState, dispatch, commit }, cms) {
    try {
      commit("wallet/setTokenLoading", cms[0], { root: true });
      commit("wallet/setTokenLoading", cms[1], { root: true });
      const options = { from: rootState.w3.address };
      const tx = await rootState.CMContract.methods
        .hatch(cms[0], cms[1])
        .send(options);
      await dispatch("wallet/refreshWallet", {}, { root: true });
      commit("hatched", []);
      commit("setBreedingTokens", []);
      commit("parent1", cms[0]);
      commit("parent2", cms[1]);
      commit("child", parseInt(tx.events.Transfer.returnValues.tokenId, 10));
      commit("showHatchDialog", true);
    } catch (error) {
      if (error.code !== 4001) console.log(error);
    } finally {
      commit("wallet/unsetTokenLoading", cms[0], { root: true });
      commit("wallet/unsetTokenLoading", cms[1], { root: true });
    }
  },
  async hasHatched({ dispatch, rootState, commit }, cms) {
    setTimeout(async () => {
      const options = { from: rootState.w3.address };
      const v = await rootState.CMContract.methods
        .hasHatched(cms[0], cms[1])
        .call(options);
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
