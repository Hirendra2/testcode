var ethers = require("ethers");
var url = "https://fufi.finance/rpc";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/WAzirxpProfile.json", "utf-8");

const abiArray = JSON.parse(abi);

var deployedContract = web3.eth.contract(abiArray).at("0x85e583a9B659FDae31AFab7b06F08327D29910d5");
//now you should be able to access contract methods
deployedContract.agencies.call({from:address}, function(err,data){
console.log(data);
});