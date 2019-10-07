"use strict";
const fs = require('fs');
const config = require('../../configs/config');
let gethWebsocketUrl = config.geth.gethWebsocketUrl;
const Web3 = require('web3');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || gethWebsocketUrl);
const unlockAccount = require('../unlock');

module.exports = async function deploy_QueryRegistry_contract() {
    let QueryRegistry_Bytecode = config.QueryRegistry.bytecode;
    let QueryRegistry_Abi = config.QueryRegistry.abi;
    //取得目前geth中第一個account
    let nowAccount = "";
    await web3.eth.getAccounts((err, res) => { nowAccount = res[0] });

    let password = config.geth.password;
    let RM = new web3.eth.Contract(QueryRegistry_Abi);

    // 解鎖
    let unlock = await unlockAccount(nowAccount, password);
    if (!unlock) {
        console.log(`not unlock`);
        return;
    }

    return new Promise((resolve, reject) => {
        let result = {};
        RM
            .deploy({
                data: QueryRegistry_Bytecode
            })
            .send({
                from: nowAccount,
                gas: 6000000
            })
            .on('error', function (error) {
                result.info = error;
                result.status = false;
                reject(result);
            })
            .on("receipt", function (receipt) {
                console.log(receipt);
                // 更新合約介面
                let QueryRegistry_Address = receipt.contractAddress;
                result.status = true;
                result.address = QueryRegistry_Address;
                //將新生成的RM地址寫進.txt檔案
                fs.writeFileSync('./QueryRegistry_Address.txt', result.address);
                resolve(result);
            })
    });

};

