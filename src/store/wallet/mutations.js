/* eslint-disable no-console */
export default {
  clearWallet(state) {
    state.wallet = [];
  },
  addToken(state, payload) {
    state.wallet.push(payload);
  },
  addTokenId(state, payload) {
    state.tokenIds.add(payload);
  },
  clearTokenIds(state) {
    state.tokenIds.clear();
  },
  markTokenAsListed(state, payload) {
    state.listedTokenIds.push(payload);
  },
  clearListedTokenIds(state) {
    state.listedTokenIds = [];
  },
  setTokenLoading(state, payload) {
    state.loadingTokenIds.push(payload);
  },
  unsetTokenLoading(state, payload) {
    var index = state.loadingTokenIds.indexOf(payload);
    if (index !== -1) state.loadingTokenIds.splice(index, 1);
  },
  clearLoadingTokenIds(state) {
    state.loadingTokenIds = [];
  }
};
