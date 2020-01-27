export default {
  setBreedingTokens(state, payload) {
    state.breedingTokens = payload;
  },
  hatched(state, payload) {
    state.lastHatched = payload;
    state.breedingTokens = [];
  }
};
