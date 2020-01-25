import Web3 from "web3";

/*
 * 1. Check for injected web3 (mist/metamask)
 * 2. If metamask/mist create a new web3 instance and pass on result
 * 3. Get networkId - Now we can check the user is connected to the right network to use our dApp
 * 4. Get user account from metamask
 * 5. Get user balance
 */

let getWeb3 = new Promise(async function(resolve, reject) {
  // Check for injected web3 (mist/metamask)
  // Modern dapp browsers...
  let web3Provider;
  if (window.ethereum) {
    web3Provider = window.ethereum;
    try {
      // Request account access
      await window.ethereum.enable();
    } catch (error) {
      // User denied account access...
      reject(new Error("User denied account access"));
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
  const web3Instance = new Web3(web3Provider);

  resolve({
    injectedWeb3: true,
    web3Instance: web3Instance,
    web3Provider: web3Provider
  });
})
  .then(result => {
    return new Promise(function(resolve) {
      // Retrieve network ID
      result.web3Instance.eth.net.getNetworkType().then(networkId => {
        // Assign the networkId property to our result and resolve promise
        result = Object.assign({}, result, { networkId });
        resolve(result);
      });
    });
  })
  .then(result => {
    return new Promise(function(resolve, reject) {
      // Retrieve coinbase
      result.web3Instance.eth.getCoinbase((err, coinbase) => {
        if (err) {
          reject(new Error("Unable to retrieve coinbase"));
        } else {
          result = Object.assign({}, result, { coinbase });
          resolve(result);
        }
      });
    });
  })
  .then(result => {
    return new Promise(function(resolve, reject) {
      // Retrieve balance for coinbase
      result.web3Instance.eth.getBalance(result.coinbase, (err, balance) => {
        if (err) {
          reject(
            new Error(
              "Unable to retrieve balance for address: " + result.coinbase
            )
          );
        } else {
          result = Object.assign({}, result, { balance });
          resolve(result);
        }
      });
    });
  });

export default getWeb3;
