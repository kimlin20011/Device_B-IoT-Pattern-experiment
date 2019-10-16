"use strict";
const fs = require('fs');
const config = require('../../configs/config');
let gethWebsocketUrl = config.geth.gethWebsocketUrl;
const Web3 = require('web3');
// use the given Provider, e.g in Mist, or instantiate a new websocket provider
const web3 = new Web3(Web3.givenProvider || gethWebsocketUrl);
const unlockAccount = require('../unlock');

module.exports = async function deploy_OFEI_QueryRegistry_contract() {
    let OFEI_QueryRegistry_Bytecode = config.OFEI_QueryRegistry.bytecode;
    let OFEI_QueryRegistry_Abi = config.OFEI_QueryRegistry.abi;
    //取得目前geth中第一個account
    let nowAccount = "";
    await web3.eth.getAccounts((err, res) => { nowAccount = res[0] });

    let password = config.geth.password;
    let QR = new web3.eth.Contract(OFEI_QueryRegistry_Abi);

    // 解鎖
    let unlock = await unlockAccount(nowAccount, password);
    if (!unlock) {
        console.log(`not unlock`);
        return;
    }

    return new Promise((resolve, reject) => {
        let result = {};
        QR
            .deploy({
                data: OFEI_QueryRegistry_Bytecode
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
                // 更新合約介面
                result.address = receipt.contractAddress;
                //將新生成的RM地址寫進.txt檔案
                fs.writeFileSync('./OFEI_QueryRegistry_Address.txt', result.address);
                resolve(result);
            })
    });

};

