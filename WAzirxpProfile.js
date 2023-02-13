var ethers = require("ethers");
var url = "https://fufi.finance/rpc";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/WAzirxpProfile.json", "utf-8");

const userkyc = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var names = req.body.names;
  var Email = req.body.Email;
  var Dob = req.body.Dob;
  var country = req.body.country;
  var address = req.body.address;
  var pannumber = req.body.pannumber;
  var aadhaarnumber = req.body.aadhaarnumber;

  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);
  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(
    abiArray,
    process.env.WAzirxpProfile_CONTRACT_ADDRESS,
    { from: myAddress }
  );
  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
  var gasPrices = await getCurrentGasPrices();
  var gasPriceGwei = gasPrices.low;
  console.log("gasPriceGwei", gasPriceGwei);
  var gasLimit = 800000;
  console.log("gasLimit", gasLimit);

  var rawTransaction = {
    from: myAddress,
    gasPrice: web3.utils.toHex(gasPriceGwei * 1e9),
    gasLimit: web3.utils.toHex(gasLimit),
    to: process.env.WAzirxpProfile_CONTRACT_ADDRESS,
    value: "0x0",
    data: contract.methods
      .hencode(names, Email, Dob, country, address, pannumber, aadhaarnumber)
      .encodeABI(),
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
      sentTx.on("error", (err) => {
        console.log(err);
        res.status(404).send({ status: false, msg: "Failed" });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const userdetails = async (req, res, next) => {
  let myAddress = req.body.myAddress;
  await getdecodedata(myAddress)
    .then(async (data) => {
      console.log("getdecodedata***", data);
      await getuserdata(data).then(async (re) => {
          console.log("getuserdata**", re);
          res.status(201).send({status:true,data:re})

        })
        .catch((e) => {
          console.log("eesgetdecodedata", e);
        });
    })
    .catch((e) => {
      console.log("eeR33", e);
      res.status(404).send({ status: false, msg: "Failed" });
    });
};

async function getdecodedata(myAddress) {
  return new Promise(async function executor(resolve, reject) {
    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(
      abiArray,
      process.env.WAzirxpProfile_CONTRACT_ADDRESS
    );
    let usdtbalance = await contract.methods.decodedata(myAddress).call();
    return resolve(usdtbalance);
  }).catch(function (error) {
    console.log(error);
    reject(error);
  });
}

const getuserdata = async (data) => {
  return new Promise(async function executor(resolve, reject) {
    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract(
      abiArray,
      process.env.WAzirxpProfile_CONTRACT_ADDRESS
    );
    let polyganbal = await contract.methods.decode(data).call();
      console.log("hhhhhhhhh",polyganbal)
    return resolve(polyganbal);
  }).catch((e) => {
    console.log("polyganbal", e);
    return reject(e);
  });
};








async function getCurrentGasPrices() {
  let response = await axios.get(
    "https://ethgasstation.info/json/ethgasAPI.json"
  );
  let prices = {
    low: response.data.safeLow / 10,
    medium: response.data.average / 10,
    high: response.data.fast / 10,
  };
  return prices;
}

module.exports = {
  userkyc,
  userdetails,
  
  
};
