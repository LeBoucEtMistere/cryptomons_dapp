/* eslint-disable no-console */
import Web3 from "web3";
const sleep = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));

export default {
  setAddress: ({ commit }, address) => {
    commit("setAddress", address);
  },
  connectToWeb3: ({ commit }) =>
    new Promise((resolve, reject) => {
      console.log("Action connect to Web3");
      if (window.ethereum) {
        window.ethereum
          .enable()
          .then(async () => {
            window.web3 = window.ethereum;
            const w3 = new Web3(window.web3);
            const isInject = await w3.eth.net.isListening();
            commit("setInjected", isInject);
            commit("setInstance", () => w3);
            commit("setLocal", false);
            resolve(w3);
          })
          .catch(error => reject(error));
      }
    }),
  getBlockchainNetwork: ({ commit, state }) =>
    new Promise((resolve, reject) => {
      state
        .instance()
        .eth.net.getNetworkType()
        .then(network => {
          commit("setNetwork", network);
          resolve(network);
        })
        .catch(error => reject(error));
    }),

  getCoinbase: ({ commit, state }) =>
    new Promise((resolve, reject) => {
      state.instance().eth.getCoinbase((err, coinbase) => {
        if (err) {
          if (state.address) {
            commit("setCoinbase", state.address);
            resolve(state.address);
          }
          reject(err);
        } else {
          if (state.coinbase !== coinbase)
            commit("setCoinbase", coinbase || state.address);
          resolve(coinbase);
        }
      });
    }),

  getBalance: ({ commit, state }) =>
    new Promise((resolve, reject) => {
      const coinbase = state.coinbase;
      if (!coinbase) {
        return resolve("0");
      }
      state.instance().eth.getBalance(state.coinbase, (err, result) => {
        if (err) {
          reject(err);
        } else {
          const balance = state
            .instance()
            .utils.fromWei(result.toString(10), "ether");
          if (state.balance !== balance) commit("setBalance", balance);
          resolve(balance);
        }
      });
    }),

  async monitorWeb3({ state, dispatch }) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      await sleep(1000);
      try {
        const address = await dispatch("getCoinbase");
        if (address !== state.address) {
          console.log("address changed");
          dispatch("setLoading", true, { root: true });
          await dispatch("setAddress", address);
          await dispatch("checkAdmin", {}, { root: true });
          await dispatch("wallet/initWallet", {}, { root: true });
          dispatch("setLoading", false, { root: true });
        }
      } catch (err) {
        console.log("get coinbase error:", err);
      }
      try {
        await dispatch("getBalance");
      } catch (err) {
        console.log("get balance error:", err);
      }
    }
  },

  async initWeb3({ dispatch, commit, state }) {
    await dispatch("connectToWeb3");
    await dispatch("getBlockchainNetwork");
    try {
      commit("setAddress", await dispatch("getCoinbase"));
    } catch (err) {
      console.log("get coinbase error:", err);
    }
    try {
      await dispatch("getBalance");
    } catch (err) {
      console.log("get balance error:", err);
    }
    state.instance().eth.defaultAccount = state.address;
    dispatch("monitorWeb3");
  }
};
