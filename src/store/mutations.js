/* eslint-disable no-console */
export default {
  registerCMContractMut(state, payload) {
    state.CMContract = payload;
  },
  isAdmin(state, payload) {
    state.isAdmin = payload;
  },
  registerMKContractMut(state, payload) {
    state.MKContract = payload;
  },
  setLoading(state, payload) {
    state.isLoading = payload;
  }
};
