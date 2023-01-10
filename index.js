const ethers = require('ethers');
const contractABI = require('./abi/contract_abi.json');
require("dotenv").config();

async function main() {
    const contractAddress = "0xC9881DBB8170B141d025904B6F5C399e62603072";
    const provider = new ethers.providers.WebSocketProvider(process.env.ALCHEMY_WEBSOCKET);

    const contract = new ethers.Contract(contractAddress, contractABI, provider);

    contract.on('Deposit', (user, pid, amount, _packageId, event) => {
        
    })

}

main();