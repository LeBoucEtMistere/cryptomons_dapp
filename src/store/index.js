/* eslint-disable no-console */
import Vue from "vue";
import Vuex from "vuex";

import state from "./state";
import mutations from "./mutations";
import actions from "./actions";
import getters from "./getters.js";

import registerWeb3Store from "./web3store";
import registerWalletStore from "./wallet";
import registerMarketStore from "./market";
import registerBreedingStore from "./breed";
import registerFightStore from "./fight";

import { constants } from "./../util/constants";
const CMabi = require("./../abi/Cryptomon.json");
const MKabi = require("./../abi/Market.json");

Vue.use(Vuex);

const store = new Vuex.Store({
  strict: false,
  state,
  getters,
  mutations,
  actions
});
store.commit("setLoading", true);
registerWeb3Store(store, "w3");
registerMarketStore(store, "market");
registerWalletStore(store, "wallet");
registerBreedingStore(store, "breed");
registerFightStore(store, "fight");
store.dispatch("w3/initWeb3").then(() =>
  store
    .dispatch("registerCMContract", {
      json: CMabi,
      address: constants.addresses.CryptomonContract
    })
    .then(() =>
      store.dispatch("registerMKContract", {
        json: MKabi,
        address: constants.addresses.MarketContract
      })
    )
    .then(() => store.dispatch("market/registerEventCallbacks"))
    .then(() => store.dispatch("breed/registerEventCallbacks"))
    .then(() => store.dispatch("wallet/getWallet"))
    .then(() => {
      store.commit("setLoading", false);
      store.dispatch("market/fetchMarketData");
      store.dispatch("fight/getTokens");
      store.dispatch("breed/getBreedingTokens").then(() => {
        if (store.getters["breed/getBreedingTokens"].length > 0) {
          store.dispatch(
            "breed/hasHatched",
            store.getters["breed/getBreedingTokens"]
          );
        }
      });
    })
);

export default store;
