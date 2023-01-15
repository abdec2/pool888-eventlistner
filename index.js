const ethers = require('ethers');
const contractABI = require('./abi/contract_abi.json');
const tokenABI = require('./abi/tokenAbi.json');
const axios = require('axios');
require("dotenv").config();
const api_token = process.env.API_TOKEN;
const api_url = process.env.API_URL;
const contractAddress = process.env.CONTRACT_ADDRESS;

async function getTokenDecimalsByPid(pid) {
    const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_RPC);
    const stakingcontract = new ethers.Contract(contractAddress, contractABI, provider);
    const poolInfo = await stakingcontract.poolInfo(pid);
    const tokenContract = new ethers.Contract(poolInfo.lpToken, tokenABI, provider);
    const decimals = await tokenContract.decimals();
    return decimals
}


//=========================== EVENT HANDLERS =========================

async function DepositEventHandler(user, pid, amount, _packageId, event) {

    // get pool info like token address and its decimals
    const decimals = await getTokenDecimalsByPid(pid);
    console.log('deposit', user)
    // transaction type staking

    // fetch wallet by wallet address which is user  
    // api url = /api/wallets?filters[wallet_address]=${user}&populate[users_permissions_user]=true

    const url = `/api/wallets?filters[wallet_address]=${user}&populate[users_permissions_user]=true`;
    const res = await axios.get(`${api_url + url}`,{
        headers: {
            'Authorization': `Bearer ${api_token}`
        }
    })
    const data = res.data.data
    if (data.length > 0) {
        // create transaction entry with type staking, amount, wallet_id, user_id
        await axios.post(`${api_url}/api/transactions`, {
            data: {
                type: 'staking',
                amount: ethers.utils.formatUnits(amount, decimals.toString()),
                wallet: data[0].id,
                users_permissions_user: data[0].attributes.users_permissions_user.data.id
            }
        }, {
            headers: {
                'Authorization': `Bearer ${api_token}`
            }
        })
    }

}

async function TokenPurchasedEventHandler(user, lpToken, purchaseToken, amount, event) {

    // get lpToken details
    const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_RPC);
    const tokenContract = new ethers.Contract(lpToken, tokenABI, provider);
    const decimals = await tokenContract.decimals();
    
    console.log('token purchase', user)
    // transaction type = tokenspurchase

    // fetch wallet by wallet address which is user  
    // api url = /api/wallets?filters[wallet_address]=${user}&populate[users_permissions_user]=true

    const url = `/api/wallets?filters[wallet_address]=${user}&populate[users_permissions_user]=true`;
    const res = await axios.get(`${api_url + url}`, {
        headers: {
            'Authorization': `Bearer ${api_token}`
        }
    })
    const data = res.data.data
    if (data.length > 0) {
        // create transaction entry with type tokenspurchase, amount, wallet_id, user_id
        await axios.post(`${api_url}/api/transactions`, {
            data: {
                type: 'tokenspurchase',
                amount: ethers.utils.formatUnits(amount, decimals.toString()),
                wallet: data[0].id,
                users_permissions_user: data[0].attributes.users_permissions_user.data.id
            }
        }, {
            headers: {
                'Authorization': `Bearer ${api_token}`
            }
        })
    }

}

async function FeeDeductedEventHandler(user, pid, amount, event) {

    // get pool info like token address and its decimals

    const decimals = await getTokenDecimalsByPid(pid);
    console.log('fee deduction', user)
    // transaction type feededucted

    // fetch wallet by wallet address which is user  
    // api url = /api/wallets?filters[wallet_address]=${user}&populate[users_permissions_user]=true

    const url = `/api/wallets?filters[wallet_address]=${user}&populate[users_permissions_user]=true`;
    const res = await axios.get(`${api_url + url}`, {
        headers: {
            'Authorization': `Bearer ${api_token}`
        }
    })
    const data = res.data.data
    if (data.length > 0) {
        // create transaction entry with type feededucted, amount, wallet_id, user_id
        await axios.post(`${api_url}/api/transactions`, {
            data:{
                type: 'feededucted',
                amount: ethers.utils.formatUnits(amount, decimals.toString()),
                wallet: data[0].id,
                users_permissions_user: data[0].attributes.users_permissions_user.data.id
            }
        }, {
            headers: {
                'Authorization': `Bearer ${api_token}`
            }
        })
    }
}

async function WithdrawEventHandler(user, pid, amount, event) {

    // get pool info like token address and its decimals
    const decimals = await getTokenDecimalsByPid(pid);
    console.log('withdraw', user)
    // transaction type withdrawal

    if(parseInt(ethers.utils.formatUnits(amount, decimals.toString())) === 0) {
        return
    }

    // fetch wallet by wallet address which is user  
    // api url = /api/wallets?filters[wallet_address]=${user}&populate[users_permissions_user]=true

    const url = `/api/wallets?filters[wallet_address]=${user}&populate[users_permissions_user]=true`;
    const res = await axios.get(`${api_url + url}`, {
        headers: {
            'Authorization': `Bearer ${api_token}`
        }
    });
    const data = res.data.data;
    if (data.length > 0) {
        // create transaction entry with type withdrawal, amount, wallet_id, user_id
        await axios.post(`${api_url}/api/transactions`, {
            data: {
                type: 'withdrawal',
                amount: ethers.utils.formatUnits(amount, decimals.toString()),
                wallet: data[0].id,
                users_permissions_user: data[0].attributes.users_permissions_user.data.id
            }
        }, {
            headers: {
                'Authorization': `Bearer ${api_token}`
            }
        })
    }
}

