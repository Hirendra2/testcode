var ethers = require("ethers");
var url = "https://bsc-dataseed.binance.org/";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);

const bnbsends = async (req, res, next) => {
  let myAddress = req.body.myAddress;
  let privateKey = req.body.privateKey;
  let receiver = req.body.receiver;
  let amount = req.body.amount;

  await bnbsend(myAddress, privateKey, receiver, amount)
    .then(async (r) => {
      console.log("bnbsend***********", r);
    })
    .catch((e) => {
      console.log("eeeeeeebnbsend", e);
      res.status(404).send({ status: false, msg: "Failed" });
    });
};

async function bnbsend(myAddress, privateKey, receiver, amount) {
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

const bnbbalance = async (req, res, next) => {
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
module.exports = {
    bnbsends,
    bnbbalance
  ,}