/* eslint-disable no-console */
export default {
  getWallet(state) {
    let sorted = state.wallet.sort(
      (a, b) => a.pokedex_number - b.pokedex_number
    );
    return sorted;
  },
  getListedTokenIds(state) {
    return state.listedTokenIds;
  },
  getLoadingTokenIds(state) {
    return state.loadingTokenIds;
  }
};