async function HarvestEventHandler(user, amount, event) {

    // transaction type harvest
    console.log('harvest', user)
    // fetch wallet by wallet address which is user  
    // api url = /api/wallets?filters[wallet_address]=${user}&populate[users_permissions_user]=true

    const url = `/api/wallets?filters[wallet_address]=${user}&populate[users_permissions_user]=true`;
    const res = await axios.get(`${api_url + url}`, {
        headers: {
            'Authorization': `Bearer ${api_token}`
        }
    });
    const data = res.data.data;
    if (data.length > 0) {
        // create transaction entry with type harvest, amount, wallet_id, user_id
        await axios.post(`${api_url}/api/transactions`, {
            data: {
                type: 'harvest',
                amount: ethers.utils.formatUnits(amount, 8),
                wallet: data[0].id,
                users_permissions_user: data[0].attributes.users_permissions_user.data.id
            }
        }, {
            headers: {
                'Authorization': `Bearer ${api_token}`
            }
        })
    }
}

async function ReferralCommissionPaidEventHandler(user, referrer, commissionAmount, level, event) {
    // transaction type commission
    console.log('referral', user)
    // fetch wallet by wallet address which is user  
    const url = `/api/wallets?filters[wallet_address]=${user}&populate[users_permissions_user]=true`;
    const res = await axios.get(`${api_url + url}`, {
        headers: {
            'Authorization': `Bearer ${api_token}`
        }
    });
    const data = res.data.data;

    // fetch referrer wallet by referrer wallet address 
    const url2 = `/api/wallets?filters[wallet_address]=${referrer}&populate[users_permissions_user]=true`;
    const resp = await axios.get(`${api_url + url2}`, {
        headers: {
            'Authorization': `Bearer ${api_token}`
        }
    });
    const parentData = resp.data.data;

    if (data.length > 0 && parentData.length > 0) {
        // fetch referral by passing user as a child wallet refferrer as parent wallet and level
        const refUrl = `/api/referrals?filters[level]=${level}&filters[parent_wallet]=${parentData[0].id}&filters[child_wallet]=${data[0].id}`
        const response = await axios.get(`${api_url + refUrl}`, {
            headers: {
                'Authorization': `Bearer ${api_token}`
            }
        });
        const referralData = response.data.data;

        if(referralData.length > 0) {
            // create transaction entry with type commission, amount, wallet_id, user_id
            await axios.post(`${api_url}/api/transactions`, {
                data: {
                    type: 'commission',
                    amount: ethers.utils.formatUnits(commissionAmount, 8),
                    referral: referralData[0].id,
                    wallet: parentData[0].id,
                    users_permissions_user: data[0].attributes.users_permissions_user.data.id
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${api_token}`
                }
            })
        }
    }
}

async function GratitudeRewardPaidEventHandler(to, from, commissionAmount, event) {
     // transaction type commission
     console.log('gratitude', to)
    // fetch wallet by wallet address which is user  
    const url = `/api/wallets?filters[wallet_address]=${to}&populate[users_permissions_user]=true`;
    const res = await axios.get(`${api_url + url}`, {
        headers: {
            'Authorization': `Bearer ${api_token}`
        }
    });
    const data = res.data.data;

    // fetch referrer wallet by referrer wallet address 
    const url2 = `/api/wallets?filters[wallet_address]=${from}&populate[users_permissions_user]=true`;
    const resp = await axios.get(`${api_url + url2}`, {
        headers: {
            'Authorization': `Bearer ${api_token}`
        }
    });
    const parentData = resp.data.data;

    if (data.length > 0 && parentData.length > 0) {
         // create transaction entry with type gratitude, commissionAmount, wallet_id, user_id
         await axios.post(`${api_url}/api/transactions`, {
            data: {
                type: 'gratitude',
                amount: ethers.utils.formatUnits(commissionAmount, 8),
                wallet: data[0].id,
                users_permissions_user: data[0].attributes.users_permissions_user.data.id,
                parent_wallet: parentData[0].id
            }
        }, {
            headers: {
                'Authorization': `Bearer ${api_token}`
            }
        })
    }
}

//=========================== EVENT HANDLERS =========================

//=========================== MAIN FUNCTION =========================
async function main() {
    try {
        const provider = new ethers.providers.WebSocketProvider(process.env.ALCHEMY_WEBSOCKET);

        const contract = new ethers.Contract(contractAddress, contractABI, provider);

        contract.on('Deposit', (user, pid, amount, _packageId, event) => {
            setTimeout(()=> {
                DepositEventHandler(user, pid, amount, _packageId, event)
            }, 30000)
        })

        contract.on('TokenPurchased', (user, lpToken, purchaseToken, amount, event) => {
            setTimeout(()=> {
                TokenPurchasedEventHandler(user, lpToken, purchaseToken, amount, event)
            }, 30000)
        })

        contract.on('FeeDeducted', (user, pid, amount, event) => {
            setTimeout(()=> {
                FeeDeductedEventHandler(user, pid, amount, event)
            }, 30000)
        })

        contract.on('Withdraw', WithdrawEventHandler)

        contract.on('ReferralCommissionPaid', ReferralCommissionPaidEventHandler)

        contract.on('GratitudeRewardPaid', GratitudeRewardPaidEventHandler)

        contract.on('Harvest', HarvestEventHandler)
    } catch(e) {
        console.log(e)
    }
 
}

main();

