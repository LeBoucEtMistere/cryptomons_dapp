/* eslint-disable no-console */
export default {
  clearTokens(state) {
    state.wallet = [];
  },
  addToken(state, payload) {
    state.wallet.push(payload);
  },
  removeToken(state, payload) {
    state.wallet = state.wallet.filter(token => token.tokenId !== payload);
  },
  addTokenId(state, payload) {
    state.tokenIds.add(payload);
  },
  removeTokenId(state, payload) {
    state.tokenIds.delete(payload);
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
  },
  // diff
  setDiffAdd(state, payload) {
    state.tokenIdsToAdd = payload;
  },
  setDiffRemove(state, payload) {
    state.tokenIdsToRemove = payload;
  },
  clearDiffs(state) {
    state.tokenIdsToAdd = new Set();
    state.tokenIdsToRemove = new Set();
  }
};
