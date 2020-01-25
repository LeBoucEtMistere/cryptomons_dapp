/* eslint-disable no-console */
export default {
  setCMBalance(state, payload) {
    state.balance = parseInt(payload, 10);
  },
  setTokenIds(state, payload) {
    state.tokenIds = payload;
  },
  setWallet(state, payload) {
    console.log("setting wallet");
    state.wallet = payload;
  },
  markListed(state, payload) {
    if (state.wallet.length > 0) {
      const tab = state.wallet.filter(token => token.tokenId == payload);
      if (tab.length == 1) {
        tab[0].isListed = true;
      }
    }
  }
};
