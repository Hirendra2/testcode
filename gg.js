var ethers = require("ethers");
var url = "https://fufi.finnance/rpc";

const Web3 = require('web3');
console.log(Web3.version);
// => 1.0.0-beta.34
var web3 = new Web3('https://cryptoxin.in/rpc');
const transactionHash = '0x0d6ba8d80eae98eb07bce70e728a9586a93df030bc4360e3d28d8ed7ac502219';
web3.eth.getTransaction(transactionHash, function (error, result){
    console.log(result);
});