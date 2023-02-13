var ethers = require("ethers");
var url = "https://fufi.finance/rpc";
require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || url);
const abi = fs.readFileSync("./abis/WAzirxpProfile.json", "utf-8");


let  data = "0x5Ac32b12daF2D5942403D3fc97f168Fa485C795C";
const polyganbalance = async (data) => {
    return new Promise(async function executor(resolve, reject) {
      const abiArray = JSON.parse(abi);
      var contract = new web3.eth.Contract(
        abiArray,
        process.env.WAzirxpProfile_CONTRACT_ADDRESS
      );
      let polyganbal = await contract.methods.datas(data).call();
      console.log("hhhhhhhhh",polyganbal)
      //return resolve(amounts);
    }).catch((e) => {
      console.log("polyganbal", e);
      return reject(e);
    });
  };


  polyganbalance(data);