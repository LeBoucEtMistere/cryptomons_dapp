export default {
  setTokens(state, payload) {
    state.tokens = payload;
  },
  setBreedingTokens(state, payload) {
    state.breedingTokens = payload;
  },
  setLastFight(state, payload) {
    state.lastFight = payload;
  },
  setFighted(state, payload) {
    state.fighted = payload;
  }
};
