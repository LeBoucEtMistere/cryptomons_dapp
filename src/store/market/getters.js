export default {
  getListedTokens: state => {
    let sorted = state.listedTokens.sort(
      (a, b) => a.pokedex_number - b.pokedex_number
    );
    return sorted;
  },
  getLoadingTokenIds(state) {
    return state.loadingTokenIds;
  },
  newContentAvailable: state => state.newContentAvailable
};
