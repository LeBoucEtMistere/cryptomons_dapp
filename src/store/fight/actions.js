import axios from "axios";

export default {
  async getTokens({ rootState, commit, dispatch }) {
    //commit("setLoading", true, { root: true });
    const CMC = rootState.CMContract;

    const balance = await CMC.methods
      .totalSupply()
      .call({ from: rootState.w3.address });

    const promises = [];
    for (var i = 0; i < balance; i++) {
      promises.push(
        CMC.methods.tokenByIndex(i).call({ from: rootState.w3.address })
      );
    }
    const tokenIds = await Promise.all(promises);

    const promises2 = [];
    tokenIds.forEach(tokenId => {
      promises2.push(
        new Promise(async resolve => {
          const uri = await CMC.methods
            .tokenURI(tokenId)
            .call({ from: rootState.w3.address });
          const response = await axios.get(
            uri[0] === "h"
              ? uri
              : "https://morning-springs-53559.herokuapp.com/cryptomon/meta/" +
                  uri
          );

          const owner = await CMC.methods
            .ownerOf(tokenId)
            .call({ from: rootState.w3.address });

          // handle success
          const pokedex_number = parseInt(uri.split("/").pop(), 10);
          const obj = {
            ...response.data,
            owner: owner,
            image_url: `https://morning-springs-53559.herokuapp.com/cryptomon/images/${pokedex_number}.png`,
            pokedex_number: pokedex_number,
            tokenId: parseInt(tokenId, 10)
          };
          resolve(obj);
        })
      );
    });

    const cryptomons_metadata = await Promise.all(promises2);

    const listedTokens = await rootState.MKContract.methods
      .getListedTokens()
      .call({ from: rootState.w3.address });

    const buildedList = cryptomons_metadata.filter(token => {
      return (
        token.owner.toLowerCase() !== rootState.w3.address &&
        !listedTokens.includes(token.tokenId.toString()) &&
        token.owner.toLowerCase() !== rootState.MKContract.address
      );
    });

    commit("setTokens", buildedList);
    dispatch("getBreedingTokens");
    //commit("setLoading", false, { root: true });
  },

  async getBreedingTokens({ commit, rootState }) {
    //commit("setLoading", true, { root: true });

    const options = { from: rootState.w3.address };
    const breedingTokens = (
      await rootState.CMContract.methods.getBreedingTokens().call(options)
    ).map(token => parseInt(token, 10));
    const promises = [];
    breedingTokens.forEach(token => {
      promises.push(
        new Promise(async resolve => {
          const p = await rootState.CMContract.methods
            .hasHatched(token)
            .call(options);
          resolve({ tokenId: token, hatched: p });
        })
      );
    });

    const r = await Promise.all(promises);
    const final = breedingTokens.filter(token =>
      r.some(e => e.tokenId === token && !e.hatched)
    );
    commit("setBreedingTokens", final);
    //commit("setLoading", false, { root: true });
  },

  async fight({ rootState, commit }, args) {
    commit("setFighted", false);
    const options = { from: rootState.w3.address };
    const result = await rootState.CMContract.methods
      .fight(args.attacker, args.defender)
      .send(options);
    commit("setLastFight", result.events.Fighted.returnValues.win);
    commit("setFighted", true);
  }
};
