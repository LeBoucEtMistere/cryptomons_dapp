/* eslint-disable no-console */

export default {
  registerCMContract({ commit, dispatch, state }, payload) {
    const web3 = state.w3.instance();
    var instance = new web3.eth.Contract(payload.json.abi, payload.address);
    commit("registerCMContractMut", instance);
    dispatch("checkAdmin");
  },
  registerMKContract({ commit, state }, payload) {
    const web3 = state.w3.instance();
    var instance = new web3.eth.Contract(payload.json.abi, payload.address);
    commit("registerMKContractMut", instance);
  },
  checkAdmin({ commit, state }) {
    if (state.CMContract && state.w3.address) {
      const CMC = state.CMContract;
      CMC.methods
        .isOwner()
        .call({ from: state.w3.address })
        .then(isOwner => {
          commit("isAdmin", isOwner);
        });
    }
  },
  mintToken({ state }, payload) {
    state.CMContract.methods
      .createCryptomon(
        payload.to,
        payload.uri,
        state.w3.instance().utils.toWei(payload.price.toString(), "ether")
      )
      .send({
        from: state.w3.address
      });
  },
  setLoading({ commit }, payload) {
    commit("setLoading", payload);
  }
};
