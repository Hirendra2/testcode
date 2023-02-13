var ethers = require("ethers");
var url = "https://mainnet.infura.io/v3/6c40d12e1c37427fa68206ac0e0c1895";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/usdt.json", "utf-8");
const abi2 = fs.readFileSync("./abis/polygan.json", "utf-8");
const abi3 = fs.readFileSync("./abis/mana.json", "utf-8");
const abi4 = fs.readFileSync("./abis/shiba.json", "utf-8");

const Blaancesend = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var recipient = req.body.recipient;
  var type = req.body.type;

  if (type == "usdt") {
    await Usdttransfer(myAddress, privateKey, recipient)
      .then(async (re) => {
        console.log("Usdttransfer***********", re);
        res.status(201).send({ status: true, msg: re.msg });
      })
      .catch((e) => {
        console.log("eeeeeeeUsdttransfer", e);
      });
  } else if (type == "polygan") {
    await polygansends(myAddress, privateKey, recipient)
      .then(async (re) => {
        console.log("polygansends***********", re);
        res.status(201).send({ status: true, msg: re.msg });
      })
      .catch((e) => {
        console.log("eeeeeeeepolygansends", e);
      });
  } else if (type == "mana") {
    await manasends(myAddress, privateKey, recipient)
      .then(async (re) => {
        console.log("mana***********", re);
        res.status(201).send({ status: true, msg: re.msg });
      })
      .catch((e) => {
        console.log("eeeeemana", e);
      });
  } else if (type == "shiba") {
    await shibasends(myAddress, privateKey, recipient)
      .then(async (re) => {
        console.log("shibasends***********", re);

        res.status(201).send({ status: true, msg: re.msg });
      })
      .catch((e) => {
        console.log("eeeeeshibasends", e);
      });
  }
};

