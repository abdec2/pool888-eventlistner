const ethers = require('ethers');
const contractABI = require('./abi/contract_abi.json');
const axios = require('axios').default();
require("dotenv").config();
const API_URL="";
const contractAddress = "0xF7379C2a2cBDA2B9a190c432248e4A6976DDa29D";


//=========================== API CALLS =========================




//=========================== API CALLS =========================

//=========================== EVENT HANDLERS =========================

async function DepositEventHandler(user, pid, amount, _packageId, event) {

}

async function TokenPurchasedEventHandler(user, lpToken, purchaseToken, amount, event) {

}

async function FeeDeductedEventHandler(user, pid, amount, event) {

}

async function WithdrawEventHandler(user, pid, amount, event) {

}


async function ReferralCommissionPaidEventHandler(user, referrer, commissionAmount, level, event) {

}

async function GratitudeRewardPaidEventHandler(to, from, commissionAmount, event) {

}

//=========================== EVENT HANDLERS =========================

//=========================== MAIN FUNCTION =========================
async function main() {
    const provider = new ethers.providers.WebSocketProvider(process.env.ALCHEMY_WEBSOCKET);

    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    contract.on('Deposit', DepositEventHandler)

    contract.on('TokenPurchased', TokenPurchasedEventHandler)

    contract.on('FeeDeducted', FeeDeductedEventHandler)

    contract.on('Withdraw', WithdrawEventHandler)

    contract.on('ReferralCommissionPaid', ReferralCommissionPaidEventHandler)

    contract.on('GratitudeRewardPaid', GratitudeRewardPaidEventHandler)

}

main();

// 0xC9881DBB8170B141d025904B6F5C399e62603072