var ethers = require("ethers");
var url = "https://mainnet.infura.io/v3/6c40d12e1c37427fa68206ac0e0c1895";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync('./abis/usdt.json','utf-8');
const abi2 = fs.readFileSync('./abis/polygan.json','utf-8');
const abi3 = fs.readFileSync("./abis/mana.json", "utf-8");
const abi4 = fs.readFileSync("./abis/shiba.json", "utf-8");

const Ethsends = async (req, res, next) => {
  let myAddress = req.body.myAddress;
  let privateKey = req.body.privateKey;
  let receiver = req.body.receiver;
  let amount = req.body.amount;

  await Ethsend(myAddress, privateKey, receiver, amount)
    .then(async (r) => {
      console.log("Fufiburn***********", r);
    })
    .catch((e) => {
      console.log("eewithrefferalFUfiBurns", e);
      res.status(404).send({ status: false, msg: "Failed" });
    });
};

async function Ethsend(myAddress, privateKey, receiver, amount) {
  return new Promise(async function executor(resolve, reject) {
    console.log(
      `Attempting to make transaction from ${myAddress} to ${receiver}`
    );
    let amounts = parseFloat(amount) / 0.01143;
    const createTransaction = await web3.eth.accounts.signTransaction(
      {
        from: myAddress,
        to: receiver,
        value: web3.utils.toWei(amounts.toString(), "ether"),
        gas: "21000",
      },
      privateKey
    );
    const createReceipt = await web3.eth.sendSignedTransaction(
      createTransaction.rawTransaction
    );
    console.log(
      `Transaction successful with hash: ${createReceipt.transactionHash}`
    );
    return resolve(createReceipt.transactionHash);
  });
}

const Ethbalance = async (req, res, next) => {
    let myAddress = req.body.myAddress;
    const web3 = new Web3(new Web3.providers.HttpProvider(url));
    web3.eth.getBalance(myAddress, function (err, result) {
      var amounts = web3.utils.fromWei(result, "ether");
        console.log("amounts", amounts);
        res.status(200).send({ status: true, msg: amounts });
    
  }).catch(function (error) {
    console.log(error);
    res.status(404).send({ status: false, msg: "Failed" });
});
};