async function Usdttransfer(myAddress, privateKey, recipient) {
  return new Promise(async function executor(resolve, reject) {
    console.log(`web3 version: ${web3.version}`);
    var count = web3.eth.getTransactionCount(myAddress);
    console.log(`num transactions so far: ${count}`);
    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(
      abiArray,
      process.env.USDT_CONTRACT_ADDRESS,
      { from: myAddress }
    );
    var chainID = await web3.eth.net.getId();
    console.log(`ChainID: ${chainID}\n------------------------`);
    var amounts = web3.utils.toWei(amount, "ether");

    var gasPrices = await getCurrentGasPrices();
    var gasPriceGwei = gasPrices.low;
    console.log("gasPriceGwei", gasPriceGwei);
    var gasLimit = 800000;
    console.log("gasLimit", gasLimit);

    var rawTransaction = {
      from: myAddress,
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: process.env.USDT_CONTRACT_ADDRESS,
      value: "0x0",
      data: contract.methods.transfer(recipient, amounts).encodeABI(),
      chainId: chainID,
    };
    console.log(
      `Raw of Transaction: \n${JSON.stringify(
        rawTransaction,
        null,
        "\t"
      )}\n------------------------`
    );

    const signPromise = web3.eth.accounts.signTransaction(
      rawTransaction,
      privateKey
    );

    signPromise
      .then((signedTx) => {
        const sentTx = web3.eth.sendSignedTransaction(
          signedTx.raw || signedTx.rawTransaction
        );
        sentTx.on("receipt", (receipt) => {
          console.log("https://fufiscan.com/tx/" + receipt.transactionHash);
          return resolve(receipt.transactionHash);
        });
        sentTx.on("error", (err) => {
          console.log(err);
          reject(error);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

async function polygansends(myAddress, privateKey, recipient) {
  return new Promise(async function executor(resolve, reject) {
    console.log(`web3 version: ${web3.version}`);
    var count = web3.eth.getTransactionCount(myAddress);
    console.log(`num transactions so far: ${count}`);

    const abiArray = JSON.parse(abi2);
    var contract = new web3.eth.Contract(
      abiArray,
      process.env.MATIC_CONTRACT_ADDRESS,
      { from: myAddress }
    );

    var chainID = await web3.eth.net.getId();
    console.log(`ChainID: ${chainID}\n------------------------`);
    var amounts = web3.utils.toWei(amount, "ether");

    var gasPrices = await getCurrentGasPrices();
    var gasPriceGwei = gasPrices.low;
    console.log("gasPriceGwei", gasPriceGwei);
    var gasLimit = 800000;
    console.log("gasLimit", gasLimit);

    var rawTransaction = {
      from: myAddress,
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: process.env.MATIC_CONTRACT_ADDRESS,
      value: "0x0",
      data: contract.methods.transfer(recipient, amounts).encodeABI(),
      chainId: chainID,
    };
    console.log(
      `Raw of Transaction: \n${JSON.stringify(
        rawTransaction,
        null,
        "\t"
      )}\n------------------------`
    );

    const signPromise = web3.eth.accounts.signTransaction(
      rawTransaction,
      privateKey
    );

    signPromise
      .then((signedTx) => {
        const sentTx = web3.eth.sendSignedTransaction(
          signedTx.raw || signedTx.rawTransaction
        );
        sentTx.on("receipt", (receipt) => {
          console.log("https://fufiscan.com/tx/" + receipt.transactionHash);
          return resolve(receipt.transactionHash);
        });
        sentTx.on("error", (err) => {
          console.log(err);
          reject(error);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

async function manasends(myAddress, privateKey, recipient) {
  return new Promise(async function executor(resolve, reject) {
    console.log(`web3 version: ${web3.version}`);
    var count = web3.eth.getTransactionCount(myAddress);
    console.log(`num transactions so far: ${count}`);

    const abiArray = JSON.parse(abi3);
    var contract = new web3.eth.Contract(
      abiArray,
      process.env.MANA_CONTRACT_ADDRESS,
      { from: myAddress }
    );

    var chainID = await web3.eth.net.getId();
    console.log(`ChainID: ${chainID}\n------------------------`);
    var amounts = web3.utils.toWei(amount, "ether");

    var gasPrices = await getCurrentGasPrices();
    var gasPriceGwei = gasPrices.low;
    console.log("gasPriceGwei", gasPriceGwei);
    var gasLimit = 800000;
    console.log("gasLimit", gasLimit);

    var rawTransaction = {
      from: myAddress,
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: process.env.MANA_CONTRACT_ADDRESS,
      value: "0x0",
      data: contract.methods.transfer(recipient, amounts).encodeABI(),
      chainId: chainID,
    };
    console.log(
      `Raw of Transaction: \n${JSON.stringify(
        rawTransaction,
        null,
        "\t"
      )}\n------------------------`
    );

    const signPromise = web3.eth.accounts.signTransaction(
      rawTransaction,
      privateKey
    );

    signPromise
      .then((signedTx) => {
        const sentTx = web3.eth.sendSignedTransaction(
          signedTx.raw || signedTx.rawTransaction
        );
        sentTx.on("receipt", (receipt) => {
          console.log("https://fufiscan.com/tx/" + receipt.transactionHash);
          return resolve(receipt.transactionHash);
        });
        sentTx.on("error", (err) => {
          console.log(err);
          reject(err);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

async function shibasends(myAddress, privateKey, recipient) {
  return new Promise(async function executor(resolve, reject) {
    console.log(`web3 version: ${web3.version}`);
    var count = web3.eth.getTransactionCount(myAddress);
    console.log(`num transactions so far: ${count}`);

    const abiArray = JSON.parse(abi4);
    var contract = new web3.eth.Contract(
      abiArray,
      process.env.SHIBA_CONTRACT_ADDRESS,
      { from: myAddress }
    );

    var chainID = await web3.eth.net.getId();
    console.log(`ChainID: ${chainID}\n------------------------`);
    var amounts = web3.utils.toWei(amount, "ether");

    var gasPrices = await getCurrentGasPrices();
    var gasPriceGwei = gasPrices.low;
    console.log("gasPriceGwei", gasPriceGwei);
    var gasLimit = 800000;
    console.log("gasLimit", gasLimit);

    var rawTransaction = {
      from: myAddress,
      gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
      gasLimit: web3.utils.toHex(gasLimit),
      to: process.env.SHIBA_CONTRACT_ADDRESS,
      value: "0x0",
      data: contract.methods.transfer(recipient, amounts).encodeABI(),
      chainId: chainID,
    };
    console.log(
      `Raw of Transaction: \n${JSON.stringify(
        rawTransaction,
        null,
        "\t"
      )}\n------------------------`
    );

    const signPromise = web3.eth.accounts.signTransaction(
      rawTransaction,
      privateKey
    );

    signPromise
      .then((signedTx) => {
        const sentTx = web3.eth.sendSignedTransaction(
          signedTx.raw || signedTx.rawTransaction
        );
        sentTx.on("receipt", (receipt) => {
          console.log("https://fufiscan.com/tx/" + receipt.transactionHash);

          res.status(201).send({ status: true, msg: receipt.transactionHash });
        });
        sentTx.on("receipt", (receipt) => {
          console.log("https://fufiscan.com/tx/" + receipt.transactionHash);
          return resolve(receipt.transactionHash);
        });
        sentTx.on("error", (err) => {
          console.log(err);
          reject(err);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
}
