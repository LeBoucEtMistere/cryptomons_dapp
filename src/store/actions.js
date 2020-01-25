/* eslint-disable no-console */

export default {
  registerCMContract({ commit, dispatch, state }, payload) {
    console.log("registerCMContract Action being executed");
    const web3 = state.w3.instance();
    console.log(web3.eth.defaultAddress);
    var instance = new web3.eth.Contract(payload.json.abi, payload.address);
    commit("registerCMContractMut", instance);
    dispatch("checkAdmin");
  },
  registerMKContract({ commit, state }, payload) {
    console.log("registerMKContract Action being executed");
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
  }
};
