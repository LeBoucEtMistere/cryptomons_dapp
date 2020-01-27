/* eslint-disable no-console */
export default {
  registerCMContractMut(state, payload) {
    console.log("CMContract registered properly");
    state.CMContract = payload;
  },
  isAdmin(state, payload) {
    state.isAdmin = payload;
  },
  registerMKContractMut(state, payload) {
    console.log("MKContract registered properly");
    state.MKContract = payload;
  },
  setLoading(state, payload) {
    state.isLoading = payload;
  }
};
