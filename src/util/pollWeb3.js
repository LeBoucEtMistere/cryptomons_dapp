/* eslint-disable no-console */
import Web3 from "web3";
import { store } from "../store/";

// eslint-disable-next-line no-unused-vars
let pollWeb3 = async function(state) {
  let web3Provider;
  if (window.ethereum) {
    web3Provider = window.ethereum;
    try {
      // Request account access
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      throw new Error("User denied account access");
    }
  }
  // Legacy dapp browsers...
  else if (window.web3) {
    web3Provider = window.web3.currentProvider;
  }
  // If no injected web3 instance is detected, fall back to Ganache
  else {
    web3Provider = new Web3.providers.HttpProvider("http://localhost:7545");
  }
  const web3 = new Web3(web3Provider);

  setInterval(() => {
    if (web3 && store.state.web3.web3Instance) {
      if (web3.eth.coinbase !== store.state.web3.coinbase) {
        let newCoinbase = web3.eth.coinbase;
        web3.eth.getBalance(web3.eth.coinbase, function(err, newBalance) {
          if (err) {
            console.log(err);
          } else {
            store.dispatch("pollWeb3", {
              coinbase: newCoinbase,
              balance: parseInt(newBalance, 10)
            });
          }
        });
      } else {
        web3.eth.getBalance(store.state.web3.coinbase, (err, polledBalance) => {
          if (err) {
            console.log(err);
          } else if (parseInt(polledBalance, 10) !== store.state.web3.balance) {
            store.dispatch("pollWeb3", {
              coinbase: store.state.web3.coinbase,
              balance: polledBalance
            });
          }
        });
      }
    }
  }, 500);
};

export default pollWeb3;
