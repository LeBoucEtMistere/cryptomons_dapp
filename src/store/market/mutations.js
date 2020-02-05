export default {
  //tokens
  clearTokens(state) {
    state.listedTokens = [];
  },
  addToken(state, payload) {
    state.listedTokens.push(payload);
  },
  removeToken(state, payload) {
    state.listedTokens = state.listedTokens.filter(
      token => token.tokenId !== payload
    );
  },

  // token Ids
  addTokenId(state, payload) {
    state.listedTokenIds.add(payload);
  },
  removeTokenId(state, payload) {
    state.listedTokenIds.delete(payload);
  },
  clearTokenIds(state) {
    state.listedTokenIds.clear();
  },

  // diff
  setDiffAdd(state, payload) {
    state.listedTokenIdsToAdd = payload;
  },
  setDiffRemove(state, payload) {
    state.listedTokenIdsToRemove = payload;
  },
  clearDiffs(state) {
    state.listedTokenIdsToAdd = new Set();
    state.listedTokenIdsToRemove = new Set();
  },

  // loading tokens
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

  // new content
  setNewContentAvailable(state) {
    state.newContentAvailable = true;
  },
  unsetNewContentAvailable(state) {
    state.newContentAvailable = false;
  }
};
