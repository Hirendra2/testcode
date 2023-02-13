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

const getBlaance = async (req, res, next) => {
  let myAddress = req.body.myAddress;
  await usdtbalance(myAddress).then(async (r) => {
      console.log("usdtbalance***", r);
      await polyganbalance(myAddress).then(async (re) => {
          console.log("polyganbalance**", re);
          await manabalance(myAddress).then(async (ree) => {
              console.log("manabalance****", ree);
              await shibabalance(myAddress).then(async (reee) => {
                console.log("shibabalance****", reee);
                res.status(201).send({status:true,data:{r,re ,ree,reee,}})
  
              })
              .catch((e) => {
                console.log("eesidR33poolupdate", e);
              });
            })
            .catch((e) => {
              console.log("eesidR33poolupdate", e);
            });
        })
        .catch((e) => {
          console.log("eesidR33poolupdate", e);
        });
    })
    .catch((e) => {
      console.log("eeR33", e);
      res.status(404).send({ status: false, msg: "Failed" });
    });
};

async function usdtbalance(myAddress) {
  return new Promise(async function executor(resolve, reject) {
    const abiArray = JSON.parse(abi);
    var contract = new web3.eth.Contract( abiArray,process.env.USDT_CONTRACT_ADDRESS );
    let usdtbalance = await contract.methods.balanceOf(myAddress).call();
    var amounts =parseFloat(usdtbalance)/1000000;
    return resolve(amounts);
  }).catch(function (error) {
    console.log(error);
    reject(error)
  });
}

const polyganbalance = async (myAddress) => {
  return new Promise(async function executor(resolve, reject) {
    const abiArray = JSON.parse(abi2);
    var contract = new web3.eth.Contract(abiArray, process.env.MATIC_CONTRACT_ADDRESS);
    let polyganbal = await contract.methods.balanceOf(myAddress).call();
    var amounts =  web3.utils.fromWei(polyganbal.toString(), 'ether');
    return resolve(amounts);
  }).catch((e) => {
    console.log("polyganbal", e);
    return reject(e);
  });
};

const manabalance = async (myAddress) => {
  return new Promise(async function executor(resolve, reject) {
    const abiArray = JSON.parse(abi3);
    var contract = new web3.eth.Contract(abiArray, process.env.MANA_CONTRACT_ADDRESS);
    let userbalance = await contract.methods.balanceOf(myAddress).call();
    var amounts =  web3.utils.fromWei(userbalance.toString(), 'ether');
    return resolve(amounts);
  }).catch((e) => {
    console.log("eeR33", e);
    return reject(e);
  });
};

const shibabalance = async (myAddress) => {
  return new Promise(async function executor(resolve, reject) {
    const abiArray = JSON.parse(abi4);
    var contract = new web3.eth.Contract(abiArray, process.env.SHIBA_CONTRACT_ADDRESS);
    let shibabalance = await contract.methods.balanceOf(myAddress).call();
    var amounts =  web3.utils.fromWei(shibabalance.toString(), 'ether');
    return resolve(amounts);
  }).catch((e) => {
    console.log("eeR33", e);
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
    getBlaance,
};
