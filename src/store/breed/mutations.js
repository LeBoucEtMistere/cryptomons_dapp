export default {
  setBreedingTokens(state, payload) {
    state.breedingTokens = payload;
  },
  hatched(state, payload) {
    state.lastHatched = payload;
    state.breedingTokens = [];
  },
  parent1(state, payload) {
    state.parent1 = payload;
  },
  parent2(state, payload) {
    state.parent2 = payload;
  },
  child(state, payload) {
    state.child = payload;
  },
  showHatchDialog(state, payload) {
    state.showHatchDialog = payload;
  }
};