const Usdttransfer   = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var receiver = req.body.receiver;
  var amount = req.body.amount;


  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi);
  var contract = new web3.eth.Contract(abiArray, process.env.USDT_CONTRACT_ADDRESS, {from: myAddress,});

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
  var amounts =  web3.utils.toWei(amount, 'ether');

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
    data: contract.methods.transfer(receiver,amounts).encodeABI(),
    chainId: chainID,
  };
  console.log(`Raw of Transaction: \n${JSON.stringify(rawTransaction,null,"\t")}\n------------------------`);

  const signPromise = web3.eth.accounts.signTransaction(rawTransaction,privateKey);

  signPromise
    .then((signedTx) => {
      const sentTx = web3.eth.sendSignedTransaction(
        signedTx.raw || signedTx.rawTransaction
      );
      sentTx.on("receipt", (receipt) => {
        console.log("https://fufiscan.com/tx/" + receipt.transactionHash);

        res.status(201).send({status:true,msg:receipt.transactionHash})
      });
      sentTx.on("error", (err) => {
        console.log(err);
        res.status(404).send({status:false,msg:"Failed"})
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const Usdtbal = async (req, res, next) => {
  var myAddress = req.body.myAddress;
   const abiArray = JSON.parse(abi);
   var contract = new web3.eth.Contract(abiArray, process.env.USDT_CONTRACT_ADDRESS);
   let userbalance = await contract.methods.balanceOf(myAddress).call();
   var amounts =  web3.utils.fromWei(userbalance.toString(), 'ether');
  res.status(201).send({status:true,data:amounts})
 
};

const polygansends   = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var receiver = req.body.receiver;
  var amount = req.body.amount;


  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi2);
  var contract = new web3.eth.Contract(abiArray, process.env.MATIC_CONTRACT_ADDRESS, {from: myAddress,});

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
  var amounts =  web3.utils.toWei(amount, 'ether');

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
    data: contract.methods.transfer(receiver,amounts).encodeABI(),
    chainId: chainID,
  };
  console.log(`Raw of Transaction: \n${JSON.stringify(rawTransaction,null,"\t")}\n------------------------`);

  const signPromise = web3.eth.accounts.signTransaction(rawTransaction,privateKey);

  signPromise
    .then((signedTx) => {
      const sentTx = web3.eth.sendSignedTransaction(
        signedTx.raw || signedTx.rawTransaction
      );
      sentTx.on("receipt", (receipt) => {
        console.log("https://fufiscan.com/tx/" + receipt.transactionHash);

        res.status(201).send({status:true,msg:receipt.transactionHash})
      });
      sentTx.on("error", (err) => {
        console.log(err);
        res.status(404).send({status:false,msg:"Failed"})
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const polyganbal = async (req, res, next) => {
  var myAddress = req.body.myAddress;
   const abiArray = JSON.parse(abi);
   var contract = new web3.eth.Contract(abiArray, process.env.MATIC_CONTRACT_ADDRESS);
   let userbalance = await contract.methods.balanceOf(myAddress).call();
   var amounts =  web3.utils.fromWei(userbalance.toString(), 'ether');
  res.status(201).send({status:true,data:amounts})
 
};

const manasends   = async (req, res, next) => {
  var myAddress = req.body.myAddress;
  var privateKey = req.body.privateKey;
  var receiver = req.body.receiver;
  var amount = req.body.amount;


  console.log(`web3 version: ${web3.version}`);
  var count = web3.eth.getTransactionCount(myAddress);
  console.log(`num transactions so far: ${count}`);

  const abiArray = JSON.parse(abi2);
  var contract = new web3.eth.Contract(abiArray, process.env.MANA_CONTRACT_ADDRESS, {from: myAddress,});

  var chainID = await web3.eth.net.getId();
  console.log(`ChainID: ${chainID}\n------------------------`);
  var amounts =  web3.utils.toWei(amount, 'ether');

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
    data: contract.methods.transfer(receiver,amounts).encodeABI(),
    chainId: chainID,
  };
  console.log(`Raw of Transaction: \n${JSON.stringify(rawTransaction,null,"\t")}\n------------------------`);

  const signPromise = web3.eth.accounts.signTransaction(rawTransaction,privateKey);

  signPromise
    .then((signedTx) => {
      const sentTx = web3.eth.sendSignedTransaction(
        signedTx.raw || signedTx.rawTransaction
      );
      sentTx.on("receipt", (receipt) => {
        console.log("https://fufiscan.com/tx/" + receipt.transactionHash);

        res.status(201).send({status:true,msg:receipt.transactionHash})
      });
      sentTx.on("error", (err) => {
        console.log(err);
        res.status(404).send({status:false,msg:"Failed"})
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const manabal = async (req, res, next) => {
  var myAddress = req.body.myAddress;
   const abiArray = JSON.parse(abi);
   var contract = new web3.eth.Contract(abiArray, process.env.MANA_CONTRACT_ADDRESS);
   let userbalance = await contract.methods.balanceOf(myAddress).call();
   var amounts =  web3.utils.fromWei(userbalance.toString(), 'ether');
  res.status(201).send({status:true,data:amounts})
 
};

const shibabalance = async (req, res, next) => {
  var myAddress = req.body.myAddress;

  const abiArray = JSON.parse(abi4);
  var contract = new web3.eth.Contract(abiArray, process.env.SHIBA_CONTRACT_ADDRESS);
  let shibabalance = await contract.methods.balanceOf(myAddress).call();
  var amounts =  web3.utils.fromWei(shibabalance.toString(), 'ether');
  res.status(201).send({status:true,data:amounts})
 
};



module.exports = {
  Ethsends,
  Ethbalance,
  Usdttransfer,
  Usdtbal,
  polygansends,
  polyganbal,
  manasends,
  manabal,
  shibabalance
  ,}